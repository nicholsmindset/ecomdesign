export type TierName = 'free' | 'starter' | 'professional' | 'enterprise'

export interface TierConfig {
  name: TierName
  displayName: string
  monthlyPrice: number
  monthlyCredits: number
  rolloverCap: number
  features: string[]
  popular?: boolean
  stripePriceId?: string
}

export interface AlaCarteOption {
  credits: number
  price: number
  stripePriceId?: string
}

export const PRICING_TIERS: Record<TierName, TierConfig> = {
  free: {
    name: 'free',
    displayName: 'Free',
    monthlyPrice: 0,
    monthlyCredits: 5,
    rolloverCap: 0,
    features: [
      '5 credits/month',
      'No rollover',
      'Basic features',
      'Community support'
    ]
  },
  starter: {
    name: 'starter',
    displayName: 'Starter',
    monthlyPrice: 49,
    monthlyCredits: 100,
    rolloverCap: 50,
    features: [
      '100 credits/month',
      'Rollover up to 50 credits',
      'Basic AI models',
      'Email support',
      'Google Drive integration'
    ],
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID
  },
  professional: {
    name: 'professional',
    displayName: 'Professional',
    monthlyPrice: 149,
    monthlyCredits: 400,
    rolloverCap: 200,
    features: [
      '400 credits/month',
      'Rollover up to 200 credits',
      'Advanced AI models',
      'Priority support',
      'Google Drive integration',
      'Bulk upload',
      'Custom backgrounds'
    ],
    popular: true,
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    monthlyPrice: 449,
    monthlyCredits: 2000,
    rolloverCap: 500,
    features: [
      '2,000 credits/month',
      'Rollover up to 500 credits',
      'Custom model training',
      'Dedicated support',
      'Google Drive integration',
      'Bulk upload',
      'White-label options',
      'API access',
      'Custom integrations'
    ],
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID
  }
}

export const ALA_CARTE_OPTIONS: AlaCarteOption[] = [
  {
    credits: 50,
    price: 29,
    stripePriceId: process.env.STRIPE_ALA_CARTE_50_PRICE_ID
  },
  {
    credits: 100,
    price: 49,
    stripePriceId: process.env.STRIPE_ALA_CARTE_100_PRICE_ID
  },
  {
    credits: 500,
    price: 199,
    stripePriceId: process.env.STRIPE_ALA_CARTE_500_PRICE_ID
  }
]

export function getTierConfig(tierName: TierName): TierConfig {
  return PRICING_TIERS[tierName]
}

export function calculateRollover(
  currentBalance: number,
  monthlyCredits: number,
  rolloverCap: number
): number {
  // Calculate how many unused credits from current period
  const unusedCredits = Math.max(0, currentBalance)

  // Apply rollover cap
  const rolloverAmount = Math.min(unusedCredits, rolloverCap)

  // New balance = monthly credits + capped rollover
  return monthlyCredits + rolloverAmount
}

export function getAlaCarteOption(credits: number): AlaCarteOption | undefined {
  return ALA_CARTE_OPTIONS.find(option => option.credits === credits)
}
