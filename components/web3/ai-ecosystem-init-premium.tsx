'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TerminalText } from '@/components/effects/terminal-text';
import { HolographicPanel } from '@/components/ecosystem/micro-interactions';
import { ParticleField } from '@/components/ecosystem/particle-field';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIEcosystemInitProps {
  onComplete: () => void;
  address: string;
}

export function AIEcosystemInit({ onComplete, address }: AIEcosystemInitProps) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const stages = [
    { text: '> INITIALIZING NEXUS CORE...', duration: 1.5 },
    { text: '> LOADING AI ECOSYSTEM...', duration: 1.5 },
    { text: '> CONNECTING TO NETWORK...', duration: 1.5 },
    { text: '> ESTABLISHING SECURE CONNECTION...', duration: 1.5 },
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
    router.push('/dashboard/participant');
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ParticleField />

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-12 pb-8">
        {/* Main container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <HolographicPanel>
            <div className="p-5 md:p-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Nexus Initialization</h1>
                <p className="text-muted-foreground text-xs md:text-sm">Connecting to the network...</p>
              </motion.div>

              {/* Terminal output */}
              <div className="space-y-2 mb-6 font-mono text-xs md:text-sm">
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
                      <TerminalText text={s.text} delay={0} speed={0.04} />
                    ) : null}
                  </motion.div>
                ))}
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-3 mb-6">
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
                <span className="text-muted-foreground text-xs md:text-sm">
                  {Math.round((stage / stages.length) * 100)}% Complete
                </span>
              </div>

              {/* Address display */}
              <div className="bg-card/50 rounded-lg p-3 mb-6 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Connected Address</p>
                <p className="text-primary font-mono text-xs break-all">{address}</p>
              </div>

              {/* Complete button */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleComplete}
                      className="w-full h-11 md:h-12 font-semibold glow-border"
                    >
                      Enter Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </HolographicPanel>
        </motion.div>
      </div>
    </div>
  );
}
