"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Crown, Star, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const leaderboardData = [
  {
    rank: 1,
    name: "Sarah Chen",
    avatar: "/.jpg",
    points: 2450,
    change: "up",
    badges: 12,
    submissions: 8,
    streak: 15,
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Alex Johnson",
    avatar: "/placeholder-user.png",
    points: 2320,
    change: "up",
    badges: 10,
    submissions: 7,
    streak: 12,
    isCurrentUser: true,
  },
  {
    rank: 3,
    name: "Mike Williams",
    avatar: "/placeholder-user.png",
    points: 2180,
    change: "down",
    badges: 9,
    submissions: 6,
    streak: 8,
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Emily Davis",
    avatar: "/placeholder-user.png",
    points: 2050,
    change: "same",
    badges: 8,
    submissions: 5,
    streak: 10,
    isCurrentUser: false,
  },
  {
    rank: 5,
    name: "David Lee",
    avatar: "/placeholder-user.png",
    points: 1920,
    change: "up",
    badges: 7,
    submissions: 5,
    streak: 6,
    isCurrentUser: false,
  },
  {
    rank: 6,
    name: "Jessica Brown",
    avatar: "/placeholder-user.png",
    points: 1850,
    change: "down",
    badges: 6,
    submissions: 4,
    streak: 5,
    isCurrentUser: false,
  },
  {
    rank: 7,
    name: "Chris Taylor",
    avatar: "/placeholder-user.png",
    points: 1780,
    change: "up",
    badges: 6,
    submissions: 4,
    streak: 7,
    isCurrentUser: false,
  },
  {
    rank: 8,
    name: "Amanda Wilson",
    avatar: "/placeholder-user.png",
    points: 1650,
    change: "same",
    badges: 5,
    submissions: 3,
    streak: 4,
    isCurrentUser: false,
  },
]

const rankIcons = {
  1: <Crown className="w-5 h-5 text-yellow-500" />,
  2: <Medal className="w-5 h-5 text-gray-400" />,
  3: <Award className="w-5 h-5 text-amber-600" />,
}

const changeIcons = {
  up: <TrendingUp className="w-4 h-4 text-green-500" />,
  down: <TrendingDown className="w-4 h-4 text-red-500" />,
  same: <Minus className="w-4 h-4 text-muted-foreground" />,
}

export default function LeaderboardPage() {
  return (
    <>
      <DashboardHeader
        title="Leaderboard"
        subtitle="See how you rank among fellow innovators"
      />

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="glass-card p-4 text-center">
          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">#2</p>
          <p className="text-sm text-muted-foreground">Your Rank</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Star className="w-8 h-8 text-chart-4 mx-auto mb-2" />
          <p className="text-2xl font-bold">2,320</p>
          <p className="text-sm text-muted-foreground">Total Points</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Award className="w-8 h-8 text-chart-2 mx-auto mb-2" />
          <p className="text-2xl font-bold">10</p>
          <p className="text-sm text-muted-foreground">Badges Earned</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Zap className="w-8 h-8 text-chart-1 mx-auto mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        <Button variant="default" size="sm">All Time</Button>
        <Button variant="outline" size="sm">This Month</Button>
        <Button variant="outline" size="sm">This Week</Button>
        <Button variant="outline" size="sm">By Event</Button>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Participant</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Points</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Badges</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Submissions</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Streak</th>
                <th className="text-center p-4 text-sm font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <motion.tr
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${
                    user.isCurrentUser ? "bg-primary/5 border-primary/20" : ""
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {rankIcons[user.rank as keyof typeof rankIcons] || (
                        <span className="text-lg font-bold text-muted-foreground">{user.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {user.name}
                          {user.isCurrentUser && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-primary">{user.points.toLocaleString()}</span>
                  </td>
                  <td className="p-4 text-center hidden md:table-cell">
                    <span className="text-muted-foreground">{user.badges}</span>
                  </td>
                  <td className="p-4 text-center hidden md:table-cell">
                    <span className="text-muted-foreground">{user.submissions}</span>
                  </td>
                  <td className="p-4 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="w-4 h-4 text-chart-4" />
                      <span className="text-muted-foreground">{user.streak}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {changeIcons[user.change as keyof typeof changeIcons]}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  )
}
