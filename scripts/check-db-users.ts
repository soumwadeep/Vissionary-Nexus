import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables')
}

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

async function main() {
  console.log('=== Querying users table columns ===')
  const columns = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'users'
    ORDER BY ordinal_position;
  `
  console.log('Users table columns:', columns)
  
  console.log('\n=== Querying user casper.brazil.baka99@gmail.com ===')
  const user = await sql`
    SELECT id, name, email, password, role, wallet_address
    FROM users
    WHERE email = 'casper.brazil.baka99@gmail.com'
    LIMIT 1;
  `
  console.log('User found:', user)
  if (user.length > 0) {
    console.log('Has password:', !!user[0].password)
    console.log('Password preview:', user[0].password ? `${user[0].password.substring(0, 15)}...` : 'null')
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
