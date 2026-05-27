'use client';

import { useRouter } from 'next/navigation';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { AIEcosystemInit } from '@/components/web3/ai-ecosystem-init-premium';

export default function AIInitPage() {
  const router = useRouter();
  const { profile, initializeAI, completeOnboarding } = useWalletAuth();

  const handleComplete = () => {
    if (!profile?.address) return;
    
    initializeAI();
    completeOnboarding();
    router.push('/dashboard');
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
