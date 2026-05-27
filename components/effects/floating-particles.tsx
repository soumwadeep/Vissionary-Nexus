'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 12, className = '' }: FloatingParticlesProps) {
  const particles = Array.from({ length: count });

  const randomDuration = () => Math.random() * 3 + 4;
  const randomDelay = () => Math.random() * 2;
  const randomSize = () => Math.random() * 8 + 2;

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-b from-cyan-400/60 to-purple-400/20 blur-sm"
          style={{
            width: randomSize(),
            height: randomSize(),
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -200 - 100],
            opacity: [0, 1, 0],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: randomDuration(),
            delay: randomDelay(),
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
