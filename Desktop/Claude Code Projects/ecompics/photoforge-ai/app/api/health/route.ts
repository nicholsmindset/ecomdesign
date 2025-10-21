/**
 * Health Check API Endpoint
 *
 * Returns basic health status of the application
 */

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PhotoForge AI',
    environment: process.env.NODE_ENV,
  })
}

export const dynamic = 'force-dynamic'
