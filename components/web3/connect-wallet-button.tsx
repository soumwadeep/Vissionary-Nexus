"use client"

import { motion } from "framer-motion"
import { useAccount, useChainId } from "wagmi"
import { Wallet, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WalletConnectModal } from "./wallet-connect-modal"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { networkMeta } from "@/lib/web3-config"

export function ConnectWalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const router = useRouter()
  const { profile, connectWallet } = useWalletAuth()

  // Auto-connect wallet when wagmi detects connection
  useEffect(() => {
    if (isConnected && address && !profile?.address) {
      connectWallet(address)
    }
  }, [isConnected, address, profile?.address, connectWallet])

  const handleConnect = () => {
    // If already onboarded, open modal to manage wallet
    if (profile?.onboardingComplete) {
      setIsModalOpen(true)
    } else {
      // Otherwise, go to onboarding flow
      setIsModalOpen(true)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  const getNetworkColor = () => {
    return networkMeta[chainId as keyof typeof networkMeta]?.color || "#22c55e"
  }

  return (
    <>
      {isConnected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <Button
            variant="outline"
            className="gap-2 border-primary/30 hover:border-primary/50 bg-primary/5"
            onClick={handleConnect}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: getNetworkColor() }}
              />
              <span className="font-mono text-sm">{formatAddress(address!)}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </Button>
          {/* Glow indicator */}
          <motion.div
            className="absolute -inset-0.5 rounded-lg bg-primary/20 blur-sm -z-10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      ) : (
        <Button
          onClick={handleConnect}
          className="gap-2 glow-border"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}

      <WalletConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        userProfile={profile}
      />
    </>
  )
}
