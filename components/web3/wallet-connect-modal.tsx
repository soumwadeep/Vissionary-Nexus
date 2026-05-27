"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi"
import { X, Wallet, CheckCircle2, AlertCircle, Loader2, ExternalLink, Zap, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { networkMeta, somniaTestnet } from "@/lib/web3-config"
import { WalletProfile } from "@/hooks/use-wallet-auth"
import { NetworkSwitchModal } from "./network-switch-modal"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  userProfile?: WalletProfile | null
}

export function WalletConnectModal({ isOpen, onClose, userProfile }: WalletConnectModalProps) {
  const { connect, connectors, isPending, error } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, chains } = useSwitchChain()
  const router = useRouter()
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState('somnia')
  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)
    }
  }, [isOpen])

  const handleConnectWallet = (connector: any) => {
    connect({ connector })
    // After connection, redirect to onboarding if not completed
    setTimeout(() => {
      if (isConnected && !userProfile?.onboardingComplete) {
        router.push('/onboarding/welcome')
        onClose()
      }
    }, 1000)
  }

  const handleNetworkSwitch = (network: string) => {
    setSelectedNetwork(network)
    setIsNetworkModalOpen(false)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkColor = (id: number) => {
    return networkMeta[id as keyof typeof networkMeta]?.color || "#22c55e"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 rounded-2xl blur-xl opacity-50 animate-pulse" />

            {/* Content */}
            <div className="relative glass-card p-6 rounded-2xl border border-primary/30 overflow-hidden">
              {/* Floating particles */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-primary/50 rounded-full"
                  initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
                  animate={{
                    y: [`${particle.y}%`, `${particle.y - 30}%`],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: particle.delay,
                    repeat: Infinity,
                  }}
                />
              ))}

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {isConnected ? "Wallet Connected" : "Connect Wallet"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {isConnected ? "Manage your connection" : "Choose your preferred wallet"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {isConnected ? (
                <div className="space-y-4">
                  {/* Connected wallet card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-4 rounded-xl bg-primary/5 border border-primary/20"
                  >
                    <div className="absolute top-2 right-2">
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Address</p>
                        <p className="font-mono font-semibold text-primary">{formatAddress(address!)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getNetworkColor(chainId) }}
                      />
                      <span className="text-sm text-slate-400">
                        {chains.find((c) => c.id === chainId)?.name || "Unknown Network"}
                      </span>
                    </div>
                  </motion.div>

                  {/* User profile info if available */}
                  {userProfile?.onboardingComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-xl bg-secondary/10 border border-secondary/20"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Profile</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {userProfile.role && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Role:</span>
                            <span className="text-white capitalize">{userProfile.role}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-primary">Premium Member</span>
                        </div>
                        {userProfile.reputation > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Reputation:</span>
                            <span className="text-accent">{userProfile.reputation} points</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Network switcher button */}
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-primary/30 hover:border-primary/50 justify-start"
                    onClick={() => setIsNetworkModalOpen(true)}
                  >
                    <Zap className="w-4 h-4" />
                    Switch Network
                  </Button>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 gap-2" asChild>
                      <a
                        href={`https://etherscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Explorer
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Wallet options */}
                  {connectors.map((connector, index) => (
                    <motion.div
                      key={connector.uid}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between h-14 px-4 hover:border-primary/50 hover:bg-primary/5 transition-all group border-slate-700 bg-slate-800/50"
                        onClick={() => handleConnectWallet(connector)}
                        disabled={isPending}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                            <Wallet className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{connector.name}</span>
                        </div>
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <motion.div
                            className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-primary text-xs">-&gt;</span>
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  ))}

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error.message}
                    </motion.div>
                  )}

                  {/* Somnia promotion */}
                  <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-primary">Somnia Ready</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Connect your wallet to access the Somnia ecosystem and earn blockchain-verified achievements.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <NetworkSwitchModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
        currentNetwork={selectedNetwork}
        onNetworkSwitch={handleNetworkSwitch}
      />
    </AnimatePresence>
  )
}
