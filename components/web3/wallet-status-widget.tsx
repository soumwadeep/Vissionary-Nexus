"use client"

import { motion } from "framer-motion"
import { useAccount, useChainId, useBalance, useSwitchChain } from "wagmi"
import { Wallet, Link2, Zap, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { WalletConnectModal } from "./wallet-connect-modal"
import { networkMeta, somniaTestnet } from "@/lib/web3-config"
import { formatUnits } from "viem"

export function WalletStatusWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const { data: balance, refetch, isRefetching } = useBalance({ address })
  const { switchChain } = useSwitchChain()
  const [isSwitching, setIsSwitching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getNetworkInfo = () => {
    const meta = networkMeta[chainId as keyof typeof networkMeta]
    return {
      color: meta?.color || "#22c55e",
      icon: meta?.icon || "ETH",
    }
  }

  const networkInfo = getNetworkInfo()
  const isSomniaNetwork = chainId === somniaTestnet.id

  const handleSwitchToSomnia = async () => {
    setIsSwitching(true)
    setError(null)
    try {
      await switchChain({ chainId: somniaTestnet.id })
    } catch (err: any) {
      if (err.code === 4902 || err.message?.includes('chain not recognized') || err.message?.includes('not found')) {
        try {
          await (window as any).ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${somniaTestnet.id.toString(16)}`,
                chainName: somniaTestnet.name,
                nativeCurrency: somniaTestnet.nativeCurrency,
                rpcUrls: somniaTestnet.rpcUrls.default.http,
                blockExplorerUrls: [somniaTestnet.blockExplorers.default.url],
              },
            ],
          })
          await switchChain({ chainId: somniaTestnet.id })
        } catch (addErr: any) {
          setError(addErr.message || 'Failed to add network')
        }
      } else {
        setError(err.message || 'Failed to switch network')
      }
    } finally {
      setIsSwitching(false)
    }
  }

  if (!isConnected) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass-card p-4 rounded-xl border border-border/50 min-w-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm">Wallet Status</p>
                <p className="text-xs text-muted-foreground">Not connected</p>
              </div>
            </div>
            <Button size="sm" className="relative z-20 shrink-0" onClick={() => setIsModalOpen(true)}>
              Connect
            </Button>
          </div>
        </motion.div>
        <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 min-w-0"
      >
        {/* Glow for Somnia network */}
        {isSomniaNetwork && (
          <motion.div
            className="absolute -inset-0.5 rounded-xl bg-primary/20 blur-md -z-10"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

      <div className="glass-card p-4 rounded-xl border border-primary/20">
        {/* Connection status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-primary">Connected</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-3 h-3 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Address and balance */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: `${networkInfo.color}20`, color: networkInfo.color }}
          >
            {networkInfo.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm truncate">
              {address?.slice(0, 8)}...{address?.slice(-6)}
            </p>
            <p className="text-xs text-muted-foreground">
              {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : "Loading..."}
            </p>
          </div>
        </div>

        {/* Network indicator */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/50">
          <Link2 className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground flex-1">
            {isSomniaNetwork ? "Somnia Shannon Testnet" : "Ethereum"}
          </span>
          {isSomniaNetwork && (
            <div className="flex items-center gap-1 text-primary">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-medium">Active</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-2 mt-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex gap-2 mt-3">
          {!isSomniaNetwork && (
            <Button
              className="flex-1 text-xs gap-2"
              onClick={handleSwitchToSomnia}
              disabled={isSwitching}
            >
              {isSwitching ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Zap className="w-3 h-3" />
              )}
              Switch to Somnia Shannon Testnet
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className={isSomniaNetwork ? "flex-1 text-xs" : "text-xs"}
            onClick={() => setIsModalOpen(true)}
          >
            Manage
          </Button>
        </div>
      </div>

      </motion.div>

      <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
