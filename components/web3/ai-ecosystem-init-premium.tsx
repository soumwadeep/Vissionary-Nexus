'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TerminalText } from '@/components/effects/terminal-text';
import { HolographicCard } from '@/components/effects/holographic-card';
import { FloatingParticles } from '@/components/effects/floating-particles';
import { Button } from '@/components/ui/button';

interface AIEcosystemInitProps {
  onComplete: () => void;
  address: string;
}

export function AIEcosystemInit({ onComplete, address }: AIEcosystemInitProps) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const stages = [
    { text: '> INITIALIZING NEXUS CORE...', duration: 2 },
    { text: '> LOADING AI ECOSYSTEM...', duration: 2 },
    { text: '> SYNCHRONIZING WITH SOMNIA NETWORK...', duration: 2 },
    { text: '> ESTABLISHING SECURE CONNECTION...', duration: 2 },
    { text: '> INITIALIZATION COMPLETE', duration: 1 },
  ];

  useEffect(() => {
    if (stage < stages.length) {
      const timer = setTimeout(() => {
        setStage(stage + 1);
      }, stages[stage].duration * 1000);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [stage, stages]);

  const handleComplete = () => {
    onComplete();
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      <FloatingParticles count={15} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <HolographicCard className="group">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                NEXUS INITIALIZATION
              </h1>
              <p className="text-primary/70 text-sm">Connecting to the distributed network...</p>
            </motion.div>

            {/* Terminal output */}
            <div className="space-y-3 mb-8 font-mono text-sm">
              {stages.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={stage > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {stage > i ? (
                    <div className="text-primary">{s.text}</div>
                  ) : stage === i ? (
                    <TerminalText text={s.text} delay={0} speed={0.03} />
                  ) : null}
                </motion.div>
              ))}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
              <span className="text-primary/70 text-sm">
                {Math.round((stage / stages.length) * 100)}% Complete
              </span>
            </div>

            {/* Address display */}
            <div className="bg-black/40 rounded-lg p-3 mb-8 border border-primary/20">
              <p className="text-xs text-primary/50 mb-1">Connected Address</p>
              <p className="text-primary font-mono text-xs break-all">{address}</p>
            </div>

            {/* Complete button */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Button
                  onClick={handleComplete}
                  className="w-full h-12 font-semibold"
                >
                  Enter Dashboard
                </Button>
              </motion.div>
            )}
          </HolographicCard>
        </motion.div>
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
    </div>
  );
}
