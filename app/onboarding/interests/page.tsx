'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/effects/floating-particles';
import { HolographicCard } from '@/components/effects/holographic-card';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { Check } from 'lucide-react';

const interests = [
  'Machine Learning',
  'Smart Contracts',
  'DeFi',
  'NFTs',
  'DAOs',
  'Gaming',
  'Social',
  'Privacy',
  'Security',
  'Sustainability',
  'Healthcare',
  'Finance',
];

export default function InterestsPage() {
  const router = useRouter();
  const { profile, setInterests } = useWalletAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) return;
    
    setIsLoading(true);
    setInterests(selectedInterests);
    
    setTimeout(() => {
      router.push('/onboarding/ai-init');
    }, 300);
  };

  if (!profile?.address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      <FloatingParticles count={15} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Your Interests</h1>
            <p className="text-slate-400">Select at least one topic that interests you</p>
          </motion.div>

          {/* Interest grid */}
          <HolographicCard className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map((interest, index) => (
                <motion.button
                  key={interest}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleInterest(interest)}
                  className={`relative p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedInterests.includes(interest)
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                      : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{interest}</span>
                    {selectedInterests.includes(interest) && (
                      <Check className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </HolographicCard>

          {/* Selection info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 text-sm text-slate-400"
          >
            Selected: {selectedInterests.length} of {interests.length}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex gap-4"
          >
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={selectedInterests.length === 0 || isLoading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
            >
              {isLoading ? 'Continuing...' : 'Continue'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
