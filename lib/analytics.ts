
// Google Analytics 4 utility functions

export const GA_TRACKING_ID: string | undefined = process.env.NEXT_PUBLIC_ANALYTICS_ID;

// Check if GA is enabled (only in production)
export function isAnalyticsEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'production' &&
    !!GA_TRACKING_ID &&
    typeof window !== 'undefined'
  );
}

// Track page views
export function trackPageView(url: string): void {
  if (!isAnalyticsEnabled()) return;
  
  window.gtag('config', GA_TRACKING_ID as string, {
    page_path: url,
  });
}

// Track custom events
export function trackEvent(
  action: string,
  params: Record<string, unknown> = {}
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Event:', action, params);
  }
  
  if (!isAnalyticsEnabled()) return;
  
  window.gtag('event', action, params);
}

// Reusable event functions for the app
export const analyticsEvents = {
  walletConnected: (walletType: string, connectedChain?: string): void => {
    trackEvent('wallet_connected', { wallet_type: walletType, connected_chain: connectedChain });
  },

  roleSelected: (selectedRole: string): void => {
    trackEvent('role_selected', { selected_role: selectedRole });
  },

  eventRegistered: (eventId: string, eventName: string): void => {
    trackEvent('event_registered', { event_id: eventId, event_name: eventName });
  },

  teamCreated: (teamName: string, creatorRole: string): void => {
    trackEvent('team_created', { team_name: teamName, creator_role: creatorRole });
  },

  aiMentorOpened: (userRole?: string): void => {
    trackEvent('ai_mentor_opened', { user_role: userRole });
  },

  submissionCreated: (submissionType: string, eventId?: string): void => {
    trackEvent('submission_created', { submission_type: submissionType, event_id: eventId });
  },

  nftUnlocked: (badgeName: string, rarity?: string): void => {
    trackEvent('nft_unlocked', { badge_name: badgeName, rarity: rarity });
  },

  teamMatchGenerated: (teammateCount: number, minScore: number, maxScore: number): void => {
    trackEvent('team_match_generated', { 
      teammate_count: teammateCount,
      min_compatibility_score: minScore,
      max_compatibility_score: maxScore
    });
  },

  teamInviteSent: (teammateId: string, teammateName: string): void => {
    trackEvent('team_invite_sent', { 
      teammate_id: teammateId,
      teammate_name: teammateName
    });
  },

  aiMatchGenerated: (teammateCount: number, minScore: number, maxScore: number) => {
    trackEvent('ai_match_generated', { 
      teammate_count: teammateCount,
      min_compatibility_score: minScore,
      max_compatibility_score: maxScore
    })
  },

  aiAnalysisViewed: (teammateId: string, compatibilityScore: number) => {
    trackEvent('ai_analysis_viewed', { 
      teammate_id: teammateId,
      compatibility_score: compatibilityScore
    })
  },

  aiMentorMessageSent: () => {
    trackEvent('ai_mentor_message_sent')
  },

  aiMentorResponseGenerated: () => {
    trackEvent('ai_mentor_response_generated')
  },
};

