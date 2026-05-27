"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  MessageSquare,
  Star,
  Clock,
  Video,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const assignedTeams = [
  {
    id: 1,
    name: "CodeCrafters",
    project: "AI Code Assistant",
    members: 4,
    progress: 75,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Web3 Wizards",
    project: "DeFi Dashboard",
    members: 3,
    progress: 60,
    lastActive: "30 minutes ago",
  },
  {
    id: 3,
    name: "DataMinds",
    project: "Analytics Platform",
    members: 5,
    progress: 45,
    lastActive: "1 hour ago",
  },
]

const upcomingSessions = [
  { id: 1, team: "CodeCrafters", time: "Today, 3:00 PM", type: "Code Review" },
  { id: 2, team: "Web3 Wizards", time: "Tomorrow, 10:00 AM", type: "Architecture" },
  { id: 3, team: "DataMinds", time: "Dec 16, 2:00 PM", type: "Demo Prep" },
]

const recentMessages = [
  { id: 1, from: "Sarah Chen", message: "Thanks for the feedback!", time: "5 min ago" },
  { id: 2, from: "Mike Johnson", message: "Can we schedule a call?", time: "1 hour ago" },
  { id: 3, from: "Elena Rodriguez", message: "Updated the design docs", time: "3 hours ago" },
]

export default function MentorDashboard() {
  return (
    <>
      <DashboardHeader
        title="Mentor Dashboard"
        subtitle="Guide teams and track their progress"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Users, label: "Teams Assigned", value: "3", color: "text-purple-400" },
            { icon: Calendar, label: "Sessions This Week", value: "8", color: "text-chart-2" },
            { icon: Star, label: "Mentor Rating", value: "4.9", color: "text-chart-4" },
            { icon: TrendingUp, label: "Impact Score", value: "847", color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Assigned Teams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Assigned Teams
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/mentor/teams">View All</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {assignedTeams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-purple-400/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{team.name}</h4>
                    <p className="text-sm text-muted-foreground">{team.project}</p>
                  </div>
                  <Badge variant="secondary">{team.members} members</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs text-purple-400">{team.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${team.progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-purple-400 rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{team.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-chart-2" />
              Upcoming Sessions
            </h3>
          </div>

          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{session.team}</span>
                  <Badge variant="outline" className="text-xs">{session.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {session.time}
                  </div>
                  <Button size="sm" variant="ghost" className="h-7">
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4" variant="outline">
            Schedule Session
          </Button>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Recent Messages
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/mentor/messages">View All</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="text-primary text-sm font-semibold">
                    {msg.from.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{msg.from}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Video className="w-4 h-4 mr-2" />
              Start Instant Call
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Session
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Feedback
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              View All Teams
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
