import Queue, { Job, JobOptions } from 'bull'
import IORedis from 'ioredis'

export interface JobData {
  jobId: string
  userId: string
  backgroundPrompt: string
  inputImages: string[]
}

export interface JobResult {
  jobId: string
  outputImages: string[]
  processingTimeMs: number
}

export class QueueService {
  private queue: Queue.Queue<JobData>
  private connection: IORedis

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

    // Create Redis connection
    this.connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })

    // Create Bull queue
    this.queue = new Queue<JobData>('image-processing', {
      createClient: (type) => {
        switch (type) {
          case 'client':
            return this.connection
          case 'subscriber':
            return this.connection.duplicate()
          case 'bclient':
            return this.connection.duplicate()
          default:
            return this.connection
        }
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 500, // Keep last 500 failed jobs
      },
    })

    // Set up event handlers
    this.setupEventHandlers()
  }

  /**
   * Add a new job to the queue
   */
  async addJob(
    data: JobData,
    options?: JobOptions
  ): Promise<Job<JobData>> {
    return await this.queue.add(data, {
      jobId: data.jobId,
      ...options,
    })
  }

  /**
   * Get job by ID
   */
  async getJob(jobId: string): Promise<Job<JobData> | null> {
    return await this.queue.getJob(jobId)
  }

  /**
   * Remove job from queue
   */
  async removeJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId)
    if (job) {
      await job.remove()
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<{
    state: string
    progress: number
    data?: JobData
    returnvalue?: any
  } | null> {
    const job = await this.getJob(jobId)

    if (!job) {
      return null
    }

    const state = await job.getState()
    const progress = job.progress() as number

    return {
      state,
      progress,
      data: job.data,
      returnvalue: job.returnvalue,
    }
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    waiting: number
    active: number
    completed: number
    failed: number
    delayed: number
  }> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ])

    return { waiting, active, completed, failed, delayed }
  }

  /**
   * Clean old jobs
   */
  async clean(grace: number = 24 * 3600 * 1000): Promise<void> {
    await this.queue.clean(grace, 'completed')
    await this.queue.clean(grace, 'failed')
  }

  /**
   * Pause queue
   */
  async pause(): Promise<void> {
    await this.queue.pause()
  }

  /**
   * Resume queue
   */
  async resume(): Promise<void> {
    await this.queue.resume()
  }

  /**
   * Close queue connection
   */
  async close(): Promise<void> {
    await this.queue.close()
    await this.connection.quit()
  }

  /**
   * Set up event handlers for the queue
   */
  private setupEventHandlers(): void {
    this.queue.on('completed', (job) => {
      console.log(`Job ${job.id} completed`)
    })

    this.queue.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err)
    })

    this.queue.on('error', (error) => {
      console.error('Queue error:', error)
    })

    this.queue.on('waiting', (jobId) => {
      console.log(`Job ${jobId} is waiting`)
    })

    this.queue.on('active', (job) => {
      console.log(`Job ${job.id} is now active`)
    })

    this.queue.on('stalled', (job) => {
      console.warn(`Job ${job.id} has stalled`)
    })

    this.queue.on('progress', (job, progress) => {
      console.log(`Job ${job.id} progress: ${progress}%`)
    })
  }

  /**
   * Get the Bull queue instance (for advanced usage)
   */
  getQueue(): Queue.Queue<JobData> {
    return this.queue
  }
}

// Export singleton instance for use across the application
export const queueService = new QueueService()
