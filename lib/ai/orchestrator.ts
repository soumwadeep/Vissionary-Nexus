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

    // 5. Run all AI features in parallel
    const [mentorResult, recommendationsResult, tasksResult] = await Promise.allSettled([
      // AI Mentor
      aiRouter({
        feature: "mentor",
        userData,
        input: userQuery,
        messages: [{ role: "user", content: userQuery }],
      }),
      // AI Recommendations
      aiRouter({
        feature: "recommendations",
        userData,
        input: JSON.stringify(userContext),
      }),
      // AI Task Planner
      aiRouter({
        feature: "task_planner",
        userData: {
          ...userData,
          userData: {
            userProfile: userContext.profile,
            projectContext: { goal: userQuery },
          },
        },
        input: JSON.stringify({
          userProfile: userContext.profile,
          projectContext: { goal: userQuery },
        }),
      }),
    ]);

    // 6. Process results
    const mentorAdvice =
      mentorResult.status === "fulfilled"
        ? mentorResult.value.data
        : "I'm here to help with your hackathon journey! Let's break this down into actionable steps.";

    const recommendations =
      recommendationsResult.status === "fulfilled"
        ? recommendationsResult.value.data
            ?.map((rec: any) => ({
              ...rec,
              ...getActionMetadata(rec.category || "Profile"),
            }))
            .slice(0, 4) || []
        : [];

    const actionPlan =
      tasksResult.status === "fulfilled"
        ? tasksResult.value.data?.slice(0, 6) || []
        : [];

    // 7. Generate roadmap using AI mentor
    const roadmapQuery = `Generate a personalized step-by-step roadmap for achieving this goal: "${userQuery}". 
  Use this user context: ${serializeUserContext(userContext)}. 
  Structure it with: Today, This Week, Next Week, Before Submission, After Submission.`;
    const roadmapResult = await aiRouter({
      feature: "mentor",
      userData,
      input: roadmapQuery,
      messages: [{ role: "user", content: roadmapQuery }],
    });

    // 8. Generate progress update
    const totalTasks =
      (userContext.pendingTasks?.length || 0) +
      (userContext.completedTasks?.length || 0);
    const progress = generateProgress(
      userContext.completedTasks?.length || 0,
      totalTasks,
      userContext.walletConnected || false,
      userContext.teamStatus === "in_team"
    );

    // 9. Save to goal history
    console.log("SAVING_GOAL");
    await saveGoalHistory(
      userId,
      userQuery,
      goalClassification.goalType,
      roadmapResult.data,
      recommendations,
      progress
    );
    console.log("GOAL_SAVED");

    return {
      goalAnalysis: goalClassification,
      mentorAdvice,
      recommendations,
      actionPlan,
      teammates: userContext.teammates || [],
      roadmap: roadmapResult.data,
      progress,
      activeGoals: await getActiveGoals(userId),
    };
  } catch (error) {
    console.error("ORCHESTRATOR_ERROR", error);
    throw error;
  }
}
