import { UserContext } from './context'

// Serializes user context into a string for AI prompts
export function serializeUserContext(context: UserContext): string {
  let contextStr = ''
  
  if (context.profile?.name) {
    contextStr += `User: ${context.profile.name}\n`
  }
  if (context.profile?.role) {
    contextStr += `Role: ${context.profile.role}\n`
  }
  if (context.skills && context.skills.length > 0) {
    contextStr += `Skills: ${context.skills.join(', ')}\n`
  }
  if (context.reputation !== undefined) {
    contextStr += `Reputation: ${context.reputation}\n`
  }
  if (context.walletConnected !== undefined) {
    contextStr += `Wallet Connected: ${context.walletConnected ? 'Yes' : 'No'}\n`
  }
  if (context.teamStatus) {
    contextStr += `Team Status: ${context.teamStatus.replace('_', ' ')}\n`
  }
  if (context.nftBadges && context.nftBadges.length > 0) {
    contextStr += `NFT Badges: ${context.nftBadges.map(b => b.title).join(', ')}\n`
  }
  if (context.completedTasks && context.completedTasks.length > 0) {
    contextStr += `Completed Tasks: ${context.completedTasks.length}\n`
  }
  
  return contextStr.trim()
}
