'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TerminalTextProps {
  text: string;
  delay?: number;
  speed?: number;
}

export function TerminalText({ text, delay = 0, speed = 0.05 }: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed * 1000);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <motion.div
      className="font-mono text-sm text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delay }}
    >
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-1"
        >
          ▍
        </motion.span>
      )}
    </motion.div>
  );
}
