"use client"

import { motion } from "framer-motion"
import { Award, Sparkles, Star, Zap, Users, Rocket, Crown } from "lucide-react"

interface NFTBadge {
  id: string
  name: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  icon: React.ReactNode
  earned: boolean
  earnedDate?: string
}

const rarityColors = {
  common: { border: "#6b7280", glow: "rgba(107, 114, 128, 0.3)", bg: "rgba(107, 114, 128, 0.1)" },
  rare: { border: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)", bg: "rgba(59, 130, 246, 0.1)" },
  epic: { border: "#8b5cf6", glow: "rgba(139, 92, 246, 0.5)", bg: "rgba(139, 92, 246, 0.1)" },
  legendary: { border: "#f59e0b", glow: "rgba(245, 158, 11, 0.6)", bg: "rgba(245, 158, 11, 0.1)" },
}

const nftBadges: NFTBadge[] = [
  {
    id: "hackathon-winner",
    name: "Hackathon Winner",
    description: "Won a hackathon competition",
    rarity: "legendary",
    icon: <Crown className="w-6 h-6" />,
    earned: true,
    earnedDate: "2024-01-15",
  },
  {
    id: "ai-innovator",
    name: "AI Innovator",
    description: "Built an AI-powered project",
    rarity: "epic",
    icon: <Sparkles className="w-6 h-6" />,
    earned: true,
    earnedDate: "2024-02-20",
  },
  {
    id: "collaboration-master",
    name: "Collaboration Master",
    description: "Successfully collaborated on 10+ teams",
    rarity: "rare",
    icon: <Users className="w-6 h-6" />,
    earned: true,
    earnedDate: "2024-03-10",
  },
  {
    id: "ecosystem-pioneer",
    name: "Ecosystem Pioneer",
    description: "Early adopter of the Vissionary Nexus",
    rarity: "epic",
    icon: <Rocket className="w-6 h-6" />,
    earned: false,
  },
  {
    id: "legendary-builder",
    name: "Legendary Builder",
    description: "Created 5+ winning projects",
    rarity: "legendary",
    icon: <Star className="w-6 h-6" />,
    earned: false,
  },
]

function NFTBadgeCard({ badge }: { badge: NFTBadge }) {
  const colors = rarityColors[badge.rarity]

  return (
    <motion.div
      className="relative group min-w-0"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: colors.glow }}
        animate={badge.earned ? { opacity: [0.3, 0.6, 0.3] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Card */}
      <div
        className={`relative p-4 rounded-xl border-2 transition-all duration-300 min-w-0 h-full ${
          badge.earned ? "bg-card/80" : "bg-card/30 opacity-50"
        }`}
        style={{
          borderColor: badge.earned ? colors.border : "rgba(255,255,255,0.1)",
          backgroundColor: badge.earned ? colors.bg : "rgba(0,0,0,0.2)",
        }}
      >
        {/* Rarity tag */}
        <div
          className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
          style={{ backgroundColor: colors.border, color: "#000" }}
        >
          {badge.rarity}
        </div>

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 mx-auto"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            color: colors.border,
          }}
          animate={badge.earned ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {badge.icon}
        </motion.div>

        {/* Info */}
        <h4 className="font-semibold text-sm text-center mb-1 break-words">{badge.name}</h4>
        <p className="text-xs text-muted-foreground text-center mb-2 break-words">{badge.description}</p>

        {/* Status */}
        {badge.earned ? (
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap text-center" style={{ color: colors.border }}>
            <Award className="w-3 h-3" />
            <span>Earned {badge.earnedDate}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground flex-wrap text-center">
            <Zap className="w-3 h-3" />
            <span>Locked</span>
          </div>
        )}

        {/* Shine effect for earned badges */}
        {badge.earned && (
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export function NFTAchievementShowcase() {
  const earnedCount = nftBadges.filter((b) => b.earned).length

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">NFT Achievements</h3>
          <p className="text-sm text-muted-foreground">
            {earnedCount}/{nftBadges.length} badges earned
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">On-Chain Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 min-w-0">
        {nftBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            className="min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NFTBadgeCard badge={badge} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function NFTBadgeMini({ badge }: { badge: NFTBadge }) {
  const colors = rarityColors[badge.rarity]

  return (
    <motion.div
      className="relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.border,
      }}
      whileHover={{ scale: 1.1 }}
      title={badge.name}
    >
      {badge.icon}
      {badge.earned && (
        <motion.div
          className="absolute -inset-0.5 rounded-lg blur-sm -z-10"
          style={{ backgroundColor: colors.glow }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

export { nftBadges, type NFTBadge }
