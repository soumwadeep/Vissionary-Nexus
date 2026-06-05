import { migrate } from 'drizzle-orm/neon-http/migrator'
import { db } from '@/lib/db'

async function runMigrations() {
  console.log('[v0] Starting database migrations...')
  
  try {
    await migrate(db, {
      migrationsFolder: 'db/migrations',
    })
    console.log('[v0] Migrations completed successfully')
  } catch (error) {
    console.error('[v0] Migration error:', error)
    process.exit(1)
  }
}

runMigrations()
