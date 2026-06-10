"use client";

import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Brain, Users, Calendar, CheckSquare, Zap, Activity, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

// Interfaces for the results
interface Recommendation {
  id?: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  actionLabel: string;
  actionUrl: string;
}

interface Task {
  id?: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  category?: string;
}

interface Teammate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  compatibility: number;
  status: string;
}

interface OrchestratorResult {
  goalAnalysis: any;
  mentorAdvice: string;
  recommendations: Recommendation[];
  actionPlan: Task[];
  teammates: Teammate[];
  roadmap: any;
  progress: any;
  activeGoals?: any[];
  isResumeIntent?: boolean;
  needsGoalSelection?: boolean;
}

const suggestedQueries = [
  { icon: Sparkles, text: "Help me win the Somnia Hackathon" },
  { icon: Brain, text: "Create a roadmap for my AI project" },
  { icon: Users, text: "Find teammates with complementary skills" },
  { icon: Calendar, text: "Plan my hackathon timeline" },
  { icon: Sparkles, text: "Continue my previous goal" },
  { icon: Sparkles, text: "Show my active goals" },
];

export default function NexusAgentPage() {
  const { session } = useAuth()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<OrchestratorResult | null>(null)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);

  // Fetch active goals on load
  const fetchActiveGoals = async () => {
    if (!session?.user?.id) return;
    try {
      setError(null);
      console.log("NEXUS_FRONTEND_START");
      const response = await fetch("/api/ai/super-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "Show my active goals",
          userId: session.user.id,
        }),
      });
      console.log("NEXUS_FRONTEND_RESPONSE", response.status);
      const data = await response.json();
      console.log("NEXUS_FRONTEND_DATA", data);
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to fetch goals");
      }
    } catch (error) {
      console.error("NEXUS_FRONTEND_ERROR", error);
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchActiveGoals();
  }, [session?.user?.id]);

  const handleSubmit = async (goalIdToResume?: string) => {
    if ((!query.trim() && !goalIdToResume) || isLoading) return;
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      console.log("NEXUS_FRONTEND_START");
      const response = await fetch("/api/ai/super-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: goalIdToResume ? "Continue my goal" : query,
          userId: session.user.id,
          goalIdToResume: goalIdToResume || selectedGoalId,
        }),
      });
      console.log("NEXUS_FRONTEND_RESPONSE", response.status);
      const data = await response.json();
      console.log("NEXUS_FRONTEND_DATA", data);
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || "Failed to process request");
      }
    } catch (error) {
      console.error("NEXUS_FRONTEND_ERROR", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Nexus Agent"
        subtitle="Your all-in-one AI assistant for hackathon success"
      />

      {error && (
        <div className="glass-card p-4 mb-6 border-red-500 bg-red-500/10">
          <p className="text-red-400">{error}</p>
          <Button
            variant="outline"
            className="mt-2 text-red-400 border-red-500 hover:border-red-400 hover:text-red-300"
            onClick={() => {
              setError(null);
              fetchActiveGoals();
            }}
          >
            Try Again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query & Mentor Response */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Query Input */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Your Goal</h3>
            </div>
            <div className="space-y-4">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="What do you want to achieve today?"
                className="bg-secondary border-border"
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={!query.trim() || isLoading}
                className="w-full glow-border"
              >
                {isLoading ? (
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Activating Nexus..." : "Activate Nexus"}
              </Button>
            </div>
          </div>

          {/* Suggested Queries */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Try These</h3>
            <div className="space-y-2">
              {suggestedQueries.map((q, i) => (
                <Button
                  key={i}
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => {
                    setQuery(q.text);
                    // If it's a resume intent, we can just submit right away
                    handleSubmit();
                  }}
                >
                  <q.icon className="w-4 h-4 mr-2" />
                  {q.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Mentor Response */}
          {result && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Nexus Guidance</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {result.mentorAdvice}
              </p>
            </div>
          )}
        </motion.div>

        {/* Results Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Goals Section */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              My Active Goals
            </h3>
            {result?.activeGoals && result.activeGoals.length > 0 ? (
              <div className="space-y-4">
                {result.activeGoals.map((goal: any) => (
                  <div key={goal.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                    <div className="flex-1">
                      <h4 className="font-medium">{goal.goal}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Progress:</span>
                          <span className="text-xs font-semibold text-primary">
                            {goal.progress?.progressPercent ?? 0}%
                          </span>
                        </div>
                        {goal.progress?.nextMilestone && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Next:</span>
                            <span className="text-xs font-medium">
                              {goal.progress.nextMilestone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedGoalId(goal.id);
                        handleSubmit(goal.id);
                      }}
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No active goals yet. Create your first goal above!</p>
            )}
          </div>

          {/* Goal Selection (if needed) */}
          {result?.needsGoalSelection && (
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Select a Goal to Continue</h3>
              <div className="space-y-3">
                {result.activeGoals?.map((goal: any) => (
                  <Button
                    key={goal.id}
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => handleSubmit(goal.id)}
                  >
                    {goal.goal}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {result && !result.needsGoalSelection && (
            <>
              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="p-4 bg-secondary/30 rounded-lg border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              rec.priority === "high"
                                ? "bg-red-500/10 text-red-400"
                                : rec.priority === "medium"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-green-500/10 text-green-400"
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {rec.description}
                        </p>
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            (window.location.href = rec.actionUrl)
                          }
                        >
                          {rec.actionLabel}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Plan */}
              {result.actionPlan.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    Action Plan
                  </h3>
                  <div className="space-y-3">
                    {result.actionPlan.map((task, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg border border-border"
                      >
                        <div className="mt-1">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {task.estimatedTime}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teammates & Roadmap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Teammates */}
                {result.teammates.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Suggested Teammates
                    </h3>
                    <div className="space-y-3">
                      {result.teammates.map((mate) => (
                        <div
                          key={mate.id}
                          className="p-3 bg-secondary/30 rounded-lg border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{mate.name}</h4>
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded">
                              {Math.round(mate.compatibility)}% match
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {mate.role}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {mate.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="default"
                      className="w-full mt-4"
                      onClick={() =>
                        (window.location.href =
                          "/dashboard/participant/team-match")
                      }
                    >
                      View More Teammates
                    </Button>
                  </div>
                )}

                {/* Roadmap */}
                {result.roadmap && (
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Roadmap
                    </h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {result.roadmap}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress */}
              {result.progress && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Progress
                  </h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span className="font-semibold text-primary">
                        {result.progress.progressPercent ?? 0}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${result.progress.progressPercent ?? 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.progress.completedMilestones &&
                      result.progress.completedMilestones.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">
                            Completed Milestones
                          </h4>
                          <ul className="space-y-1">
                            {result.progress.completedMilestones.map(
                              (m: any, i: number) => (
                                <li
                                  key={i}
                                  className="text-sm text-green-400 flex items-center gap-2"
                                >
                                  <CheckSquare className="w-4 h-4" />
                                  {m.title}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {result.progress.remainingMilestones &&
                      result.progress.remainingMilestones.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">
                            Remaining Milestones
                          </h4>
                          <ul className="space-y-1">
                            {result.progress.remainingMilestones.map(
                              (m: any, i: number) => (
                                <li
                                  key={i}
                                  className="text-sm text-muted-foreground flex items-center gap-2"
                                >
                                  <div className="w-4 h-4 rounded-full border border-muted-foreground" />
                                  {m.title}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
