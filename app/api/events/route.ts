import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const walletAddress = request.headers.get('x-wallet-address')

    let events
    if (status) {
      events = await sql`
        SELECT * FROM events 
        WHERE status = ${status}
        ORDER BY start_date ASC
        LIMIT ${limit}
      `
    } else {
      events = await sql`
        SELECT * FROM events 
        ORDER BY 
          CASE status 
            WHEN 'active' THEN 1 
            WHEN 'upcoming' THEN 2 
            ELSE 3 
          END,
          start_date ASC
        LIMIT ${limit}
      `
    }

    // If wallet address provided, check registration status for each event
    if (walletAddress) {
      const users = await sql`
        SELECT id FROM users WHERE wallet_address = ${walletAddress}
      `
      
      if (users.length > 0) {
        const userId = users[0].id
        const registrations = await sql`
          SELECT event_id FROM event_registrations WHERE user_id = ${userId}
        `
        const registeredEventIds = new Set(registrations.map(r => r.event_id))
        
        events = events.map(event => ({
          ...event,
          isRegistered: registeredEventIds.has(event.id)
        }))
      }
    }

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, action } = body

    // Get user
    const users = await sql`
      SELECT id FROM users WHERE wallet_address = ${walletAddress}
    `
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = users[0].id

    if (action === 'register') {
      // Register for event
      await sql`
        INSERT INTO event_registrations (event_id, user_id, status)
        VALUES (${eventId}, ${userId}, 'registered')
        ON CONFLICT (event_id, user_id) DO NOTHING
      `
      return NextResponse.json({ success: true, message: 'Registered for event' })
    } else if (action === 'unregister') {
      // Unregister from event
      await sql`
        DELETE FROM event_registrations 
        WHERE event_id = ${eventId} AND user_id = ${userId}
      `
      return NextResponse.json({ success: true, message: 'Unregistered from event' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error handling event action:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
