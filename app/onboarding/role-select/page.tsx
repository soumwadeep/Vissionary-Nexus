'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/effects/floating-particles';
import { HolographicCard } from '@/components/effects/holographic-card';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { Code2, TrendingUp, Palette } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';

const roles = [
  {
    id: 'builder',
    title: 'Builder',
    description: 'Develop and deploy AI applications',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'Fund innovative AI projects',
    icon: TrendingUp,
    color: 'from-purple-500 to-blue-500',
  },
  {
    id: 'creator',
    title: 'Creator',
    description: 'Generate and share AI content',
    icon: Palette,
    color: 'from-pink-500 to-purple-500',
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const { profile, setRole } = useWalletAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    analyticsEvents.roleSelected(selectedRole)
    setRole(selectedRole as 'builder' | 'investor' | 'creator');
    
    setTimeout(() => {
      router.push('/onboarding/interests');
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
        <div className="w-full max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Choose Your Role</h1>
            <p className="text-slate-400">Select how you want to participate in the ecosystem</p>
          </motion.div>

          {/* Role cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`text-left transition-all ${
                    selectedRole === role.id ? 'scale-105' : ''
                  }`}
                >
                  <HolographicCard className="h-full group cursor-pointer">
                    <div className="space-y-4">
                      {/* Icon */}
                      <motion.div
                        className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${role.color} text-white`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                        <p className="text-slate-400 text-sm">{role.description}</p>
                      </div>

                      {/* Selection indicator */}
                      {selectedRole === role.id && (
                        <motion.div
                          layoutId="activeRole"
                          className="absolute inset-0 border-2 border-cyan-400 rounded-xl"
                          initial={false}
                        />
                      )}
                    </div>
                  </HolographicCard>
                </motion.button>
              );
            })}
          </div>

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
              disabled={!selectedRole || isLoading}
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
