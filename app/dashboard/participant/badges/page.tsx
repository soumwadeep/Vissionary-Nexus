"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Lock, Sparkles, Trophy, Zap, Code, Users, Calendar, Star, Target, Flame, Shield, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { analyticsEvents } from "@/lib/analytics"

const earnedBadges = [
  {
    id: 1,
    name: "First Hackathon",
    description: "Completed your first hackathon",
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    earnedDate: "Nov 12, 2024",
    rarity: "common",
  },
  {
    id: 2,
    name: "Team Player",
    description: "Joined 3 different teams",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    earnedDate: "Nov 15, 2024",
    rarity: "common",
  },
  {
    id: 3,
    name: "Code Warrior",
    description: "Submitted 5 projects",
    icon: Code,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    earnedDate: "Dec 1, 2024",
    rarity: "uncommon",
  },
  {
    id: 4,
    name: "Rising Star",
    description: "Reached top 10 in leaderboard",
    icon: Star,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    earnedDate: "Dec 5, 2024",
    rarity: "rare",
  },
  {
    id: 5,
    name: "Streak Master",
    description: "Maintained 7-day activity streak",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    earnedDate: "Dec 10, 2024",
    rarity: "uncommon",
  },
  {
    id: 6,
    name: "AI Pioneer",
    description: "Used AI mentor 10 times",
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    earnedDate: "Dec 12, 2024",
    rarity: "rare",
  },
]

const lockedBadges = [
  {
    id: 7,
    name: "Hackathon Master",
    description: "Complete 10 hackathons",
    icon: Shield,
    progress: 40,
    requirement: "4/10 hackathons",
    rarity: "epic",
  },
  {
    id: 8,
    name: "Grand Champion",
    description: "Win first place in a hackathon",
    icon: Trophy,
    progress: 0,
    requirement: "0/1 wins",
    rarity: "legendary",
  },
  {
    id: 9,
    name: "Perfect Score",
    description: "Get 100% on a submission",
    icon: Target,
    progress: 92,
    requirement: "Best: 92%",
    rarity: "epic",
  },
  {
    id: 10,
    name: "Month Streak",
    description: "Maintain 30-day activity streak",
    icon: Zap,
    progress: 40,
    requirement: "12/30 days",
    rarity: "rare",
  },
]

const rarityColors = {
  common: "text-gray-400",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-yellow-500",
}

const rarityBgColors = {
  common: "bg-gray-500/10",
  uncommon: "bg-green-500/10",
  rare: "bg-blue-500/10",
  epic: "bg-purple-500/10",
  legendary: "bg-yellow-500/10",
}

const rarityBorderColors = {
  common: "border-gray-500/30",
  uncommon: "border-green-500/30",
  rare: "border-blue-500/30",
  epic: "border-purple-500/30",
  legendary: "border-yellow-500/30",
}

const rarityIconColors = {
  common: "text-gray-400",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-yellow-500",
}

export default function BadgesPage() {
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<number[]>([])
  const [allEarnedBadges, setAllEarnedBadges] = useState([...earnedBadges])

  const handleUnlockBadge = (badge: typeof lockedBadges[0]) => {
    // Track analytics event
    analyticsEvents.nftUnlocked(badge.name, badge.rarity)
    
    // Add to unlocked badges
    setUnlockedBadgeIds(prev => [...prev, badge.id])
    
    // Add to earned badges
    const newEarnedBadge = {
      ...badge,
      earnedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      bgColor: rarityBgColors[badge.rarity as keyof typeof rarityBgColors],
      borderColor: rarityBorderColors[badge.rarity as keyof typeof rarityBorderColors],
      color: rarityIconColors[badge.rarity as keyof typeof rarityIconColors],
    }
    setAllEarnedBadges(prev => [...prev, newEarnedBadge])
  }

  return (
    <>
      <DashboardHeader
        title="NFT Badges"
        subtitle="Collect achievements and showcase your accomplishments"
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="glass-card p-4 text-center">
          <Award className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{allEarnedBadges.length}</p>
          <p className="text-sm text-muted-foreground">Badges Earned</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-2xl font-bold">{lockedBadges.length - unlockedBadgeIds.length}</p>
          <p className="text-sm text-muted-foreground">Badges Locked</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Star className="w-8 h-8 text-chart-4 mx-auto mb-2" />
          <p className="text-2xl font-bold">{allEarnedBadges.filter(b => b.rarity === "rare" || b.rarity === "epic" || b.rarity === "legendary").length}</p>
          <p className="text-sm text-muted-foreground">Rare Badges</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Sparkles className="w-8 h-8 text-chart-2 mx-auto mb-2" />
          <p className="text-2xl font-bold">{Math.round((allEarnedBadges.length / (earnedBadges.length + lockedBadges.length)) * 100)}%</p>
          <p className="text-sm text-muted-foreground">Collection</p>
        </div>
      </motion.div>

      {/* Earned Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Earned Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allEarnedBadges.map((badge, index) => {
            const IconComponent = badge.icon
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={`glass-card p-4 border-2 ${badge.borderColor} cursor-pointer group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${badge.bgColor} ${badge.borderColor} border group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-8 h-8 ${badge.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <Badge variant="outline" className={`text-xs ${rarityColors[badge.rarity as keyof typeof rarityColors]}`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                    {badge.earnedDate && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Earned: {badge.earnedDate}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Locked Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-muted-foreground" />
          Locked Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedBadges.filter(b => !unlockedBadgeIds.includes(b.id)).map((badge, index) => {
            const IconComponent = badge.icon
            const canClaim = badge.progress >= 100
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`glass-card p-4 ${!canClaim ? "opacity-60" : ""} hover:opacity-80 transition-opacity`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary border border-border">
                    <IconComponent className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <Badge variant="outline" className={`text-xs ${rarityColors[badge.rarity as keyof typeof rarityColors]}`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{badge.requirement}</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress} className="h-1.5" />
                      {canClaim && (
                        <Button 
                          className="w-full gap-2 mt-2 glow-border"
                          onClick={() => handleUnlockBadge(badge)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Claim Badge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}
