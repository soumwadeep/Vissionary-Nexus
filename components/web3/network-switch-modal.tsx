'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';

interface NetworkSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNetwork?: string;
  onNetworkSwitch: (network: string) => void;
}

const networks = [
  {
    id: 'somnia',
    name: 'Somnia Network',
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
  {
    id: 'base',
    name: 'Base',
    description: 'Optimized for speed',
    icon: '◆',
  },
];

export function NetworkSwitchModal({
  isOpen,
  onClose,
  currentNetwork = 'somnia',
  onNetworkSwitch,
}: NetworkSwitchModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(currentNetwork);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSwitch = async (networkId: string) => {
    setIsVerifying(true);
    setSelectedNetwork(networkId);
    
    // Simulate network verification
    setTimeout(() => {
      onNetworkSwitch(networkId);
      setIsVerifying(false);
      onClose();
    }, 1500);
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
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

              {/* Network list */}
              <div className="space-y-3 mb-6">
                {networks.map((network, index) => (
                  <motion.button
                    key={network.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    onClick={() => handleSwitch(network.id)}
                    disabled={isVerifying}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedNetwork === network.id
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-primary/50'
                    } ${isVerifying && selectedNetwork !== network.id ? 'opacity-50' : ''}`}
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
                          {isVerifying ? (
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
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSwitch(selectedNetwork)}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Confirm'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
