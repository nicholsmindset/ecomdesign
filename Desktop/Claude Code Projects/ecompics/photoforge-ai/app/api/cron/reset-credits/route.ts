import { NextResponse } from 'next/server'
import { creditService } from '@/lib/services/credit-service'

/**
 * Cron job endpoint for monthly credit resets
 *
 * Configure this in Vercel Cron Jobs or similar:
 * - Schedule: 0 0 1 * * (midnight on the 1st of each month)
 * - Path: /api/cron/reset-credits
 *
 * Security: Verify cron secret in production
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret in production
    const authHeader = request.headers.get('authorization')
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // Get all users needing monthly credit reset
    const userIds = await creditService.getUsersNeedingReset()

    const results = {
      total: userIds.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each user
    for (const userId of userIds) {
      try {
        const result = await creditService.resetMonthlyCredits(userId)
        results.successful++

        console.log(`✅ Reset credits for user ${userId}:`, {
          previousBalance: result.previousBalance,
          newBalance: result.newBalance,
          rolledOver: result.rolledOverAmount,
          monthlyCredits: result.monthlyCredits
        })
      } catch (error) {
        results.failed++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        results.errors.push(`User ${userId}: ${errorMessage}`)

        console.error(`❌ Failed to reset credits for user ${userId}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Monthly credit reset completed',
      results
    })
  } catch (error) {
    console.error('❌ Cron job failed:', error)
    return NextResponse.json(
      {
        error: 'Failed to process credit resets',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
