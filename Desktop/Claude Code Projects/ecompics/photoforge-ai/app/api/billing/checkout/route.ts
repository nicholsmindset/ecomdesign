import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripeService } from '@/lib/services/stripe-service'
import { ALA_CARTE_OPTIONS } from '@/lib/config/pricing'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { credits } = await request.json()

    const option = ALA_CARTE_OPTIONS.find(o => o.credits === credits)

    if (!option || !option.stripePriceId) {
      return NextResponse.json(
        { error: 'Invalid credit package or price not configured' },
        { status: 400 }
      )
    }

    const checkoutUrl = await stripeService.createAlaCarteCheckout(
      session.user.id,
      option.credits,
      option.stripePriceId
    )

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Billing checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
