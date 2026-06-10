"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Users,
  Award,
  Star,
  Zap,
} from "lucide-react"
import { HolographicPanel } from "@/components/ecosystem/micro-interactions"

interface LeaderboardTeam {
  id: string
  name: string
  rank: number
  score: number
  events: number
  badges: number
}

interface LeaderboardStats {
  totalTeams: number
  topScore: number
  badgesAwarded: number
}

const defaultStats: LeaderboardStats = {
  totalTeams: 0,
  topScore: 0,
  badgesAwarded: 0,
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([])
  const [stats, setStats] = useState<LeaderboardStats>(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/host/leaderboard")
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
        setStats(data.stats || defaultStats)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
        setStats(defaultStats)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  const statsDisplay = [
    { label: "Total Teams", value: stats.totalTeams.toString(), icon: Users },
    { label: "Top Score", value: stats.topScore.toLocaleString(), icon: Trophy },
    { label: "Badges Awarded", value: stats.badgesAwarded.toString(), icon: Award },
  ]

  return (
    <>
      <DashboardHeader
        title="Leaderboard"
        subtitle="View top performing teams and participants"
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
      >
        {statsDisplay.map((stat, index) => (
          <HolographicPanel key={stat.label}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <motion.div
                key={stat.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </HolographicPanel>
        ))}
      </motion.div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <HolographicPanel>
            <div className="p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Top Teams
                <div className="ml-auto">
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                </div>
              </h3>
              <div className="flex items-end justify-center gap-8">
                {/* 2nd Place */}
                {leaderboard.slice(1, 2).map((team) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-chart-4/20 border border-chart-4/30 flex items-center justify-center mb-2 mx-auto relative">
                      <div className="absolute inset-0 rounded-full border border-chart-4/30 animate-ping opacity-20" />
                      <span className="text-2xl font-bold text-chart-4 relative z-10">{team.rank}</span>
                    </div>
                    <h4 className="font-medium">{team.name}</h4>
                    <div className="text-2xl font-bold text-chart-4 mt-1">{team.score}</div>
                  </motion.div>
                ))}

                {/* 1st Place */}
                {leaderboard.slice(0, 1).map((team) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-center relative z-10"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <motion.div
                        animate={{ y: [0, -5, 0], rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Trophy className="w-10 h-10 text-yellow-400" />
                      </motion.div>
                    </div>
                    <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-2 mx-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
                      <span className="text-4xl font-bold text-primary relative z-10">{team.rank}</span>
                    </div>
                    <h4 className="font-medium text-xl text-primary">{team.name}</h4>
                    <div className="text-3xl font-bold text-primary mt-1">{team.score}</div>
                  </motion.div>
                ))}

                {/* 3rd Place */}
                {leaderboard.slice(2, 3).map((team) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-chart-5/20 border border-chart-5/30 flex items-center justify-center mb-2 mx-auto">
                      <span className="text-2xl font-bold text-chart-5">{team.rank}</span>
                    </div>
                    <h4 className="font-medium">{team.name}</h4>
                    <div className="text-2xl font-bold text-chart-5 mt-1">{team.score}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </HolographicPanel>
        </motion.div>
      )}

      {/* Leaderboard List */}
      {leaderboard.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {leaderboard.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ x: 5, boxShadow: "0 10px 40px rgba(74, 222, 128, 0.1)" }}
              className="glass-card p-4 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  team.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                  team.rank === 2 ? "bg-gray-200 text-gray-700" :
                  team.rank === 3 ? "bg-orange-100 text-orange-700" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {team.rank}
                </div>
                <div>
                  <h4 className="font-medium">{team.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{team.events} events</span>
                    <span>•</span>
                    <span>{team.badges} badges</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold">{team.score}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(team.badges, 3) }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Star className="w-3 h-3 text-primary" />
                    </div>
                  ))}
                  {team.badges > 3 && (
                    <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center">
                      <span className="text-xs">+{team.badges - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No teams yet</p>
        </div>
      )}
    </>
  )
}
