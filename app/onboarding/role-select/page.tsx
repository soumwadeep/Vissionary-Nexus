'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParticleField } from '@/components/ecosystem/particle-field';
import { HolographicPanel } from '@/components/ecosystem/micro-interactions';
import { useWalletAuth } from '@/hooks/use-wallet-auth';
import { useAuth } from '@/hooks/use-auth';
import { Code2, Trophy, Zap, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { analyticsEvents } from '@/lib/analytics';

const roles = [
  {
    id: 'participant',
    title: 'Participant',
    description: 'Join events, collaborate with teams, and build innovative projects',
    icon: Zap,
  },
  {
    id: 'host',
    title: 'Event Host',
    description: 'Create and manage hackathons, events, and competitions',
    icon: Trophy,
  },
  {
    id: 'builder',
    title: 'Builder',
    description: 'Develop and deploy AI applications and solutions',
    icon: Code2,
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { profile, setRole } = useWalletAuth();
  const { isAuthenticated, status } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!isAuthenticated) {
      router.push('/auth/login?callbackUrl=/onboarding/role-select');
    }
  }, [isAuthenticated, status, router]);

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    analyticsEvents.roleSelected(selectedRole)
    setRole(selectedRole as 'participant' | 'host' | 'builder');

    setTimeout(() => {
      router.push('/onboarding/interests');
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Choose your role</h1>
            <p className="text-sm md:text-base text-muted-foreground">How do you want to participate?</p>
          </motion.div>

          {/* Role cards */}
          <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`text-left transition-all w-full`}
                >
                  <HolographicPanel className="h-full">
                    <div className="relative h-full p-4 md:p-5 flex items-center gap-4">
                      {selectedRole === role.id && (
                        <motion.div
                          layoutId="activeRole"
                          className="absolute inset-0 border-2 border-primary rounded-xl"
                          initial={false}
                        />
                      )}
                      <div className="space-y-0 relative flex-1">
                        {/* Icon */}
                        <motion.div
                          className={`inline-flex p-2 md:p-3 rounded-lg ${selectedRole === role.id ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-card border border-border'}`}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="w-5 h-5 md:w-6 md:h-6" />
                        </motion.div>
                        {/* Content */}
                        <div className="mt-2">
                          <h3 className="text-base md:text-lg font-bold text-white mb-1">{role.title}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      {selectedRole === role.id && (
                        <div className="relative">
                          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                        </div>
                      )}
                    </div>
                  </HolographicPanel>
                </motion.button>
              );
            })}
          </div>

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
                disabled={!selectedRole || isLoading}
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
