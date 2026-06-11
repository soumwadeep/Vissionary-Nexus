'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HolographicPanel } from '@/components/ecosystem/micro-interactions';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { useEffect } from 'react';

export function ClientWelcome() {
  const router = useRouter();
  const { isAuthenticated, status } = useAuth();
  const { profile } = useWalletAuth();

  useEffect(() => {
    if (status === 'loading') return;

    if (isAuthenticated && profile?.onboardingComplete) {
      router.push('/dashboard/participant');
    }
  }, [isAuthenticated, status, profile, router]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/onboarding/role-select');
    } else {
      router.push('/auth/login?callbackUrl=/onboarding/role-select');
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-12 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              <span className="text-primary glow-text">VISIONARY</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground">Nexus Ecosystem</p>
          <p className="text-sm md:text-lg text-muted-foreground max-w-sm mx-auto">
            Experience the next generation of AI-powered innovation platform
          </p>
        </div>

        {/* Main Card */}
        <HolographicPanel>
          <div className="space-y-4 p-5 md:p-6">
            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Brain className="w-5 h-5 md:w-6 md:h-6" />, title: 'AI Ecosystem', desc: 'Neural powered' },
                { icon: <Users className="w-5 h-5 md:w-6 md:h-6" />, title: 'Collaborate', desc: 'Connect & build' },
                { icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />, title: 'Fast & Efficient', desc: 'Optimized' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center p-3 md:p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="text-primary mb-2 flex justify-center">{feature.icon}</div>
                  <h3 className="text-sm md:text-base font-semibold mb-1">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 md:pt-5 border-t border-border">
              <p className="text-xs md:text-sm text-muted-foreground mb-3 text-center">
                Start your journey
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGetStarted}
                  className="w-full glow-border h-11 md:h-12 text-base md:text-lg font-semibold"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </HolographicPanel>

        {/* Footer text */}
        <div className="flex-1 flex flex-col justify-end">
          <p className="text-center text-xs text-muted-foreground">
            Secure • Intelligent • Collaborative
          </p>
        </div>
      </motion.div>
    </div>
  );
}
