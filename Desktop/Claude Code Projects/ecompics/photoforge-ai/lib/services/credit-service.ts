import { prisma } from '@/lib/prisma'
import { getTierConfig, calculateRollover } from '@/lib/config/pricing'
import type { TierName } from '@/lib/config/pricing'

export class CreditService {
  /**
   * Process monthly credit reset with rollover for a user
   * Called automatically via cron job or manually
   */
  async resetMonthlyCredits(userId: string): Promise<{
    success: boolean
    previousBalance: number
    newBalance: number
    rolledOverAmount: number
    monthlyCredits: number
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tier: true,
        creditsBalance: true,
        monthlyCredits: true,
        rolloverCap: true,
        lastCreditReset: true
      }
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const tierConfig = getTierConfig(user.tier as TierName)
    const previousBalance = user.creditsBalance

    // Calculate new balance with rollover cap
    const newBalance = calculateRollover(
      previousBalance,
      tierConfig.monthlyCredits,
      tierConfig.rolloverCap
    )

    const rolledOverAmount = Math.min(
      Math.max(0, previousBalance),
      tierConfig.rolloverCap
    )

    // Update user credits and reset date
    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsBalance: newBalance,
        creditsUsedThisMonth: 0,
        lastCreditReset: new Date(),
        monthlyCredits: tierConfig.monthlyCredits,
        rolloverCap: tierConfig.rolloverCap
      }
    })

    // Create credit transaction record
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: tierConfig.monthlyCredits,
        type: 'monthly_reset',
        description: `Monthly credit reset: ${tierConfig.monthlyCredits} new credits + ${rolledOverAmount} rolled over (cap: ${tierConfig.rolloverCap})`
      }
    })

    return {
      success: true,
      previousBalance,
      newBalance,
      rolledOverAmount,
      monthlyCredits: tierConfig.monthlyCredits
    }
  }

  /**
   * Update user tier and sync credit allocations
   * Called when subscription changes
   */
  async updateUserTier(
    userId: string,
    newTier: TierName
  ): Promise<void> {
    const tierConfig = getTierConfig(newTier)

    await prisma.user.update({
      where: { id: userId },
      data: {
        tier: newTier,
        monthlyCredits: tierConfig.monthlyCredits,
        rolloverCap: tierConfig.rolloverCap
      }
    })

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: 0,
        type: 'tier_change',
        description: `Tier updated to ${tierConfig.displayName} (${tierConfig.monthlyCredits} credits/month, ${tierConfig.rolloverCap} rollover cap)`
      }
    })
  }

  /**
   * Add à la carte credits to user account
   * Called after successful Stripe payment
   */
  async addAlaCarteCredits(
    userId: string,
    credits: number,
    stripePaymentIntentId: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditsBalance: true }
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const newBalance = user.creditsBalance + credits

    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsBalance: newBalance
      }
    })

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: credits,
        type: 'purchase',
        description: `À la carte purchase: ${credits} credits (Payment: ${stripePaymentIntentId})`
      }
    })
  }

  /**
   * Deduct credits for job processing
   * Called when job is created
   */
  async deductCredits(
    userId: string,
    amount: number,
    jobId: string,
    description: string
  ): Promise<{
    success: boolean
    newBalance: number
    insufficientCredits: boolean
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        creditsBalance: true,
        creditsUsedThisMonth: true
      }
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    if (user.creditsBalance < amount) {
      return {
        success: false,
        newBalance: user.creditsBalance,
        insufficientCredits: true
      }
    }

    const newBalance = user.creditsBalance - amount
    const newUsedThisMonth = user.creditsUsedThisMonth + amount

    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsBalance: newBalance,
        creditsUsedThisMonth: newUsedThisMonth
      }
    })

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type: 'usage',
        description,
        jobId
      }
    })

    return {
      success: true,
      newBalance,
      insufficientCredits: false
    }
  }

  /**
   * Refund credits if job failed
   * Called when job processing fails
   */
  async refundCredits(
    userId: string,
    amount: number,
    jobId: string,
    reason: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        creditsBalance: true,
        creditsUsedThisMonth: true
      }
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    const newBalance = user.creditsBalance + amount
    const newUsedThisMonth = Math.max(0, user.creditsUsedThisMonth - amount)

    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsBalance: newBalance,
        creditsUsedThisMonth: newUsedThisMonth
      }
    })

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type: 'refund',
        description: `Credit refund: ${reason}`,
        jobId
      }
    })
  }

  /**
   * Get user credit summary
   */
  async getCreditSummary(userId: string): Promise<{
    currentBalance: number
    monthlyAllocation: number
    usedThisMonth: number
    rolloverCap: number
    tier: string
    lastReset: Date
    nextReset: Date
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        creditsBalance: true,
        monthlyCredits: true,
        creditsUsedThisMonth: true,
        rolloverCap: true,
        tier: true,
        lastCreditReset: true
      }
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    // Calculate next reset date (1 month from last reset)
    const nextReset = new Date(user.lastCreditReset)
    nextReset.setMonth(nextReset.getMonth() + 1)

    return {
      currentBalance: user.creditsBalance,
      monthlyAllocation: user.monthlyCredits,
      usedThisMonth: user.creditsUsedThisMonth,
      rolloverCap: user.rolloverCap,
      tier: user.tier,
      lastReset: user.lastCreditReset,
      nextReset
    }
  }

  /**
   * Check if user needs credit reset
   * Called by cron job to find users needing monthly reset
   */
  async getUsersNeedingReset(): Promise<string[]> {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const users = await prisma.user.findMany({
      where: {
        lastCreditReset: {
          lte: oneMonthAgo
        },
        tier: {
          not: 'free' // Free tier gets credits immediately, no monthly reset
        }
      },
      select: {
        id: true
      }
    })

    return users.map(u => u.id)
  }
}

export const creditService = new CreditService()
