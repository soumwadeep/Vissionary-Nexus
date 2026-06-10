'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Zap, AlertCircle } from 'lucide-react';
import { useSwitchChain, useChainId } from 'wagmi';
import { somniaTestnet } from '@/lib/web3-config';
import { mainnet } from 'wagmi/chains';
import type { Chain } from 'wagmi/chains';

interface NetworkSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNetwork?: string;
  onNetworkSwitch?: (network: string) => void;
}

const networkMap: Record<string, Chain> = {
  somnia: somniaTestnet as unknown as Chain,
  ethereum: mainnet,
};

export function NetworkSwitchModal({
  isOpen,
  onClose,
  currentNetwork = 'somnia',
  onNetworkSwitch,
}: NetworkSwitchModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(currentNetwork);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { switchChain } = useSwitchChain();

  const handleSwitch = async (networkId: string) => {
    setIsSwitching(true);
    setError(null);
    setSelectedNetwork(networkId);

    try {
      const targetChain = networkMap[networkId];
      if (!targetChain) throw new Error('Unknown network');

      await switchChain({ chainId: targetChain.id });

      if (onNetworkSwitch) {
        onNetworkSwitch(networkId);
      }

      onClose();
    } catch (err: any) {
      // Handle error where chain isn't added to MetaMask
      if (err.code === 4902 || err.message?.includes('chain not recognized') || err.message?.includes('not found')) {
        try {
          const targetChain = networkMap[networkId];
          await (window as any).ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChain.id.toString(16)}`,
                chainName: targetChain.name,
                nativeCurrency: targetChain.nativeCurrency,
                rpcUrls: targetChain.rpcUrls.default.http,
                blockExplorerUrls: [targetChain.blockExplorers?.default?.url || ""],
              },
            ],
          });
          // After adding, try switching again
          await switchChain({ chainId: targetChain.id });
          if (onNetworkSwitch) {
            onNetworkSwitch(networkId);
          }
          onClose();
        } catch (addErr: any) {
          setError(addErr.message || 'Failed to add network');
        }
      } else {
        setError(err.message || 'Failed to switch network');
      }
    } finally {
      setIsSwitching(false);
    }
  };

  const networks = [
    {
      id: 'somnia',
      name: 'Somnia Shannon Testnet',
      description: 'AI-optimized L2 solution',
      icon: '🌐',
      badge: 'Recommended',
    },
    {
      id: 'ethereum',
      name: 'Ethereum Mainnet',
      description: 'Mainnet compatibility',
      icon: '⟠',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left/1/2 -translate-x-1/2 -translate-y-1/2 z-[99999]"
          >
            <div className="bg-slate-950 border border-primary/30 rounded-xl p-6 w-96 shadow-2xl">
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-white mb-4 flex items-center gap-2"
              >
                <Zap className="w-5 h-5 text-primary" />
                Switch Network
              </motion.h2>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              {/* Network list */}
              <div className="space-y-3 mb-6">
                {networks.map((network, index) => (
                  <motion.button
                    key={network.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    onClick={() => handleSwitch(network.id)}
                    disabled={isSwitching}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedNetwork === network.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-primary/50'
                    } ${isSwitching && selectedNetwork !== network.id ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{network.icon}</span>
                          <p className="font-semibold text-white">{network.name}</p>
                          {network.badge && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              {network.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{network.description}</p>
                      </div>
                      {selectedNetwork === network.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          {isSwitching ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          ) : (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={isSwitching}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSwitch(selectedNetwork)}
                  className="flex-1"
                  disabled={isSwitching}
                >
                  {isSwitching ? 'Switching...' : 'Confirm'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
