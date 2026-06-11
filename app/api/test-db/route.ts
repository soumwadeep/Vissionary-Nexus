import { db } from '@/lib/db'
import { users, events, tasks, aiGoalHistory } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    console.log('[v0] DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // Get all table names
    const tableNames = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    // Try queries
    const allUsers = await db.select().from(users)
    const allEvents = await db.select().from(events)
    let allTasks: (typeof tasks.$inferSelect)[] = []
    let allAIGoals: (typeof aiGoalHistory.$inferSelect)[] = []
    
    try {
      allTasks = await db.select().from(tasks)
    } catch (err) {
      console.warn('Tasks table not found')
    }
    
    try {
      allAIGoals = await db.select().from(aiGoalHistory)
    } catch (err) {
      console.warn('AI Goal History table not found')
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working!',
      userCount: allUsers.length,
      users: allUsers.map(u => ({ id: u.id, email: u.email })),
      events: allEvents,
      tasks: allTasks,
      aiGoals: allAIGoals,
      tablesInPublicSchema: tableNames.rows
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
