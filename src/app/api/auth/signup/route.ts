import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

// Helper function to generate CUID-like IDs
function generateId(): string {
  return 'c' + randomBytes(12).toString('base64').replace(/[+/=]/g, '').substring(0, 24);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const db = new Database(dbPath);

    try {
      // Check if user already exists
      const findUser = db.prepare('SELECT id FROM "User" WHERE email = ?');
      const existingUser = findUser.get(email);

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = generateId();
      const insertUser = db.prepare(`
        INSERT INTO "User" (id, name, email, password, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertUser.run(
        userId,
        name,
        email,
        hashedPassword,
        'CUSTOMER',
        new Date().toISOString(),
        new Date().toISOString()
      );

      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully',
          user: {
            id: userId,
            name,
            email,
          }
        },
        { status: 201 }
      );
    } finally {
      db.close();
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
