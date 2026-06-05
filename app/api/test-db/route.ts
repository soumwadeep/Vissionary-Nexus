import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('[v0] DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // Try a simple query
    const allUsers = await db.select().from(users)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working!',
      userCount: allUsers.length,
    })
  } catch (error) {
    console.error('[v0] DB test error:', error)
    return NextResponse.json({
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error',
      dbUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
    }, { status: 500 })
  }
}
