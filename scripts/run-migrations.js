require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Use environment variable for security
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error('Please set DATABASE_URL before running migrations');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigrations() {
  try {
    console.log('📦 Running database migrations...');

    const migrationsDir = path.join(__dirname, '../db/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      console.log(`🔄 Applying migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      
      // Split into individual statements and run each
      const statements = sqlContent.split(';').map(s => s.trim()).filter(Boolean);
      for (const statement of statements) {
        if (statement) {
          await sql.unsafe(statement);
        }
      }
      console.log(`✅ Applied migration: ${file}`);
    }

    console.log('🎉 All migrations applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
