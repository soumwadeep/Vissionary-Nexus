'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Cpu, Network, Database, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadingPhases = [
    { icon: Cpu, text: 'Loading Dashboard Systems...' },
    { icon: Database, text: 'Fetching Your Data...' },
    { icon: Network, text: 'Initializing Connections...' },
    { icon: Zap, text: 'Preparing Your Workspace...' },
  ];

  // Mount check for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle redirect logic
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Give animation time before redirecting
    const redirectTimeout = setTimeout(() => {
      const role = user?.role || 'participant';
      switch (role) {
        case 'host':
          router.push('/dashboard/host');
          break;
        case 'judge':
          router.push('/dashboard/judge');
          break;
        case 'mentor':
          router.push('/dashboard/mentor');
          break;
        case 'member':
        case 'participant':
        default:
          router.push('/dashboard/participant');
          break;
      }
    }, 4000); // Total animation duration

    return () => clearTimeout(redirectTimeout);
  }, [isLoading, isAuthenticated, user?.role, router]);

  // Handle boot sequence animation
  useEffect(() => {
    if (!mounted) return;

    if (phase >= loadingPhases.length) {
      setIsComplete(true);
      return;
    }

    const phaseTimeout = setTimeout(() => {
      setPhase((p) => p + 1);
      setProgress(0);
    }, 1000);

    return () => clearTimeout(phaseTimeout);
  }, [phase, mounted, loadingPhases.length]);

  // Handle progress bar animation
  useEffect(() => {
    if (!mounted || isComplete) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 40;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [mounted, isComplete]);

  if (!mounted || isComplete) {
    return null;
  }

  const currentStep = loadingPhases[phase] || loadingPhases[0];
  const Icon = currentStep.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-8"
    >
      {/* Animated logo */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full border-2 border-primary/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-primary/40 border-dashed"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/apple-icon.png"
            alt="Vissionary Nexus"
            className="w-12 h-12"
          />
        </motion.div>
      </div>

      {/* Title and subtitle */}
      <div className="text-center">
        <motion.h2
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-primary glow-text"
        >
          Loading Dashboard
        </motion.h2>
        <motion.p
          key={`text-${phase}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground mt-2"
        >
          {currentStep.text}
        </motion.p>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Phase {phase + 1}/{loadingPhases.length}</span>
          <span>{Math.min(Math.round(progress), 100)}%</span>
        </div>
      </div>

      {/* Boot log */}
      <div className="font-mono text-xs text-muted-foreground/50 max-w-sm text-center">
        {loadingPhases.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i < phase ? 0.5 : i === phase ? 1 : 0 }}
            className="flex items-center gap-2 justify-center h-5"
          >
            <span className={i < phase ? 'text-primary' : i === phase ? 'text-primary' : 'text-muted-foreground'}>
              {i < phase ? '✓' : '○'}
            </span>
            <span>{step.text.replace('...', '')}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
