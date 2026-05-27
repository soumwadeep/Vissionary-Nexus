"use client"

import { motion } from "framer-motion"
import { useAccount, useChainId } from "wagmi"
import { Radio, Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { somniaTestnet } from "@/lib/web3-config"
import { useState, useEffect } from "react"

type SyncStatus = "disconnected" | "connecting" | "syncing" | "synced" | "error"

export function SomniaSyncIndicator() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [status, setStatus] = useState<SyncStatus>("disconnected")
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const isSomniaNetwork = chainId === somniaTestnet.id

  useEffect(() => {
    if (!isConnected) {
      setStatus("disconnected")
      return
    }

    if (!isSomniaNetwork) {
      setStatus("disconnected")
      return
    }

    // Simulate sync process
    setStatus("connecting")
    const connectTimeout = setTimeout(() => {
      setStatus("syncing")
      const syncTimeout = setTimeout(() => {
        setStatus("synced")
        setLastSync(new Date())
      }, 1500)
      return () => clearTimeout(syncTimeout)
    }, 1000)

    return () => clearTimeout(connectTimeout)
  }, [isConnected, isSomniaNetwork])

  const statusConfig = {
    disconnected: {
      icon: <Radio className="w-4 h-4" />,
      text: "Not Connected",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    connecting: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: "Connecting...",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    syncing: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      text: "Syncing...",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    synced: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      text: "Synced",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      text: "Sync Error",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  }

  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-xl border border-border/50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Somnia Ecosystem</p>
            <p className="text-xs text-muted-foreground">Sync Status</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgColor}`}>
          <span className={config.color}>{config.icon}</span>
          <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
        </div>
      </div>

      {/* Sync visualization */}
      <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-3">
        {status === "syncing" && (
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary/50"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          />
        )}
        {status === "synced" && <div className="absolute inset-0 bg-primary" />}
        {(status === "connecting" || status === "syncing") && (
          <motion.div
            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-background/50">
          <p className="text-muted-foreground">Network</p>
          <p className="font-medium">{isSomniaNetwork ? "Somnia Testnet" : "Not Somnia"}</p>
        </div>
        <div className="p-2 rounded-lg bg-background/50">
          <p className="text-muted-foreground">Last Sync</p>
          <p className="font-medium">
            {lastSync ? lastSync.toLocaleTimeString() : "Never"}
          </p>
        </div>
      </div>

      {!isSomniaNetwork && isConnected && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Switch to Somnia Testnet to sync
        </p>
      )}
    </motion.div>
  )
}
