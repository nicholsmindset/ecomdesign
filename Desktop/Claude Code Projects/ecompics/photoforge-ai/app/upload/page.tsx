'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react'
import { calculateBatchCredits, getBatchDiscountInfo } from '@/lib/config/pricing'
import { redirect } from 'next/navigation'
import { Breadcrumb } from '@/components/breadcrumb'

export default function UploadPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const [files, setFiles] = useState<File[]>([])
  const [backgroundPrompt, setBackgroundPrompt] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 100,
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles].slice(0, 100))
    }
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const creditsNeeded = calculateBatchCredits(files.length)
  const discountInfo = getBatchDiscountInfo(files.length)
  const userCredits = session?.user?.creditsBalance || 0
  const hasEnoughCredits = userCredits >= creditsNeeded

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No images',
        description: 'Please upload at least one image',
      })
      return
    }

    if (!backgroundPrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing prompt',
        description: 'Please enter a background prompt',
      })
      return
    }

    if (!hasEnoughCredits) {
      toast({
        variant: 'destructive',
        title: 'Insufficient credits',
        description: `You need ${creditsNeeded} credits but only have ${userCredits}`,
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })
      formData.append('backgroundPrompt', backgroundPrompt)

      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job')
      }

      toast({
        title: 'Success!',
        description: `Job created successfully. Processing ${files.length} images.`,
      })

      router.push(`/jobs/${data.job.id}`)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create job',
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumb />
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload Images</h1>
        <p className="text-muted-foreground">
          Upload your product images and describe the background you want
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        <Card>
          <CardHeader>
            <CardTitle>Select Images</CardTitle>
            <CardDescription>
              Upload up to 100 images at once. Supported formats: PNG, JPG, JPEG, WebP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop the images here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Maximum 100 images per job
                  </p>
                </>
              )}
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {files.length} image{files.length !== 1 ? 's' : ''} selected
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                  >
                    Clear all
                  </Button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Background Prompt */}
        <Card>
          <CardHeader>
            <CardTitle>Background Prompt</CardTitle>
            <CardDescription>
              Describe the background or scene you want for your images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                placeholder="e.g., Professional studio background with soft lighting"
                value={backgroundPrompt}
                onChange={(e) => setBackgroundPrompt(e.target.value)}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about lighting, colors, and style for best results
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cost Summary */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Images:</span>
                <span className="font-semibold">{files.length}</span>
              </div>

              {discountInfo && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Discount:</span>
                  <span className="font-semibold">
                    {Math.round(discountInfo.discount * 100)}% off
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-lg font-bold pt-4 border-t">
                <span>Total Credits:</span>
                <span>{creditsNeeded}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Your balance:</span>
                <span className={hasEnoughCredits ? 'text-green-600 font-semibold' : 'text-destructive font-semibold'}>
                  {userCredits} credits
                </span>
              </div>

              {!hasEnoughCredits && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">Insufficient credits</p>
                    <p>You need {creditsNeeded - userCredits} more credits to process this job.</p>
                    <Button variant="link" className="h-auto p-0 text-destructive" asChild>
                      <Link href="/billing">Purchase credits</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading || files.length === 0 || !hasEnoughCredits}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Job...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Process Images ({creditsNeeded} credits)
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
