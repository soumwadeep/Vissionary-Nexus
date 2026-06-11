"use client"

import { motion } from "framer-motion"
import { useAccount, useChainId, useBalance } from "wagmi"
import { Shield, Award, Activity, Wallet, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { nftBadges, NFTBadgeMini } from "./nft-achievements"
import { networkMeta } from "@/lib/web3-config"
import { formatUnits } from "viem"

export function BlockchainProfileCard() {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({ address })
  const [copied, setCopied] = useState(false)

  const earnedBadges = nftBadges.filter((b) => b.earned)
  const reputationScore = 847 // Mock score

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getNetworkColor = () => {
    return networkMeta[chainId as keyof typeof networkMeta]?.color || "#22c55e"
  }

  if (!isConnected) {
    return (
      <div className="glass-card p-6 rounded-xl border border-border/50">
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Link your wallet to access blockchain features and earn NFT achievements
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 blur-lg -z-10"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="glass-card p-6 rounded-xl border border-primary/20 overflow-hidden">
        {/* Chain pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="text-primary">
            <pattern id="chain-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="0.5" />
              <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#chain-pattern)" />
          </svg>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 relative">
          <div className="flex items-center gap-4">
            {/* Avatar with verification badge */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {address?.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                  {copied ? (
                    <Check className="w-3 h-3 text-primary" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getNetworkColor() }}
                />
                <span>Verified on Somnia</span>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" asChild>
            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
            <div className="text-2xl font-bold text-primary">{reputationScore}</div>
            <div className="text-xs text-muted-foreground">Reputation</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
            <div className="text-2xl font-bold">{earnedBadges.length}</div>
            <div className="text-xs text-muted-foreground">NFT Badges</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border/50">
            <div className="text-2xl font-bold">
              {balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(3) : "0"}
            </div>
            <div className="text-xs text-muted-foreground">{balance?.symbol || "ETH"}</div>
          </div>
        </div>

        {/* NFT Badges Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">NFT Collection</span>
            <span className="text-xs text-muted-foreground">{earnedBadges.length} earned</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {earnedBadges.slice(0, 5).map((badge) => (
              <NFTBadgeMini key={badge.id} badge={badge} />
            ))}
            {earnedBadges.length > 5 && (
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{earnedBadges.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* On-chain activity */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm">
            <span className="text-primary font-medium">12</span> on-chain activities this month
          </span>
        </div>
      </div>
    </motion.div>
  )
}
