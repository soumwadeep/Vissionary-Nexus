// Shared fallback logic for AI features
export interface FallbackData {
  userId?: string
  userData?: {
    role?: string
    skills?: string[]
    interests?: string[]
    reputation?: number
    walletConnected?: boolean
    [key: string]: any
  }
}

// Fallback recommendations
export function getFallbackRecommendations(data: FallbackData) {
  const recs: any[] = [
    {
      title: "Complete your profile",
      description: "Complete your profile to improve team matching by 45%.",
      priority: "high",
      category: "Profile"
    },
    {
      title: "Join upcoming events",
      description: "Participate in upcoming hackathons to boost your reputation.",
      priority: "medium",
      category: "Events"
    }
  ]

  if (!data.userData?.walletConnected) {
    recs.push({
      title: "Connect your wallet",
      description: "Connect your wallet to access blockchain features and NFTs.",
      priority: "high",
      category: "Blockchain"
    })
  }

  recs.push({
    title: "Find teammates",
    description: "Use the team match feature to find collaborators with complementary skills.",
    priority: "medium",
    category: "Team"
  })

  return recs
}

// Fallback tasks
export function getFallbackTasks(data: any) {
  const userProfile = data?.userProfile || data
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
