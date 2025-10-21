import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Metadata } from 'next'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Image, TrendingUp, Upload } from 'lucide-react'
import { Breadcrumb } from '@/components/breadcrumb'
import { generateMetadata as genMeta } from '@/lib/seo'

export const metadata: Metadata = genMeta({
  title: 'Dashboard',
  description: 'View your account overview, credit balance, and recent jobs',
  url: '/dashboard',
  noIndex: true, // Protected page
})

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const { user } = session

  return (
    <div className="container py-8 space-y-8">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name || user.email}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Credits
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.creditsBalance}</div>
            <p className="text-xs text-muted-foreground">
              {user.tier === 'free' ? 'Free tier' : `${user.tier} plan`}
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/billing">Manage subscription</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Jobs
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No jobs processed yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Images processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started by uploading your first images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/upload">
              <div className="group flex items-center gap-4 rounded-lg border p-4 hover:bg-accent transition-colors cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Upload Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a new image processing job
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/jobs">
              <div className="group flex items-center gap-4 rounded-lg border p-4 hover:bg-accent transition-colors cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">View Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Check status and view results
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs - Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Your most recent image processing jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No jobs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by uploading your first images to transform them with AI
            </p>
            <Button asChild>
              <Link href="/upload">Upload Images</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
