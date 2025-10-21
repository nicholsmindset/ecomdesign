import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripeService } from '@/lib/services/stripe-service'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user with subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Cancel Stripe subscription if exists
    if (user.subscription?.stripeSubscriptionId) {
      try {
        await stripeService.cancelSubscription(
          user.subscription.stripeSubscriptionId,
          true // immediate cancellation
        )
      } catch (error) {
        console.error('Failed to cancel Stripe subscription:', error)
        // Continue with account deletion even if Stripe cancellation fails
      }
    }

    // Delete all user data (cascade will handle related records)
    await prisma.user.delete({
      where: { id: session.user.id }
    })

    return NextResponse.json({
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
