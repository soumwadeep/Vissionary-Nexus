import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/effects/floating-particles';
import { HolographicCard } from '@/components/effects/holographic-card';

export const metadata = {
  title: 'Welcome to Vissionary Nexus | Web3 Platform',
  description: 'Begin your journey in the decentralized AI ecosystem',
};

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
      <FloatingParticles count={20} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Logo/Title */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              VISSIONARY
            </div>
            <p className="text-xl text-cyan-400/80">Nexus Platform</p>
            <p className="text-slate-300 max-w-md mx-auto">
              Experience the next generation of decentralized intelligence powered by Web3 and AI
            </p>
          </div>

          {/* Main card */}
          <HolographicCard>
            <div className="space-y-6">
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: '🧠', title: 'AI Ecosystem', desc: 'Powered by neural networks' },
                  { icon: '🌐', title: 'Web3 Native', desc: 'Decentralized & trustless' },
                  { icon: '⚡', title: 'Fast & Efficient', desc: 'Optimized performance' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="text-center p-4 rounded-lg bg-black/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors"
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6 border-t border-cyan-500/20">
                <p className="text-sm text-slate-400 mb-4 text-center">
                  Connect your wallet to get started
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold h-12"
                >
                  <a href="/onboarding/role-select">Continue</a>
                </Button>
              </div>
            </div>
          </HolographicCard>

          {/* Footer text */}
          <p className="text-center text-xs text-slate-500">
            Secure • Decentralized • Intelligent
          </p>
        </div>
      </div>
    </div>
  );
}
