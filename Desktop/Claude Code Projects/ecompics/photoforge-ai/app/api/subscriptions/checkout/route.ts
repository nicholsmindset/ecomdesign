import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripeService } from '@/lib/services/stripe-service'
import type { TierName } from '@/lib/config/pricing'
import { PRICING_TIERS } from '@/lib/config/pricing'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tier } = await request.json()

    if (!tier || !['starter', 'professional', 'enterprise'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    const tierConfig = PRICING_TIERS[tier as TierName]

    if (!tierConfig.stripePriceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this tier' },
        { status: 500 }
      )
    }

    const checkoutUrl = await stripeService.createSubscriptionCheckout(
      session.user.id,
      tier as TierName,
      tierConfig.stripePriceId
    )

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Subscription checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
