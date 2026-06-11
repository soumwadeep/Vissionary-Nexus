// AI Orchestrator - coordinates multiple AI features to provide a comprehensive response
"use server";

import { aiRouter } from "./router";
import { UserContext, buildUserContext } from "./context";
import { classifyGoal } from "./goal-classifier";
import { generateProgress } from "./progress";
import {
  saveGoalHistory,
  getActiveGoals,
} from "@/lib/db-actions";
import { serializeUserContext } from "./utils";

// Action metadata for recommendations
function getActionMetadata(category: string): any {
  switch (category) {
    case "Profile":
      return {
        title: "Complete Your Profile",
        description: "Add more details to your profile to help teammates find you",
        actionLabel: "Go to Profile",
        actionUrl: "/dashboard/participant/profile",
      };
    case "Blockchain":
      return {
        title: "Connect Your Wallet",
        description: "Connect your wallet to participate in Web3 hackathons",
        actionLabel: "Connect Wallet",
        actionUrl: "/dashboard/participant",
      };
    case "Events":
      return {
        title: "Browse Hackathons",
        description: "Find upcoming hackathons and register",
        actionLabel: "View Events",
        actionUrl: "/dashboard/participant/events",
      };
    case "Team":
      return {
        title: "Find Teammates",
        description: "Discover and connect with potential teammates",
        actionLabel: "Find Team",
        actionUrl: "/dashboard/participant/team-match",
      };
    case "Tasks":
      return {
        title: "Manage Tasks",
        description: "View and complete your hackathon tasks",
        actionLabel: "View Tasks",
        actionUrl: "/dashboard/participant/tasks",
      };
    case "Learning":
      return {
        title: "Learn More",
        description: "Explore tutorials and resources",
        actionLabel: "Explore",
        actionUrl: "/dashboard/participant",
      };
    default:
      return {
        title: "Get Started",
        description: "Begin your hackathon journey",
        actionLabel: "Explore",
        actionUrl: "/dashboard/participant",
      };
  }
}

export interface OrchestratorResult {
  goalAnalysis: any;
  mentorAdvice: string;
  recommendations: any[];
  actionPlan: any[];
  teammates: any[];
  roadmap: any;
  progress: any;
  activeGoals?: any[];
  isResumeIntent?: boolean;
  needsGoalSelection?: boolean;
}

// Main orchestrator function
export async function orchestrateAI(
  userId: string,
  userQuery: string,
  goalIdToResume?: string
): Promise<OrchestratorResult> {
  console.log("ORCHESTRATOR_START", userId);
  try {
    // 1. Build user context from database
    const userContext = await buildUserContext(userId);
    console.log("CONTEXT_BUILT");

    // 2. Classify the goal
    const goalClassification = classifyGoal(userQuery);
    console.log("GOAL_CLASSIFIED");

    // 3. If it's a resume intent
    if (goalClassification.isResumeIntent || goalIdToResume) {
      const activeGoals = await getActiveGoals(userId);

      // If user provided a specific goal to resume
      if (goalIdToResume) {
        const goalToResume = activeGoals.find((g) => g.id === goalIdToResume);
        if (goalToResume) {
          return {
            goalAnalysis: { ...goalClassification, goalToResume: goalToResume },
            mentorAdvice: `Resuming your goal: "${goalToResume.goal}"`,
            recommendations: goalToResume.recommendations || [],
            actionPlan: [],
            teammates: userContext.teammates || [],
            roadmap: goalToResume.generatedRoadmap,
            progress: goalToResume.progress,
            activeGoals,
            isResumeIntent: true,
          };
        }
      }

      // If multiple active goals, ask user to select
      if (activeGoals.length > 1) {
        return {
          goalAnalysis: goalClassification,
          mentorAdvice: "You have multiple active goals. Which one would you like to continue?",
          recommendations: [],
          actionPlan: [],
          teammates: [],
          roadmap: null,
          progress: null,
          activeGoals,
          isResumeIntent: true,
          needsGoalSelection: true,
        };
      }

      // If one active goal, resume it
      if (activeGoals.length === 1) {
        const goalToResume = activeGoals[0];
        return {
          goalAnalysis: { ...goalClassification, goalToResume },
          mentorAdvice: `Resuming your goal: "${goalToResume.goal}"`,
          recommendations: goalToResume.recommendations || [],
          actionPlan: [],
          teammates: userContext.teammates || [],
          roadmap: goalToResume.generatedRoadmap,
          progress: goalToResume.progress,
          activeGoals,
          isResumeIntent: true,
        };
      }

      // If no active goals
      return {
        goalAnalysis: goalClassification,
        mentorAdvice: "You don't have any active goals yet. Let's create one!",
        recommendations: [],
        actionPlan: [],
        teammates: [],
        roadmap: null,
        progress: null,
        activeGoals: [],
        isResumeIntent: true,
      };
    }

    // 4. Prepare user data for AI calls
    const userData = {
      userId: userContext.userId,
      userData: {
        userProfile: userContext.profile,
        skills: userContext.skills,
        reputation: userContext.reputation,
        walletConnected: userContext.walletConnected,
      },
    };

    // 5. REDESIGN: Single fast call to Nexus Agent instead of multiple parallel features
    console.log("🚀 CALLING_NEXUS_AGENT_SINGLE_REQUEST");
    const nexusResult = await aiRouter({
      feature: "nexus_agent",
      userData,
      input: userQuery,
      messages: [{ role: "user", content: userQuery }],
    });

    const mentorAdvice = nexusResult.success 
      ? nexusResult.data 
      : "I'm your Nexus Agent. How can I help you today?";

    // 6. Generate progress update (Fast, non-AI)
    const totalTasks =
      (userContext.pendingTasks?.length || 0) +
      (userContext.completedTasks?.length || 0);
    const progress = generateProgress(
      userContext.completedTasks?.length || 0,
      totalTasks,
      userContext.walletConnected || false,
      userContext.teamStatus === "in_team"
    );

    // 7. Save to goal history (Background)
    console.log("SAVING_GOAL");
    await saveGoalHistory(
      userId,
      userQuery,
      goalClassification.goalType,
      mentorAdvice, // Use the advice as the roadmap/summary for now
      [], // Empty recommendations for speed
      progress
    );
    console.log("GOAL_SAVED");

    const result = {
      goalAnalysis: goalClassification,
      mentorAdvice,
      recommendations: [], // Simplified for fast first response
      actionPlan: [], // Simplified for fast first response
      teammates: userContext.teammates || [],
      roadmap: null, // Roadmap only generated on explicit request now
      progress,
      activeGoals: await getActiveGoals(userId),
    };
    
    console.log("🏁 ORCHESTRATOR_COMPLETE", userId);
    return result;
  } catch (error) {
    console.error("ORCHESTRATOR_ERROR", error);
    throw error;
  }
}
