"use client"

import { motion } from "framer-motion"
import { useAccount } from "wagmi"
import { Shield, Star, TrendingUp, Zap } from "lucide-react"

export function BlockchainReputationMeter() {
  const { isConnected } = useAccount()

  // Mock reputation data
  const reputation = {
    score: 847,
    level: "Gold",
    progress: 72,
    nextLevel: "Platinum",
    pointsNeeded: 153,
  }

  const levelColors = {
    Bronze: "#CD7F32",
    Silver: "#C0C0C0",
    Gold: "#FFD700",
    Platinum: "#E5E4E2",
    Diamond: "#B9F2FF",
  }

  if (!isConnected) {
    return (
      <div className="glass-card p-4 rounded-xl border border-border/50 opacity-50">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Blockchain Reputation</span>
        </div>
        <p className="text-xs text-muted-foreground">Connect wallet to view</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-xl border border-primary/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Blockchain Reputation</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: `${levelColors[reputation.level as keyof typeof levelColors]}20`,
            color: levelColors[reputation.level as keyof typeof levelColors],
          }}
        >
          <Star className="w-3 h-3" />
          {reputation.level}
        </div>
      </div>

      {/* Score display */}
      <div className="text-center mb-4">
        <motion.div
          className="text-4xl font-bold text-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          {reputation.score}
        </motion.div>
        <p className="text-xs text-muted-foreground">Total Reputation Score</p>
      </div>

      {/* Progress to next level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress to {reputation.nextLevel}</span>
          <span className="font-medium">{reputation.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${levelColors[reputation.level as keyof typeof levelColors]}, ${levelColors[reputation.nextLevel as keyof typeof levelColors]})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${reputation.progress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {reputation.pointsNeeded} points until {reputation.nextLevel}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
          <TrendingUp className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs font-medium">+45</p>
            <p className="text-[10px] text-muted-foreground">This week</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
          <Zap className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-xs font-medium">3x</p>
            <p className="text-[10px] text-muted-foreground">Multiplier</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
