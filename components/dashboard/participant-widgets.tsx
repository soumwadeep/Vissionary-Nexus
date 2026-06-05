"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Trophy, Users, Zap, TrendingUp, Star, ArrowRight, Activity, Brain, Sparkles, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { HolographicPanel, FloatingElement, PulseRing } from "@/components/ecosystem/micro-interactions"
import { WalletStatusWidget } from "@/components/web3/wallet-status-widget"
import { BlockchainReputationMeter } from "@/components/web3/blockchain-reputation"
import { SomniaSyncIndicator } from "@/components/web3/somnia-sync-indicator"
import { NFTAchievementShowcase } from "@/components/web3/nft-achievements"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

// Fetcher with wallet address header
const fetcher = (url: string, walletAddress?: string) =>
  fetch(url, {
    headers: walletAddress ? { 'x-wallet-address': walletAddress } : {}
  }).then(res => res.json())

interface Event {
  id: string
  title: string
  start_date: string
  end_date: string
  prize_pool: string
  max_participants: number
  status: string
  isRegistered?: boolean
}

interface UserStats {
  hackathonsJoined: number
  projectsCreated: number
  collaborations: number
  achievements: number
  reputationScore: number
  totalPoints: number
}

const initialRecommendations = [
  { id: 1, text: "Complete your profile to improve team matching by 45%", isNew: true },
  { id: 2, text: "Join the AI Innovation Hackathon - matches your skills", isNew: true },
  { id: 3, text: "New mentor available in your domain - schedule a session", isNew: false },
]

const recentCollaborations = [
  { name: "Sarah Chen", role: "Frontend Dev", project: "AI Dashboard" },
  { name: "Mike Johnson", role: "Backend Dev", project: "API Gateway" },
  { name: "Elena Rodriguez", role: "Designer", project: "Mobile App" },
]

// Format date for display
function formatEventDate(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`
}

export function ParticipantWidgets() {
  const { walletAddress, isConnected } = useWalletAuth()
  
  // Fetch real stats from API
  const { data: statsData } = useSWR<UserStats>(
    isConnected ? ['/api/user/stats', walletAddress] : null,
    ([url, wallet]) => fetcher(url, wallet as string),
    { refreshInterval: 30000 }
  )

  // Fetch real events from API
  const { data: eventsData } = useSWR<{ events: Event[] }>(
    ['/api/events?status=upcoming&limit=3', walletAddress],
    ([url, wallet]) => fetcher(url, wallet as string | undefined),
    { refreshInterval: 60000 }
  )

  const upcomingEvents = eventsData?.events || []
  
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [activityPulse, setActivityPulse] = useState(false)
  
  // Build stats from real data
  const stats = [
    { icon: Trophy, label: "Hackathons", value: statsData?.hackathonsJoined || 0, display: (statsData?.hackathonsJoined || 0).toString(), change: "+0" },
    { icon: Star, label: "Reputation", value: statsData?.reputationScore || 0, display: (statsData?.reputationScore || 0).toString(), change: "+0" },
    { icon: Users, label: "Collaborations", value: statsData?.collaborations || 0, display: (statsData?.collaborations || 0).toString(), change: "+0" },
    { icon: Zap, label: "Achievements", value: statsData?.achievements || 0, display: (statsData?.achievements || 0).toString(), change: "+0" },
  ]

  // Activity pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityPulse(true)
      setTimeout(() => setActivityPulse(false), 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Add new recommendations periodically
  useEffect(() => {
    const newRecs = [
      "Your skill growth rate increased by 12% this week",
      "3 new projects match your expertise - check them out",
      "AI detected optimal collaboration opportunity",
      "Complete the React challenge to unlock new badges",
    ]

    const interval = setInterval(() => {
      const newRec = {
        id: Date.now(),
        text: newRecs[Math.floor(Math.random() * newRecs.length)],
        isNew: true,
      }
      setRecommendations((prev) => [newRec, ...prev.slice(0, 2)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <HolographicPanel key={stat.label}>
            <div className="p-4 relative overflow-hidden">
              {/* Activity indicator */}
              {activityPulse && index === 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  className="absolute inset-0 bg-primary rounded-xl"
                />
              )}
              <div className="flex items-center justify-between mb-2 relative">
                <motion.div
                  animate={{ rotate: activityPulse ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <motion.span
                  key={stat.change}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xs text-primary font-medium"
                >
                  {stat.change}
                </motion.span>
              </div>
              <motion.div
                key={stat.display}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                {stat.display}
              </motion.div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </HolographicPanel>
        ))}
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Events
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/participant/events">View All</Link>
          </Button>
        </div>
        <div className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No upcoming events. Check back soon!
            </div>
          ) : (
            upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 5, backgroundColor: "rgba(74, 222, 128, 0.05)" }}
                className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="font-medium text-sm mb-1">{event.title}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatEventDate(event.start_date, event.end_date)}</span>
                  <span className="text-primary font-semibold">{event.prize_pool}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        {/* AI thinking animation */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-4 h-4 text-primary" />
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 glow-border">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Recommendations</h3>
            <span className="text-xs text-muted-foreground">Personalized for you</span>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {recommendations.map((rec) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                layout
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
              >
                <span className="relative flex h-2 w-2 mt-1.5">
                  {rec.isNew && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm">{rec.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Skill Growth with animated chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Skill Growth
          </h3>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Activity className="w-4 h-4 text-primary/50" />
          </motion.div>
        </div>
        <div className="space-y-4">
          {[
            { skill: "React", level: 85, growth: 12 },
            { skill: "TypeScript", level: 72, growth: 8 },
            { skill: "Node.js", level: 68, growth: 15 },
            { skill: "AI/ML", level: 45, growth: 22 },
          ].map((skill, index) => (
            <div key={skill.skill}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{skill.skill}</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-xs text-primary"
                >
                  +{skill.growth}%
                </motion.span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Collaborations with network visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="lg:col-span-2 glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Recent Collaborations
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/participant/team-match">
              Find Team
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentCollaborations.map((collab, index) => (
            <motion.div
              key={collab.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(74, 222, 128, 0.1)" }}
              className="p-4 rounded-lg bg-secondary/50 border border-border text-center cursor-pointer transition-all"
            >
              <div className="relative mx-auto mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 rounded-full border border-dashed border-primary/30"
                />
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {collab.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              </div>
              <div className="font-medium text-sm">{collab.name}</div>
              <div className="text-xs text-muted-foreground">{collab.role}</div>
              <div className="text-xs text-primary mt-1">{collab.project}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          {[
            { href: "/dashboard/participant/events", icon: Calendar, label: "Browse Events" },
            { href: "/dashboard/participant/team-match", icon: Users, label: "Find Teammates" },
            { href: "/dashboard/participant/ai-mentor", icon: Sparkles, label: "Ask AI Mentor" },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href={action.href}>
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Link>
              </Button>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild className="w-full justify-start glow-border">
              <Link href="/dashboard/participant/submissions">
                Submit Project
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Blockchain Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="lg:col-span-3"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Blockchain & Web3</h3>
          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
            Somnia Ready
          </span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 min-w-0">
          <WalletStatusWidget />
          <BlockchainReputationMeter />
          <SomniaSyncIndicator />
        </div>
      </motion.div>

      {/* NFT Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="lg:col-span-3 glass-card p-6"
      >
        <NFTAchievementShowcase />
      </motion.div>
    </div>
  )
}
