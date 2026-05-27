"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  FileText,
  Shield,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Activity,
  Zap,
  Eye,
  Bot,
  Wallet,
  Link2,
  Award,
} from "lucide-react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { BlockchainVisualization } from "@/components/web3/blockchain-visualization"

const activeEvents = [
  {
    id: 1,
    title: "AI Innovation Hackathon",
    status: "active",
    participants: 234,
    submissions: 45,
    daysLeft: 3,
    aiActivity: 89,
  },
  {
    id: 2,
    title: "Web3 Builders Challenge",
    status: "upcoming",
    participants: 156,
    submissions: 0,
    daysLeft: 7,
    aiActivity: 45,
  },
]

const moderationAlerts = [
  { id: 1, type: "spam", message: "Suspicious submission detected", severity: "high", aiConfidence: 94 },
  { id: 2, type: "duplicate", message: "Possible duplicate project found", severity: "medium", aiConfidence: 78 },
  { id: 3, type: "review", message: "5 submissions pending review", severity: "low", aiConfidence: 100 },
]

const recentSubmissions = [
  { id: 1, title: "AI Code Assistant", team: "CodeCrafters", score: 87, status: "reviewed" },
  { id: 2, title: "DeFi Dashboard", team: "Web3 Wizards", score: null, status: "pending" },
  { id: 3, title: "Smart Contract Analyzer", team: "BlockBuilders", score: 92, status: "reviewed" },
]

const aiActions = [
  "Analyzing submission #47 for code quality...",
  "Detecting potential plagiarism in project files...",
  "Matching teams based on skill compatibility...",
  "Generating feedback for CodeCrafters submission...",
  "Scanning for security vulnerabilities...",
  "Processing mentor availability schedules...",
]

export default function HostDashboard() {
  const [currentAIAction, setCurrentAIAction] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)
  const [liveStats, setLiveStats] = useState({
    participants: 390,
    submissions: 45,
    activeTeams: 78,
  })

  useEffect(() => {
    const actionInterval = setInterval(() => {
      setCurrentAIAction((prev) => (prev + 1) % aiActions.length)
    }, 3000)

    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        participants: prev.participants + Math.floor(Math.random() * 3),
        submissions: prev.submissions + (Math.random() > 0.7 ? 1 : 0),
        activeTeams: prev.activeTeams + (Math.random() > 0.8 ? 1 : 0),
      }))
    }, 5000)

    return () => {
      clearInterval(actionInterval)
      clearInterval(statsInterval)
    }
  }, [])

  return (
    <>
      <DashboardHeader
        title="Host Dashboard"
        subtitle="Manage your hackathons and track participant activity"
      />

      {/* AI Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="w-6 h-6 text-primary" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <div>
              <div className="text-sm font-medium flex items-center gap-2">
                AI Moderation Active
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentAIAction}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-muted-foreground"
                >
                  {aiActions[currentAIAction]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">AI Processed Today</div>
              <div className="text-lg font-bold text-primary">1,247</div>
            </div>
            <Button size="sm" variant="outline" className="border-primary/30">
              <Eye className="w-4 h-4 mr-1" />
              View Logs
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Calendar, label: "Active Events", value: "2", color: "text-chart-2", pulse: false },
            { icon: Users, label: "Total Participants", value: liveStats.participants.toString(), color: "text-primary", pulse: true },
            { icon: FileText, label: "Submissions", value: liveStats.submissions.toString(), color: "text-chart-4", pulse: true },
            { icon: Shield, label: "Moderation Alerts", value: "3", color: "text-destructive", pulse: true },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="glass-card p-4 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                {stat.pulse && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                )}
              </div>
              <motion.div 
                className="text-2xl font-bold"
                key={stat.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Active Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-chart-2" />
              Your Events
            </h3>
            <Button asChild size="sm" className="glow-border">
              <Link href="/dashboard/host/create-event">
                <Plus className="w-4 h-4 mr-1" />
                Create Event
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {activeEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-chart-2/30 transition-all hover:shadow-lg hover:shadow-chart-2/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge
                      variant={event.status === "active" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {event.status === "active" && (
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                      {event.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {event.daysLeft} days left
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                      <Zap className="w-3 h-3" />
                      <span>{event.aiActivity}% AI activity</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{event.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{event.submissions} submissions</span>
                  </div>
                </div>
                {/* AI Activity Bar */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">AI Processing Load</span>
                    <span className="text-primary">{event.aiActivity}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${event.aiActivity}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Moderation Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              AI Moderation Alerts
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/host/moderation">View All</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {moderationAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-3 rounded-lg border relative overflow-hidden ${
                  alert.severity === "high"
                    ? "bg-destructive/10 border-destructive/30"
                    : alert.severity === "medium"
                    ? "bg-chart-4/10 border-chart-4/30"
                    : "bg-secondary border-border"
                }`}
              >
                {alert.severity === "high" && (
                  <motion.div
                    className="absolute inset-0 bg-destructive/5"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <div className="flex items-start gap-3 relative">
                  <AlertTriangle
                    className={`w-4 h-4 mt-0.5 ${
                      alert.severity === "high"
                        ? "text-destructive"
                        : alert.severity === "medium"
                        ? "text-chart-4"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        {alert.aiConfidence}% confident
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-chart-4" />
              Recent Submissions
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/host/submissions">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/20 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-sm">{submission.title}</h4>
                  <p className="text-xs text-muted-foreground">{submission.team}</p>
                </div>
                <div className="flex items-center gap-3">
                  {submission.score !== null ? (
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-lg font-bold text-primary">{submission.score}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">AI Score</div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="animate-pulse">
                      <Bot className="w-3 h-3 mr-1" />
                      Processing
                    </Badge>
                  )}
                  {submission.status === "reviewed" && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            Activity Trend
          </h3>
          <div className="h-32 flex items-end gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${30 + Math.random() * 70}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="flex-1 bg-primary/20 rounded-t-sm relative overflow-hidden"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${50 + Math.random() * 50}%` }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                  className="absolute bottom-0 w-full bg-primary rounded-t-sm"
                />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </motion.div>

        {/* Blockchain Features for Host */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Blockchain Integration</h3>
            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
              Web3 Ready
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wallet-linked Participants */}
            <motion.div 
              className="glass-card p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Wallet-Linked Participants</h4>
                  <p className="text-xs text-muted-foreground">Verified on-chain</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-primary">156</div>
                  <div className="text-xs text-muted-foreground">Connected</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold">234</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs text-muted-foreground">40% wallet verification rate</span>
                </div>
              </div>
            </motion.div>

            {/* NFT Reward Preparation */}
            <motion.div 
              className="glass-card p-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 border border-chart-4/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">NFT Rewards</h4>
                  <p className="text-xs text-muted-foreground">Achievement badges</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Winner Badge", status: "ready", count: 3 },
                  { name: "Participant Badge", status: "ready", count: 234 },
                  { name: "Special Merit", status: "pending", count: 10 },
                ].map((reward, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span className="text-xs">{reward.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">x{reward.count}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        reward.status === "ready" ? "bg-primary/20 text-primary" : "bg-chart-4/20 text-chart-4"
                      }`}>
                        {reward.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Blockchain Verification Status */}
            <motion.div 
              className="glass-card p-4 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <BlockchainVisualization className="absolute inset-0 opacity-20" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Verification Status</h4>
                    <p className="text-xs text-muted-foreground">Decentralized tracking</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Submissions verified</span>
                    <span className="text-sm font-medium text-primary">32/45</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "71%" }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-xs text-muted-foreground">Somnia network synced</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
