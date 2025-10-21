import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { creditService } from '@/lib/services/credit-service'
import type { TierName } from '@/lib/config/pricing'
import { getAlaCarteOption } from '@/lib/config/pricing'

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(email: string, name?: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
      name,
    })

    return customer.id
  }

  /**
   * Create a checkout session for subscription
   */
  async createSubscriptionCheckout(
    userId: string,
    tier: TierName,
    priceId: string
  ): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, subscription: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Get or create Stripe customer
    let customerId = user.subscription?.stripeCustomerId

    if (!customerId) {
      customerId = await this.createCustomer(user.email, user.name || undefined)
    }

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
      metadata: {
        userId,
        tier,
      },
    })

    return session.url!
  }

  /**
   * Create a checkout session for à la carte credits
   */
  async createAlaCarteCheckout(
    userId: string,
    credits: number,
    priceId: string
  ): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, subscription: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Get or create Stripe customer
    let customerId = user.subscription?.stripeCustomerId

    if (!customerId) {
      customerId = await this.createCustomer(user.email, user.name || undefined)
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      metadata: {
        userId,
        credits: credits.toString(),
        type: 'ala_carte',
      },
    })

    return session.url!
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<void> {
    if (immediately) {
      await this.stripe.subscriptions.cancel(subscriptionId)
    } else {
      await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })
    }
  }

  /**
   * Resume a subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })
  }

  /**
   * Handle subscription created/updated webhook
   */
  async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId
    const tier = subscription.metadata.tier as TierName

    if (!userId || !tier) {
      console.error('Missing userId or tier in subscription metadata')
      return
    }

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status,
        stripePriceId: subscription.items.data[0].price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      create: {
        userId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    })

    // Update user tier if subscription is active
    if (subscription.status === 'active') {
      await creditService.updateUserTier(userId, tier)
    }
  }

  /**
   * Handle subscription deleted webhook
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId

    if (!userId) {
      console.error('Missing userId in subscription metadata')
      return
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: 'canceled' },
    })

    // Downgrade user to free tier
    await creditService.updateUserTier(userId, 'free')
  }

  /**
   * Handle payment intent succeeded webhook (for à la carte purchases)
   */
  async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const userId = paymentIntent.metadata.userId
    const credits = parseInt(paymentIntent.metadata.credits || '0')

    if (!userId || !credits) {
      console.error('Missing userId or credits in payment intent metadata')
      return
    }

    // Add credits to user account
    await creditService.addAlaCarteCredits(userId, credits, paymentIntent.id)
  }

  /**
   * Get Stripe instance for advanced usage
   */
  getStripe(): Stripe {
    return this.stripe
  }

  /**
   * Construct webhook event from request
   */
  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }
}

export const stripeService = new StripeService()
