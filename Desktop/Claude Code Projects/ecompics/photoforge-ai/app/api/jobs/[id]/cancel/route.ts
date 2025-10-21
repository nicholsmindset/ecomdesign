import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { creditService } from '@/lib/services/credit-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Verify the job belongs to the user
    if (job.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Check if job can be cancelled
    if (job.status === 'completed' || job.status === 'failed') {
      return NextResponse.json(
        { error: `Cannot cancel ${job.status} job` },
        { status: 400 }
      )
    }

    // Update job status
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        status: 'failed',
        errorMessage: 'Cancelled by user',
      }
    })

    // Refund reserved credits if any
    if (job.creditsReserved > 0) {
      await creditService.refundCredits(
        job.userId,
        job.creditsReserved,
        job.id,
        'Job cancelled by user'
      )
    }

    return NextResponse.json({
      job: updatedJob,
      message: 'Job cancelled successfully'
    })
  } catch (error) {
    console.error('Job cancel error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel job' },
      { status: 500 }
    )
  }
}
