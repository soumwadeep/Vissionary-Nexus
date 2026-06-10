"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  BarChart3,
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react"
import { HolographicPanel } from "@/components/ecosystem/micro-interactions"

interface AnalyticsData {
  totalEvents: number
  totalParticipants: number
  totalSubmissions: number
  completionRate: number
  monthlyData: Array<{ month: string; participants: number; submissions: number }>
}

const defaultAnalytics: AnalyticsData = {
  totalEvents: 0,
  totalParticipants: 0,
  totalSubmissions: 0,
  completionRate: 0,
  monthlyData: [],
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/host/analytics")
        const data = await response.json()
        if (data && typeof data.totalEvents === "number" && typeof data.totalParticipants === "number") {
          setAnalytics(data)
        } else {
          setAnalytics(defaultAnalytics)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setAnalytics(defaultAnalytics)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  const stats = [
    { label: "Total Events", value: analytics.totalEvents.toString(), icon: Calendar, trend: "up", change: "+0" },
    { label: "Total Participants", value: analytics.totalParticipants.toString(), icon: Users, trend: "up", change: "+0" },
    { label: "Total Submissions", value: analytics.totalSubmissions.toString(), icon: Trophy, trend: "up", change: "+0" },
    { label: "Completion Rate", value: `${analytics.completionRate}%`, icon: BarChart3, trend: "up", change: "+0%" },
  ]

  const monthlyData = analytics.monthlyData || []
  const maxParticipants = Math.max(...monthlyData.map(d => d.participants), 1)
  const maxSubmissions = Math.max(...monthlyData.map(d => d.submissions), 1)

  return (
    <>
      <DashboardHeader
        title="Analytics Dashboard"
        subtitle="Real-time performance metrics and insights"
      />

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {stats.map((stat, index) => (
          <HolographicPanel key={stat.label}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
                <div className={`flex items-center gap-1 ${stat.trend === "up" ? "text-primary" : "text-destructive"}`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span className="text-xs">{stat.change}</span>
                </div>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Participants Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <HolographicPanel>
            <div className="p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Monthly Participants
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/80" />
                  <span className="text-xs text-muted-foreground">Participants</span>
                </div>
              </h3>
              {monthlyData.length > 0 ? (
                <div className="flex items-end gap-2 h-64">
                  {monthlyData.map((item, index) => {
                    const height = Math.max((item.participants / maxParticipants) * 100, 10)
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.7, ease: "easeOut" }}
                          className="w-full bg-gradient-to-t from-primary/30 to-primary/60 rounded-t-lg relative overflow-hidden group cursor-pointer"
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.participants} participants
                          </div>
                          {/* Shimmer */}
                          <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                          />
                        </motion.div>
                        <span className="text-xs text-muted-foreground">{item.month}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No data available</p>
                </div>
              )}
            </div>
          </HolographicPanel>
        </motion.div>

        {/* Monthly Submissions Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HolographicPanel>
            <div className="p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-chart-2" />
                Monthly Submissions
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-2/80" />
                  <span className="text-xs text-muted-foreground">Submissions</span>
                </div>
              </h3>
              {monthlyData.length > 0 ? (
                <div className="flex items-end gap-2 h-64">
                  {monthlyData.map((item, index) => {
                    const height = Math.max((item.submissions / maxSubmissions) * 100, 10)
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.7, ease: "easeOut" }}
                          className="w-full bg-gradient-to-t from-chart-2/30 to-chart-2/60 rounded-t-lg relative overflow-hidden group cursor-pointer"
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.submissions} submissions
                          </div>
                          {/* Shimmer */}
                          <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                          />
                        </motion.div>
                        <span className="text-xs text-muted-foreground">{item.month}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No data available</p>
                </div>
              )}
            </div>
          </HolographicPanel>
        </motion.div>
      </div>

      {/* Activity Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <HolographicPanel>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Activity Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Peak Activity", value: "2:00 PM", icon: Zap },
                { label: "Most Active Day", value: "Saturday", icon: Calendar },
                { label: "Avg. Response Time", value: "12 mins", icon: Activity },
              ].map((item, index) => (
                <div key={item.label} className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <item.icon className="w-4 h-4 text-primary mb-2" />
                  <div className="text-lg font-bold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </HolographicPanel>
      </motion.div>
    </>
  )
}
