/**
 * Redis Health Check API Endpoint
 *
 * Verifies Redis connection is working
 */

import { NextResponse } from 'next/server'
import { queueService } from '@/lib/services/queue-service'

export async function GET() {
  try {
    // Use the getStats() method which properly handles job counts
    const stats = await queueService.getStats()

    return NextResponse.json({
      status: 'healthy',
      redis: 'connected',
      queue: {
        waiting: stats.waiting,
        active: stats.active,
        completed: stats.completed,
        failed: stats.failed,
        delayed: stats.delayed,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Redis health check failed:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        redis: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}

export const dynamic = 'force-dynamic'
