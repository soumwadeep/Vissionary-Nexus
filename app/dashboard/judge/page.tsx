"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Scale,
  Trophy,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Star,
  TrendingUp,
  TrendingDown,
  Bot,
  Eye,
  Loader2,
  Brain,
  Zap,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

const pendingReviews = [
  {
    id: 1,
    title: "AI Code Assistant",
    team: "CodeCrafters",
    submitted: "2 hours ago",
    aiScore: 87,
    aiSummary: "Innovative approach to code generation with strong technical implementation",
    strengths: ["Clean architecture", "Good documentation", "Innovative features"],
    weaknesses: ["Limited testing", "Could improve UX"],
    techStack: ["React", "Node.js", "OpenAI"],
  },
  {
    id: 2,
    title: "DeFi Dashboard",
    team: "Web3 Wizards",
    submitted: "4 hours ago",
    aiScore: 82,
    aiSummary: "Comprehensive DeFi analytics with real-time data visualization",
    strengths: ["Great UI/UX", "Real-time data", "Mobile responsive"],
    weaknesses: ["Security concerns", "Performance optimization needed"],
    techStack: ["Next.js", "Solidity", "The Graph"],
  },
  {
    id: 3,
    title: "Smart Contract Analyzer",
    team: "BlockBuilders",
    submitted: "6 hours ago",
    aiScore: 92,
    aiSummary: "Excellent security analysis tool with comprehensive vulnerability detection",
    strengths: ["High accuracy", "Detailed reports", "Well tested"],
    weaknesses: ["Complex setup", "Limited documentation"],
    techStack: ["Python", "Rust", "Web3.py"],
  },
]

const reviewedProjects = [
  { id: 1, title: "ML Pipeline Tool", team: "DataMinds", myScore: 85, finalScore: 84 },
  { id: 2, title: "IoT Dashboard", team: "TechNova", myScore: 78, finalScore: 80 },
  { id: 3, title: "Health Tracker", team: "WellnessAI", myScore: 90, finalScore: 88 },
]

const aiInsights = [
  "3 projects show exceptional innovation in AI/ML integration",
  "Security scores averaging 15% higher than last hackathon",
  "Team CodeCrafters demonstrates strong code quality metrics",
  "Recommend prioritizing Smart Contract Analyzer for final review",
]

