'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ArrowLeft, Download, XCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Breadcrumb } from '@/components/breadcrumb'
import { formatDate } from '@/lib/utils'

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
  inputImages: string[]
  outputImages: string[]
  modelType: string
  sceneStyle: string
  originalImageUrl: string
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJob()
    }
  }, [status, params.id])

  async function fetchJob() {
    try {
      const response = await fetch(`/api/jobs/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setJob(data.job)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to fetch job details',
        })
        router.push('/jobs')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch job details',
      })
      router.push('/jobs')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this job? Reserved credits will be refunded.')) {
      return
    }

    setIsCancelling(true)

    try {
      const response = await fetch(`/api/jobs/${params.id}/cancel`, {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Job Cancelled',
          description: 'The job has been cancelled and credits refunded',
        })
        fetchJob() // Refresh job data
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to cancel job',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to cancel job',
      })
    } finally {
      setIsCancelling(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!job) {
    return null
  }

  const statusConfig = {
    pending: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', text: 'Pending' },
    processing: { icon: Loader2, color: 'bg-blue-500/10 text-blue-700 border-blue-200', text: 'Processing' },
    completed: { icon: CheckCircle, color: 'bg-green-500/10 text-green-700 border-green-200', text: 'Completed' },
    failed: { icon: XCircle, color: 'bg-red-500/10 text-red-700 border-red-200', text: 'Failed' },
  }

  const config = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = config.icon

  return (
    <div className="container py-8 max-w-6xl space-y-6">
      <Breadcrumb />
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Job Details</h1>
              <Badge variant="outline" className={config.color}>
                <StatusIcon className={`mr-1 h-3 w-3 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                {config.text}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Created {formatDate(new Date(job.createdAt))}
            </p>
          </div>

          {(job.status === 'pending' || job.status === 'processing') && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Job
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Job Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Background Prompt:</span>
              <p className="font-medium mt-1">{job.backgroundPrompt}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Images:</span>
                <p className="font-medium">{job.imageCount}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Credits Used:</span>
                <p className="font-medium">{job.creditsConsumed || job.creditsReserved}</p>
              </div>
            </div>
            {job.progress !== null && job.status === 'processing' && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="font-medium">{job.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                {job.currentStep && (
                  <p className="text-xs text-muted-foreground mt-2">{job.currentStep}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Model Type:</span>
                <p className="font-medium capitalize">{job.modelType}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Scene Style:</span>
                <p className="font-medium capitalize">{job.sceneStyle}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Created:</span>
              <p className="font-medium">{formatDate(new Date(job.createdAt))}</p>
            </div>
            {job.completedAt && (
              <div>
                <span className="text-sm text-muted-foreground">Completed:</span>
                <p className="font-medium">{formatDate(new Date(job.completedAt))}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {job.errorMessage && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{job.errorMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Input Images */}
      {job.inputImages && job.inputImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Input Images ({job.inputImages.length})</CardTitle>
            <CardDescription>Original images uploaded for processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {job.inputImages.map((url, index) => (
                <div key={index} className="aspect-square relative group">
                  <img
                    src={url}
                    alt={`Input ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                    >
                      <a href={url} download target="_blank">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Output Images */}
      {job.status === 'completed' && job.outputImages && job.outputImages.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Results ({job.outputImages.length})</CardTitle>
              <CardDescription>Processed images with AI-generated backgrounds</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {job.outputImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Result ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                    >
                      <a href={url} download target="_blank">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {job.status === 'processing' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="font-semibold text-lg mb-2">Processing Your Images</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              This may take a few minutes depending on the number of images. You can leave this page and come back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
