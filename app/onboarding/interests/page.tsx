'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParticleField } from '@/components/ecosystem/particle-field';
import { HolographicPanel } from '@/components/ecosystem/micro-interactions';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { useAuth } from '@/hooks/use-auth';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

const interests = [
  'Machine Learning',
  'Artificial Intelligence',
  'Web3',
  'Blockchain',
  'Game Development',
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
  const { isAuthenticated, status } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!isAuthenticated) {
      router.push('/auth/login?callbackUrl=/onboarding/interests');
    }
  }, [isAuthenticated, status, router]);

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
        <p className="text-muted-foreground">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Particle Field Background */}
      <ParticleField />

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-12 pb-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">What interests you?</h1>
            <p className="text-sm md:text-base text-muted-foreground">Select at least one (or more)</p>
          </motion.div>

          {/* Interest grid */}
          <HolographicPanel className="mb-6">
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {interests.map((interest, index) => (
                  <motion.button
                    key={interest}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => toggleInterest(interest)}
                    className={`relative p-3 md:p-4 rounded-lg border transition-all text-xs md:text-sm font-medium ${
                      selectedInterests.includes(interest)
                        ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                        : 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>{interest}</span>
                      {selectedInterests.includes(interest) && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </HolographicPanel>

          {/* Selection info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6 text-xs md:text-sm text-muted-foreground"
          >
            Selected: {selectedInterests.length} of {interests.length}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex gap-3"
          >
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 h-11"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleContinue}
                disabled={selectedInterests.length === 0 || isLoading}
                className="flex-1 glow-border font-semibold h-11"
              >
                {isLoading ? 'Continuing...' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
