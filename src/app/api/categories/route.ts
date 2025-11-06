import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import * as path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath, { readonly: true });

    try {
      const categories = db.prepare(`
        SELECT * FROM Category
        ORDER BY name ASC
      `).all();

      return NextResponse.json(categories);
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
