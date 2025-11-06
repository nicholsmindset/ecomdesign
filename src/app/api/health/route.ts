import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import * as path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath, { readonly: true });

    try {
      // Check database connection
      db.prepare('SELECT 1').get();

      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        service: 'e-commerce-platform'
      });
    } finally {
      db.close();
    }
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      service: 'e-commerce-platform',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}
