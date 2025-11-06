import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(__dirname, '../prisma/dev.db');
const migrationPath = path.join(__dirname, '../prisma/migrations/20251021115103_init/migration.sql');

console.log('📦 Setting up SQLite database...');

// Create database
const db = new Database(dbPath);

// Read and execute migration
const migration = fs.readFileSync(migrationPath, 'utf-8');

// Split by statement and execute
const statements = migration
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log(`⚡ Executing ${statements.length} SQL statements...`);

for (const statement of statements) {
  try {
    db.exec(statement);
  } catch (err: any) {
    if (!err.message.includes('already exists')) {
      console.error('Error executing statement:', statement);
      throw err;
    }
  }
}

db.close();

console.log('✅ Database setup complete!');
console.log(`📍 Database location: ${dbPath}`);
