import { ParticleField } from '@/components/ecosystem/particle-field';
import { ClientWelcome } from '@/components/onboarding/client-welcome';

export const metadata = {
  title: 'Welcome to Vissionary Nexus',
  description: 'Begin your journey in the AI ecosystem',
};

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Particle Field Background */}
      <ParticleField />
      <ClientWelcome />
    </div>
  );
}
