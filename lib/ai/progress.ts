// Progress tracker - generate progress updates for goals
export interface ProgressUpdate {
  progressPercent: number
  completedMilestones: Array<{ title: string; completed: boolean }>
  remainingMilestones: Array<{ title: string; completed: boolean }>
  nextMilestone?: string
}

// Generate progress based on user context and tasks
export function generateProgress(
  completedTasksCount: number,
  totalTasksCount: number,
  walletConnected: boolean,
  hasTeam: boolean
): ProgressUpdate {
  // Define milestones based on common goals
  const allMilestones = [
    { title: 'Wallet Connected', completed: walletConnected },
    { title: 'Team Formed', completed: hasTeam },
    { title: 'Project Planned', completed: completedTasksCount > 0 },
    { title: 'MVP Built', completed: completedTasksCount >= 3 },
    { title: 'Testing Complete', completed: completedTasksCount >= 5 },
    { title: 'Project Submitted', completed: completedTasksCount >= 8 }
  ]

  const completedMilestones = allMilestones.filter(m => m.completed)
  const remainingMilestones = allMilestones.filter(m => !m.completed)
  const nextMilestone = remainingMilestones.length > 0 ? remainingMilestones[0].title : undefined

  // Calculate progress percent
  const totalMilestones = allMilestones.length
  const progressPercent = Math.round((completedMilestones.length / totalMilestones) * 100)

  return {
    progressPercent,
    completedMilestones,
    remainingMilestones,
    nextMilestone
  }
}