export default function JudgeDashboard() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentInsight, setCurrentInsight] = useState(0)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % aiInsights.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleAnalyze = (id: number) => {
    setIsAnalyzing(true)
    setSelectedProject(id)
    setTimeout(() => setIsAnalyzing(false), 2000)
  }

  return (
    <>
      <DashboardHeader
        title="Judge Dashboard"
        subtitle="Review submissions and evaluate projects"
      />

      {/* AI Insights Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-chart-4/10 via-chart-4/5 to-transparent border border-chart-4/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-6 h-6 text-chart-4" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-chart-4"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div>
              <div className="text-sm font-medium flex items-center gap-2">
                AI Review Assistant
                <Badge variant="outline" className="text-xs border-chart-4/30 text-chart-4">
                  <Zap className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentInsight}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-muted-foreground"
                >
                  {aiInsights[currentInsight]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-chart-4/30">
            <Eye className="w-4 h-4 mr-1" />
            Full Analysis
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: FileText, label: "Pending Reviews", value: "3", color: "text-orange-400", trend: "+2" },
            { icon: CheckCircle, label: "Completed", value: "12", color: "text-primary", trend: "+5" },
            { icon: Scale, label: "Avg Score Given", value: "84.2", color: "text-chart-2", trend: "+1.3" },
            { icon: Trophy, label: "Events Judged", value: "5", color: "text-chart-4", trend: null },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="glass-card p-4 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                {stat.trend && (
                  <Badge variant="outline" className="text-xs text-primary border-primary/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pending Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Pending Reviews
              <Badge variant="secondary">{pendingReviews.length}</Badge>
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/judge/submissions">View All</Link>
            </Button>
          </div>

          {pendingReviews.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`glass-card p-5 cursor-pointer transition-all ${
                expandedCard === project.id ? "ring-2 ring-primary/50" : ""
              }`}
              onClick={() => setExpandedCard(expandedCard === project.id ? null : project.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg">{project.title}</h4>
                    <ChevronRight 
                      className={`w-4 h-4 text-muted-foreground transition-transform ${
                        expandedCard === project.id ? "rotate-90" : ""
                      }`} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">by {project.team}</p>
                  <div className="flex gap-1 mt-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={selectedProject === project.id && isAnalyzing ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      {isAnalyzing && selectedProject === project.id ? (
                        <Loader2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-primary" />
                      )}
                    </motion.div>
                    <motion.span 
                      className="text-2xl font-bold text-primary"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {project.aiScore}
                    </motion.span>
                  </div>
                  <p className="text-xs text-muted-foreground">AI Score</p>
                </div>
              </div>

              <motion.div 
                className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-4"
                animate={selectedProject === project.id && isAnalyzing ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <p className="text-sm flex items-start gap-2">
                  <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {project.aiSummary}
                </p>
              </motion.div>

              <AnimatePresence>
                {expandedCard === project.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-xs font-medium text-primary mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Strengths
                        </h5>
                        <ul className="space-y-1">
                          {project.strengths.map((s, i) => (
                            <motion.li 
                              key={s} 
                              className="text-xs text-muted-foreground flex items-center gap-1"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {s}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-xs font-medium text-destructive mb-2 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" /> Areas for Improvement
                        </h5>
                        <ul className="space-y-1">
                          {project.weaknesses.map((w, i) => (
                            <motion.li 
                              key={w} 
                              className="text-xs text-muted-foreground flex items-center gap-1"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                              {w}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* AI Deep Analysis Button */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-4/5 border border-chart-4/20 mb-4">
                      <Brain className="w-4 h-4 text-chart-4" />
                      <span className="text-xs text-muted-foreground flex-1">
                        Request deeper AI analysis for code quality, security, and innovation metrics
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-chart-4/30 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAnalyze(project.id)
                        }}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing && selectedProject === project.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 mr-1" />
                            Deep Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">Submitted {project.submitted}</span>
                <Button 
                  size="sm" 
                  className="glow-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  Review Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* AI Comparison Tool */}
          <div className="glass-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-chart-2" />
              AI Compare Tool
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select projects to get AI-powered comparative analysis
            </p>
            <div className="space-y-2 mb-4">
              {pendingReviews.slice(0, 2).map((project) => (
                <motion.div
                  key={project.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 border border-border"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-sm">{project.title}</span>
                  <Badge variant="outline">{project.aiScore}</Badge>
                </motion.div>
              ))}
            </div>
            <Button className="w-full" variant="outline">
              <Brain className="w-4 h-4 mr-2" />
              Generate Comparison
            </Button>
          </div>

          {/* Reviewed Projects */}
          <div className="glass-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              Recently Reviewed
            </h3>
            <div className="space-y-3">
              {reviewedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{project.title}</h4>
                      <p className="text-xs text-muted-foreground">{project.team}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">Your: <strong>{project.myScore}</strong></span>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={project.finalScore > project.myScore ? "text-primary" : ""}
                    >
                      Final: {project.finalScore}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scoring Criteria */}
          <div className="glass-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-chart-2" />
              Scoring Criteria
            </h3>
            <div className="space-y-3">
              {[
                { name: "Innovation", weight: 25, color: "bg-primary" },
                { name: "Technical", weight: 25, color: "bg-chart-2" },
                { name: "Originality", weight: 20, color: "bg-chart-4" },
                { name: "Scalability", weight: 15, color: "bg-orange-400" },
                { name: "Presentation", weight: 15, color: "bg-chart-5" },
              ].map((criteria, index) => (
                <motion.div 
                  key={criteria.name} 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <span className="text-sm">{criteria.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${criteria.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${criteria.weight * 4}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {criteria.weight}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
