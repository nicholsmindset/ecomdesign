import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Zap, HelpCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { PRICING_TIERS, ALA_CARTE_OPTIONS } from '@/lib/config/pricing'
import { FAQSchema } from '@/components/schema-org'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Pricing Plans - PhotoForge AI',
  description: 'Choose the perfect plan for your business. From free to enterprise, get AI-powered product image backgrounds with transparent pricing. No hidden fees. Start free today!',
  url: '/pricing',
})

const FAQ_DATA = [
  {
    question: 'How do credits work?',
    answer: 'Each image you process costs 1 credit. Batch discounts automatically apply when you upload multiple images at once. Credits are deducted when you start a job, and refunded if the job fails.'
  },
  {
    question: 'What happens to unused credits?',
    answer: 'Unused monthly credits roll over to the next month, up to your plan\'s rollover cap. For example, Professional plan users can roll over up to 200 credits. À la carte credits never expire.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel anytime. Your subscription will remain active until the end of your billing period, and you\'ll keep access to your credits until they\'re used.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor, Stripe.'
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can change your plan at any time. When upgrading, you\'ll be charged a prorated amount. When downgrading, the change takes effect at the start of your next billing cycle.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Every new account starts with 5 free credits. No credit card required. You can test the service before committing to a paid plan.'
  }
]

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include our core AI features with no hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="container pb-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {Object.entries(PRICING_TIERS).map(([key, tier]) => (
            <Card
              key={key}
              className={`flex flex-col ${tier.popular ? 'border-primary shadow-lg scale-105 relative' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.displayName}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatCurrency(tier.monthlyPrice)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-base">
                  {tier.monthlyCredits} credits per month
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  variant={tier.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={key === 'free' ? '/auth/signup' : '/billing'}>
                    {key === 'free' ? 'Get Started' : 'Subscribe'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container pb-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Feature</th>
                  {Object.entries(PRICING_TIERS).map(([key, tier]) => (
                    <th key={key} className="text-center py-4 px-4">
                      <div className="font-semibold">{tier.displayName}</div>
                      <div className="text-sm font-normal text-muted-foreground">
                        {formatCurrency(tier.monthlyPrice)}/mo
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <FeatureRow
                  feature="Monthly Credits"
                  values={['5', '100', '400', '2,000']}
                />
                <FeatureRow
                  feature="Credit Rollover"
                  values={['None', 'Up to 50', 'Up to 200', 'Up to 500']}
                />
                <FeatureRow
                  feature="AI Models"
                  values={['Basic', 'Basic', 'Advanced', 'Custom Training']}
                />
                <FeatureRow
                  feature="Batch Upload"
                  values={[true, true, true, true]}
                />
                <FeatureRow
                  feature="Google Drive Integration"
                  values={[false, true, true, true]}
                />
                <FeatureRow
                  feature="Bulk Processing"
                  values={[false, false, true, true]}
                />
                <FeatureRow
                  feature="API Access"
                  values={[false, false, false, true]}
                />
                <FeatureRow
                  feature="Priority Processing"
                  values={[false, false, true, true]}
                />
                <FeatureRow
                  feature="Support"
                  values={['Community', 'Email', 'Priority', 'Dedicated']}
                />
                <FeatureRow
                  feature="White-Label Options"
                  values={[false, false, false, true]}
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Batch Discounts */}
      <section className="container pb-16">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Automatic Batch Discounts</CardTitle>
              </div>
              <CardDescription>
                Save more when you process images in bulk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary">5% OFF</div>
                  <div className="text-sm text-muted-foreground">10-19 images per job</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary">10% OFF</div>
                  <div className="text-sm text-muted-foreground">20-49 images per job</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary">20% OFF</div>
                  <div className="text-sm text-muted-foreground">50-99 images per job</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary">30% OFF</div>
                  <div className="text-sm text-muted-foreground">100+ images per job</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Discounts are automatically applied at checkout. No coupon codes needed!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* À La Carte Credits */}
      <section className="container pb-16">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">À La Carte Credits</h2>
            <p className="text-muted-foreground">
              Need extra credits? Purchase them individually without a subscription.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ALA_CARTE_OPTIONS.map((option) => (
              <Card key={option.credits}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{option.credits} Credits</span>
                    <Zap className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <div className="text-3xl font-bold">{formatCurrency(option.price)}</div>
                  <CardDescription>
                    {formatCurrency(option.price / option.credits)} per credit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/billing">Purchase</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Credits purchased à la carte never expire and don't count toward your monthly rollover cap.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <FAQItem
              question="How do credits work?"
              answer="Each image you process costs 1 credit. Batch discounts automatically apply when you upload multiple images at once. Credits are deducted when you start a job, and refunded if the job fails."
            />
            <FAQItem
              question="What happens to unused credits?"
              answer="Unused monthly credits roll over to the next month, up to your plan's rollover cap. For example, Professional plan users can roll over up to 200 credits. À la carte credits never expire."
            />
            <FAQItem
              question="Can I cancel my subscription?"
              answer="Yes, you can cancel anytime. Your subscription will remain active until the end of your billing period, and you'll keep access to your credits until they're used."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor, Stripe."
            />
            <FAQItem
              question="Can I upgrade or downgrade my plan?"
              answer="Yes! You can change your plan at any time. When upgrading, you'll be charged a prorated amount. When downgrading, the change takes effect at the start of your next billing cycle."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="Yes! Every new account starts with 5 free credits. No credit card required. You can test the service before committing to a paid plan."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl text-center space-y-6 rounded-lg border bg-muted/50 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of businesses transforming their product images with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
      <FAQSchema faqs={FAQ_DATA} />
    </div>
  )
}

function FeatureRow({
  feature,
  values,
}: {
  feature: string
  values: (string | boolean)[]
}) {
  return (
    <tr className="border-b">
      <td className="py-4 px-4 font-medium">{feature}</td>
      {values.map((value, index) => (
        <td key={index} className="py-4 px-4 text-center">
          {typeof value === 'boolean' ? (
            value ? (
              <Check className="h-5 w-5 text-primary mx-auto" />
            ) : (
              <X className="h-5 w-5 text-muted-foreground mx-auto" />
            )
          ) : (
            <span className="text-sm">{value}</span>
          )}
        </td>
      ))}
    </tr>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start gap-2 text-lg">
          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  )
}
