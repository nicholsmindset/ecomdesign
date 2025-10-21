import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { creditService } from '@/lib/services/credit-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const creditSummary = await creditService.getCreditSummary(session.user.id)

    return NextResponse.json({ credits: creditSummary })
  } catch (error) {
    console.error('Credits fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credit summary' },
      { status: 500 }
    )
  }
}
