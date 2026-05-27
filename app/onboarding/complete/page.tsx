'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FloatingParticles } from '@/components/effects/floating-particles';
import { HolographicCard } from '@/components/effects/holographic-card';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { CheckCircle } from 'lucide-react';

export default function CompleteOnboardingPage() {
  const router = useRouter();
  const { profile, completeOnboarding } = useWalletAuth();

  useEffect(() => {
    // Mark onboarding as complete in database
    completeOnboarding();

    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, completeOnboarding]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      <FloatingParticles count={25} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl text-center">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2 }}
              >
                <CheckCircle className="w-24 h-24 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <HolographicCard>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome to Nexus!
              </h1>

              <p className="text-slate-300 text-lg">
                Your onboarding is complete. Your profile has been successfully initialized on the Somnia network.
              </p>

              {/* Profile summary */}
              <div className="bg-black/40 rounded-lg p-6 border border-primary/20 space-y-3 text-left">
                <div>
                  <p className="text-xs text-primary/50 mb-1">Wallet Address</p>
                  <p className="font-mono text-sm text-primary break-all">
                    {profile?.address}
                  </p>
                </div>
                {profile?.role && (
                  <div>
                    <p className="text-xs text-primary/50 mb-1">Role</p>
                    <p className="text-white capitalize">{profile.role}</p>
                  </div>
                )}
                {profile?.interests && profile.interests.length > 0 && (
                  <div>
                    <p className="text-xs text-primary/50 mb-1">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                        >
                          {interest}
                        </span>
                      ))}
                      {profile.interests.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{profile.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-400">
                Redirecting to dashboard...
              </p>
            </motion.div>
          </HolographicCard>
        </div>
      </div>
    </div>
  );
}
