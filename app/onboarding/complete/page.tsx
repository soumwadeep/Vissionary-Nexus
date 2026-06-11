'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ParticleField } from '@/components/ecosystem/particle-field';
import { HolographicPanel } from '@/components/ecosystem/micro-interactions';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { useAuth } from '@/hooks/use-auth';
import { useAccount, useChainId, useChains } from 'wagmi';
import { CheckCircle } from 'lucide-react';

export default function CompleteOnboardingPage() {
  const router = useRouter();
  const { profile, completeOnboarding } = useWalletAuth();
  const { isAuthenticated, status } = useAuth();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const chains = useChains();

  useEffect(() => {
    if (status === 'loading') return;

    if (!isAuthenticated) {
      router.push('/auth/login?callbackUrl=/onboarding/complete');
    } else {
      // Mark onboarding as complete in database
      completeOnboarding();

      const timer = setTimeout(() => {
        router.push('/dashboard/participant');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, status, router, completeOnboarding]);

  const networkName = chains.find((chain) => chain.id === chainId)?.name || 'Unknown Network';

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <ParticleField />

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-12 pb-8">
        <div className="w-full max-w-lg text-center">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2 }}
              >
                <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <HolographicPanel>
            <div className="p-5 md:p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-5"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Welcome to <span className="text-primary glow-text">Nexus!</span>
                </h1>

                <p className="text-sm md:text-base text-muted-foreground">
                  Onboarding complete! Your profile is ready.
                </p>

                {/* Profile summary */}
                <div className="bg-card/50 rounded-lg p-4 border border-border space-y-3 text-left">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
                    {isConnected && address ? (
                      <p className="font-mono text-xs md:text-sm text-primary break-all">{address}</p>
                    ) : (
                      <p className="text-sm md:text-base text-muted-foreground">Wallet not connected</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Network</p>
                    {isConnected ? (
                      <p className="text-sm md:text-base text-white">{networkName}</p>
                    ) : (
                      <p className="text-sm md:text-base text-muted-foreground">Wallet not connected</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Chain ID</p>
                    {isConnected ? (
                      <p className="font-mono text-xs md:text-sm text-primary">{chainId}</p>
                    ) : (
                      <p className="text-sm md:text-base text-muted-foreground">Wallet not connected</p>
                    )}
                  </div>
                  {profile?.role && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Role</p>
                      <p className="text-sm md:text-base text-white capitalize">{profile.role}</p>
                    </div>
                  )}
                  {profile?.interests && profile.interests.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.slice(0, 3).map((interest) => (
                          <span
                            key={interest}
                            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded border border-primary/20"
                          >
                            {interest}
                          </span>
                        ))}
                        {profile.interests.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{profile.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs md:text-sm text-muted-foreground">
                  Redirecting to dashboard in 3 seconds...
                </p>
              </motion.div>
            </div>
          </HolographicPanel>
        </div>
      </div>
    </div>
  );
}
