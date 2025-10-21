'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Check, Loader2, CreditCard, Zap } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PRICING_TIERS, ALA_CARTE_OPTIONS } from '@/lib/config/pricing'
import { Breadcrumb } from '@/components/breadcrumb'

interface CreditSummary {
  currentBalance: number
  monthlyAllocation: number
  usedThisMonth: number
  rolloverCap: number
  tier: string
  lastReset: string
  nextReset: string
}

export default function BillingPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [credits, setCredits] = useState<CreditSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingCheckout, setProcessingCheckout] = useState<string | null>(null)

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCredits()
    }
  }, [status])

  async function fetchCredits() {
    try {
      const response = await fetch('/api/users/credits')
      const data = await response.json()

      if (response.ok) {
        setCredits(data.credits)
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubscriptionCheckout(tier: string) {
    setProcessingCheckout(tier)

    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to create checkout session',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create checkout session',
      })
    } finally {
      setProcessingCheckout(null)
    }
  }

  async function handleCreditPurchase(creditAmount: number) {
    setProcessingCheckout(`credits-${creditAmount}`)

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: creditAmount }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to create checkout session',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create checkout session',
      })
    } finally {
      setProcessingCheckout(null)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl space-y-8">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="text-muted-foreground">
          Manage your subscription and purchase additional credits
        </p>
      </div>

      {/* Current Credits */}
      {credits && (
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
            <CardDescription>
              Your credit usage and allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Available Credits</p>
                <p className="text-3xl font-bold text-primary">{credits.currentBalance}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Allocation</p>
                <p className="text-2xl font-semibold">{credits.monthlyAllocation}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rollover cap: {credits.rolloverCap}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Used This Month</p>
                <p className="text-2xl font-semibold">{credits.usedThisMonth}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Next reset: {formatDate(new Date(credits.nextReset))}
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold capitalize">Current Plan: {credits.tier}</p>
                  <p className="text-sm text-muted-foreground">
                    {credits.tier === 'free' ? 'Upgrade to get more credits' : 'Manage your subscription'}
                  </p>
                </div>
                {credits.tier !== 'free' && (
                  <Button variant="outline" size="sm">
                    Manage Subscription
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscription Plans</h2>
          <p className="text-muted-foreground">
            Choose a plan that fits your needs. Unused credits roll over up to your cap.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(PRICING_TIERS)
            .filter(([key]) => key !== 'free')
            .map(([key, tier]) => (
              <Card
                key={key}
                className={tier.popular ? 'border-primary shadow-lg relative' : ''}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.displayName}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{formatCurrency(tier.monthlyPrice)}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>{tier.monthlyCredits} credits per month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscriptionCheckout(key)}
                    disabled={processingCheckout === key || credits?.tier === key}
                  >
                    {processingCheckout === key ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : credits?.tier === key ? (
                      'Current Plan'
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* À La Carte Credits */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">À La Carte Credits</h2>
          <p className="text-muted-foreground">
            Need extra credits? Purchase them individually without a subscription.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ALA_CARTE_OPTIONS.map((option) => (
            <Card key={option.credits}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{option.credits} Credits</CardTitle>
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{formatCurrency(option.price)}</span>
                </div>
                <CardDescription>
                  {formatCurrency(option.price / option.credits)} per credit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleCreditPurchase(option.credits)}
                  disabled={processingCheckout === `credits-${option.credits}`}
                >
                  {processingCheckout === `credits-${option.credits}` ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Purchase
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
