"use client";

import { useEffect, useState } from "react";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/navbar";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Zap, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalReputation: number;
  achievementsCount: number;
  profileViews: number;
  networkStatus: string;
}

export default function DashboardPage() {
  const { profile, isLoading } = useWalletAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !profile?.address) {
      router.push("/");
    }
  }, [isLoading, profile?.address, router]);

  useEffect(() => {
    const loadStats = async () => {
      if (!profile?.address) return;

      try {
        // Fetch achievements
        const achievementsRes = await fetch(
          `/api/wallet/achievements?address=${profile.address}`,
        );
        const achievements = achievementsRes.ok
          ? await achievementsRes.json()
          : [];

        setStats({
          totalReputation: profile.reputation || 0,
          achievementsCount: achievements.length,
          profileViews: Math.floor(Math.random() * 100) + 10,
          networkStatus: "Connected to Somnia",
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [profile?.address, profile?.reputation]);

  if (isLoading || !profile?.address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <Navbar />

      <div className="relative pt-32 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back,{" "}
              {profile?.role === "builder"
                ? "Builder"
                : profile?.role === "investor"
                  ? "Investor"
                  : "Creator"}
              !
            </h1>
            <p className="text-slate-400">
              Connected:{" "}
              <span className="text-primary font-mono">
                {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
              </span>
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {isLoadingStats ? (
              <div className="text-white col-span-4">Loading stats...</div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6 bg-slate-800/50 border-primary/20 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Reputation</p>
                        <p className="text-3xl font-bold text-primary mt-2">
                          {stats?.totalReputation || 0}
                        </p>
                      </div>
                      <Trophy className="w-8 h-8 text-primary/50" />
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6 bg-slate-800/50 border-primary/20 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Achievements</p>
                        <p className="text-3xl font-bold text-primary mt-2">
                          {stats?.achievementsCount || 0}
                        </p>
                      </div>
                      <Zap className="w-8 h-8 text-primary/50" />
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 bg-slate-800/50 border-primary/20 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Profile Views</p>
                        <p className="text-3xl font-bold text-primary mt-2">
                          {stats?.profileViews || 0}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-primary/50" />
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-6 bg-slate-800/50 border-primary/20 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">Network</p>
                        <p className="text-sm font-semibold text-primary mt-2 line-clamp-2">
                          {stats?.networkStatus}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-primary/50" />
                    </div>
                  </Card>
                </motion.div>
              </>
            )}
          </div>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-8 bg-slate-800/30 border-primary/20">
              <h2 className="text-xl font-bold text-white mb-6">
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Role</p>
                  <p className="text-white capitalize text-lg font-semibold">
                    {profile.role}
                  </p>
                </div>

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-slate-400 text-sm mb-2">
                    Onboarding Status
                  </p>
                  <p className="text-primary font-semibold">
                    {profile.onboardingComplete ? "✓ Completed" : "In Progress"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Member Since</p>
                  <p className="text-white text-sm">
                    {new Date(profile.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
