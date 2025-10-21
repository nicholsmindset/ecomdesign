import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Zap, Shield, Upload } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container grid place-items-center gap-6 py-20 md:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
            Transform Your Product Images with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              AI-Powered Backgrounds
            </span>
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Upload your product photos and let our AI generate stunning, professional backgrounds in seconds.
            Perfect for e-commerce, marketing, and social media.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Process hundreds of images in minutes with our advanced AI pipeline
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Your images are encrypted and stored securely with enterprise-grade protection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Bulk Processing</CardTitle>
              <CardDescription>
                Upload up to 100 images at once with automatic batch discounts
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Tiers Preview */}
      <section className="container py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your needs. All plans include our core features.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <PricingCard
              name="Free"
              price="$0"
              credits="5 credits/month"
              features={[
                '5 credits per month',
                'Basic AI models',
                'Community support',
              ]}
            />
            <PricingCard
              name="Starter"
              price="$49"
              credits="100 credits/month"
              features={[
                '100 credits per month',
                'Rollover up to 50 credits',
                'Basic AI models',
                'Email support',
              ]}
            />
            <PricingCard
              name="Professional"
              price="$149"
              credits="400 credits/month"
              popular
              features={[
                '400 credits per month',
                'Rollover up to 200 credits',
                'Advanced AI models',
                'Priority support',
                'Bulk upload',
              ]}
            />
            <PricingCard
              name="Enterprise"
              price="$449"
              credits="2,000 credits/month"
              features={[
                '2,000 credits per month',
                'Rollover up to 500 credits',
                'Custom model training',
                'Dedicated support',
                'API access',
              ]}
            />
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/pricing">View Full Pricing Details</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Ready to Transform Your Images?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of businesses using PhotoForge AI to create stunning product photos.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PricingCard({
  name,
  price,
  credits,
  features,
  popular,
}: {
  name: string
  price: string
  credits: string
  features: string[]
  popular?: boolean
}) {
  return (
    <Card className={popular ? 'border-primary shadow-lg' : ''}>
      <CardHeader>
        {popular && (
          <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </div>
        )}
        <CardTitle>{name}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <CardDescription>{credits}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="mt-6 w-full" variant={popular ? 'default' : 'outline'} asChild>
          <Link href="/auth/signup">Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
