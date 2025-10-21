/**
 * Image Processing Worker
 *
 * This worker processes jobs from the Bull queue and uses Gemini AI
 * to generate professional backgrounds for product images.
 *
 * Run with: npm run worker
 * Or in development: npm run dev:worker
 */

import { Job } from 'bull'
import { PrismaClient } from '@prisma/client'
import { QueueService, JobData } from '../lib/services/queue-service'
import { GeminiService } from '../lib/services/gemini-service'
import { creditService } from '../lib/services/credit-service'

const prisma = new PrismaClient()
const queueService = new QueueService()
const geminiService = new GeminiService()

console.log('🚀 Image Processing Worker Starting...')
console.log('📡 Gemini Model:', geminiService.getModelInfo().name)
console.log('🔑 API Key:', geminiService.getModelInfo().apiKey)

/**
 * Process a single job from the queue
 */
async function processJob(job: Job<JobData>): Promise<void> {
  const { jobId, userId, backgroundPrompt, inputImages } = job.data

  console.log(`\n📸 Processing Job ${jobId}`)
  console.log(`   User: ${userId}`)
  console.log(`   Images: ${inputImages.length}`)
  console.log(`   Prompt: ${backgroundPrompt}`)

  try {
    // Update job status to processing
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'processing',
        currentStep: 'Initializing AI processing',
        progress: 0,
      },
    })

    // Get job details from database
    const dbJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: { user: true },
    })

    if (!dbJob) {
      throw new Error(`Job ${jobId} not found in database`)
    }

    // Process images with Gemini AI
    const outputImages: string[] = []
    const totalImages = inputImages.length
    let completedImages = 0

    for (let i = 0; i < totalImages; i++) {
      const imageUrl = inputImages[i]
      const imageNumber = i + 1

      console.log(`   Processing image ${imageNumber}/${totalImages}...`)

      // Update progress
      const progressPercent = Math.round((i / totalImages) * 90) // Leave 10% for finalization
      await prisma.job.update({
        where: { id: jobId },
        data: {
          currentStep: `Processing image ${imageNumber}/${totalImages}`,
          progress: progressPercent,
        },
      })

      // Also update Bull job progress
      await job.progress(progressPercent)

      // Process image with Gemini
      const result = await geminiService.processImage(imageUrl, {
        backgroundPrompt,
        modelType: dbJob.modelType as any,
        sceneStyle: dbJob.sceneStyle,
      })

      // Add processed/fallback image to output
      outputImages.push(result.processedUrl)

      // Count as completed only if successfully processed
      if (result.status === 'success') {
        completedImages++
        console.log(`   ✅ Image ${imageNumber}/${totalImages} processed successfully (${result.processingTimeMs}ms)`)
      } else if (result.status === 'fallback') {
        console.warn(`   ⚠️  Image ${imageNumber}/${totalImages} using fallback: ${result.message}`)
        // Don't count fallback as completed (no charge)
      } else {
        console.error(`   ❌ Image ${imageNumber}/${totalImages} failed: ${result.message}`)
        // Don't count error as completed (no charge)
      }
    }

    // Finalization
    await prisma.job.update({
      where: { id: jobId },
      data: {
        currentStep: 'Finalizing',
        progress: 95,
      },
    })

    await job.progress(95)

    // Calculate actual credits consumed
    const creditsConsumed = completedImages // 1 credit per successful image

    // Update job as completed
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        outputImages: outputImages,
        progress: 100,
        currentStep: 'Completed',
        completedAt: new Date(),
        creditsConsumed,
      },
    })

    // Refund unused credits if any images failed
    const creditsToRefund = dbJob.creditsReserved - creditsConsumed
    if (creditsToRefund > 0) {
      await creditService.refundCredits(
        userId,
        creditsToRefund,
        jobId,
        `Refund for ${totalImages - completedImages} failed images`
      )
    }

    await job.progress(100)

    console.log(`✅ Job ${jobId} completed successfully`)
    console.log(`   Processed: ${completedImages}/${totalImages} images`)
    console.log(`   Credits consumed: ${creditsConsumed}`)
    if (creditsToRefund > 0) {
      console.log(`   Credits refunded: ${creditsToRefund}`)
    }

    // TODO: Send email notification to user
    // await sendJobCompletedEmail(dbJob.user.email, jobId, completedImages)

  } catch (error) {
    console.error(`❌ Job ${jobId} failed:`, error)

    // Update job as failed
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        progress: 0,
      },
    })

    // Refund all credits on failure
    const dbJob = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (dbJob) {
      await creditService.refundCredits(
        userId,
        dbJob.creditsReserved,
        jobId,
        'Job failed - full refund'
      )
    }

    throw error
  }
}

/**
 * Set up the queue processor
 */
function setupWorker() {
  const queue = queueService.getQueue()

  // Process jobs with concurrency of 2 (can be adjusted based on resources)
  queue.process(2, async (job: Job<JobData>) => {
    try {
      await processJob(job)
      return { success: true, jobId: job.data.jobId }
    } catch (error) {
      console.error('Job processing error:', error)
      throw error
    }
  })

  // Event handlers
  queue.on('completed', (job, result) => {
    console.log(`\n🎉 Job ${job.id} completed:`, result)
  })

  queue.on('failed', (job, err) => {
    console.error(`\n💥 Job ${job?.id} failed:`, err.message)
  })

  queue.on('error', (error) => {
    console.error('\n❌ Queue error:', error)
  })

  queue.on('stalled', (job) => {
    console.warn(`\n⚠️  Job ${job.id} has stalled`)
  })

  console.log('✅ Worker is ready and listening for jobs...\n')
}

/**
 * Graceful shutdown
 */
async function shutdown() {
  console.log('\n🛑 Shutting down worker...')

  try {
    await queueService.close()
    await prisma.$disconnect()
    console.log('✅ Worker shut down gracefully')
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

// Handle shutdown signals
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  shutdown()
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason)
  shutdown()
})

// Start the worker
setupWorker()
