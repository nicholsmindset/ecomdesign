'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Image, Clock, CheckCircle, XCircle, Upload } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Breadcrumb } from '@/components/breadcrumb'

interface Job {
  id: string
  status: string
  imageCount: number
  creditsReserved: number
  creditsConsumed: number | null
  backgroundPrompt: string
  progress: number | null
  currentStep: string | null
  createdAt: string
  completedAt: string | null
  errorMessage: string | null
}

export default function JobsPage() {
  const { data: session, status } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJobs()
    }
  }, [status, filter])

  async function fetchJobs() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.set('status', filter)
      }

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
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
    <div className="container py-8 space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            View and manage your image processing jobs
          </p>
        </div>
        <Button asChild>
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            New Job
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'processing', 'completed', 'failed'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No jobs found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filter === 'all'
                ? "You haven't created any jobs yet"
                : `No ${filter} jobs found`
              }
            </p>
            <Button asChild>
              <Link href="/upload">Create Your First Job</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  const statusConfig = {
    pending: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200' },
    processing: { icon: Loader2, color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
    completed: { icon: CheckCircle, color: 'bg-green-500/10 text-green-700 border-green-200' },
    failed: { icon: XCircle, color: 'bg-red-500/10 text-red-700 border-red-200' },
  }

  const config = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = config.icon

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg line-clamp-1">
                  {job.backgroundPrompt}
                </CardTitle>
                <Badge variant="outline" className={config.color}>
                  <StatusIcon className={`mr-1 h-3 w-3 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                  {job.status}
                </Badge>
              </div>
              <CardDescription>
                {job.imageCount} image{job.imageCount !== 1 ? 's' : ''} • {formatDate(new Date(job.createdAt))}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-muted-foreground">Credits: </span>
                <span className="font-medium">
                  {job.creditsConsumed || job.creditsReserved}
                </span>
              </div>
              {job.progress !== null && job.status === 'processing' && (
                <div>
                  <span className="text-muted-foreground">Progress: </span>
                  <span className="font-medium">{job.progress}%</span>
                </div>
              )}
              {job.completedAt && (
                <div>
                  <span className="text-muted-foreground">Completed: </span>
                  <span className="font-medium">
                    {formatDate(new Date(job.completedAt))}
                  </span>
                </div>
              )}
            </div>
            {job.currentStep && (
              <span className="text-xs text-muted-foreground">{job.currentStep}</span>
            )}
          </div>
          {job.errorMessage && (
            <p className="text-sm text-destructive mt-2">{job.errorMessage}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
