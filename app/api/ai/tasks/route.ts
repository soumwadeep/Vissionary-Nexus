import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { aiRouter } from '@/lib/ai/router'

const sql = neon(process.env.DATABASE_URL!)

// Fallback task generation
function generateFallbackTasks(
  userProfile: any,
  _projectContext?: any
): any[] {
  const role = userProfile?.role || 'participant'
  const skills = userProfile?.skills || ['problem-solving', 'creativity']
  const interests = userProfile?.interests || ['innovation', 'technology']
  
  const fallbackTasks = [
    {
      title: 'Define project goals and scope',
      description: 'Clearly outline what your project aims to achieve and set realistic goals for the hackathon.',
      priority: 'high',
      estimatedTime: '1 Hour',
      category: 'Planning'
    },
    {
      title: 'Set up project repository',
      description: 'Initialize git repository, add README, and set up basic project structure.',
      priority: 'high',
      estimatedTime: '30 Minutes',
      category: 'Development'
    },
    {
      title: 'Create project wireframes',
      description: 'Sketch out the basic UI and user flow for your application.',
      priority: 'medium',
      estimatedTime: '1.5 Hours',
      category: 'Planning'
    },
    {
      title: 'Implement authentication',
      description: 'Add user authentication to your application.',
      priority: 'high',
      estimatedTime: '2 Hours',
      category: 'Development'
    },
    {
      title: 'Write unit tests',
      description: 'Create basic tests for your core functionality.',
      priority: 'medium',
      estimatedTime: '1.5 Hours',
      category: 'Testing'
    }
  ]
  
  // Add some role-specific tasks
  if (role === 'developer' || skills.includes('blockchain')) {
    fallbackTasks.push({
      title: 'Configure blockchain integration',
      description: 'Set up wallet connection and basic smart contract interaction.',
      priority: 'high',
      estimatedTime: '2 Hours',
      category: 'Blockchain'
    })
  }
  
  if (interests.includes('web3') || interests.includes('blockchain')) {
    fallbackTasks.push({
      title: 'Test smart contract on testnet',
      description: 'Deploy and test your smart contract on a test network like Somnia.',
      priority: 'medium',
      estimatedTime: '1 Hour',
      category: 'Blockchain'
    })
  }
  
  return fallbackTasks.slice(0, 6)
}

export async function POST(request: NextRequest) {
  let userProfile: any = null
  let projectContext: any = null
  let userId: string | null = null
  
  try {
    const requestData = await request.json()
    userProfile = requestData.userProfile
    projectContext = requestData.projectContext
    userId = requestData.userId
    
    // Track AI request
    if (userId) {
      try {
        await sql`
          INSERT INTO ai_activity (user_id, type, description, input_data, model)
          VALUES (${userId}, 'ai_request', 'AI task planner request', ${JSON.stringify({ userProfile, projectContext })}, 'meta/llama-3.3-70b-instruct')
        `
      } catch (e) {
        console.error('Failed to track AI request:', e)
      }
    }
    
    // Use AI Router
    const result = await aiRouter({
      feature: "task_planner",
      userData: {
        userId: userId || undefined,
        userData: { userProfile, projectContext }
      },
      input: JSON.stringify({ userProfile, projectContext })
    })
    
    // Track error or fallback
    if (!result.success || result.usedFallback) {
      if (userId) {
        try {
          await sql`
            INSERT INTO ai_activity (user_id, type, description, input_data, model)
            VALUES (${userId}, ${result.usedFallback ? 'ai_fallback' : 'ai_error'}, ${result.error || 'AI fallback used'}, ${JSON.stringify({ userProfile, projectContext })}, 'meta/llama-3.3-70b-instruct')
          `
        } catch (e) {
          console.error('Failed to track AI error/fallback:', e)
        }
      }
    }

    let tasks: any[]
    if (result.success && result.data) {
      tasks = result.data
    } else {
      tasks = generateFallbackTasks(userProfile, projectContext)
    }
    
    return NextResponse.json({
      tasks,
      isFallback: result.usedFallback
    })
    
  } catch (error) {
    console.error('AI Tasks API error:', error)
    return NextResponse.json({
      tasks: generateFallbackTasks(userProfile, projectContext),
      isFallback: true
    })
  }
}
