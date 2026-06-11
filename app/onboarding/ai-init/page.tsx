'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { useAuth } from '@/hooks/use-auth';
import { AIEcosystemInit } from '@/components/web3/ai-ecosystem-init-premium';

export default function AIInitPage() {
  const router = useRouter();
  const { profile, initializeAI, completeOnboarding } = useWalletAuth();
  const { isAuthenticated, status } = useAuth();

  useEffect(() => {
    if (status === 'loading') return;
    if (!isAuthenticated) {
      router.push('/auth/login?callbackUrl=/onboarding/ai-init');
    }
  }, [isAuthenticated, status, router]);

  const handleComplete = () => {
    if (!profile?.address) return;
    
    initializeAI();
    completeOnboarding();
    router.push('/dashboard/participant');
  };

  if (!profile?.address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <AIEcosystemInit
      address={profile.address}
      onComplete={handleComplete}
    />
  );
}
