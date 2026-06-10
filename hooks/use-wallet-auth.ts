'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WalletProfile {
  address: string;
  role: 'builder' | 'investor' | 'creator' | null;
  interests: string[];
  onboardingComplete: boolean;
  aiInitialized: boolean;
  nftCount: number;
  reputation: number;
  joinedAt: string;
}

const STORAGE_KEY = 'wallet_profile';
const DEFAULT_PROFILE: WalletProfile = {
  address: '',
  role: null,
  interests: [],
  onboardingComplete: false,
  aiInitialized: false,
  nftCount: 0,
  reputation: 0,
  joinedAt: new Date().toISOString(),
};

export function useWalletAuth() {
  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        // Sync with database if connected
        if (parsed.address) {
          syncProfileWithDatabase(parsed);
        }
      } else {
        // TEMP: Auto-connect mock wallet for testing
        const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
        const mockProfile: WalletProfile = {
          address: mockAddress,
          role: 'builder',
          interests: ['DeFi', 'AI'],
          onboardingComplete: true,
          aiInitialized: true,
          nftCount: 3,
          reputation: 100,
          joinedAt: new Date().toISOString(),
        };
        console.log('[v0] Auto-connecting mock wallet for testing');
        setProfile(mockProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProfile));
        syncProfileWithDatabase(mockProfile);
      }
    } catch (error) {
      console.error('[v0] Failed to load wallet profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const syncProfileWithDatabase = useCallback(async (profileData: WalletProfile) => {
    if (!profileData.address) return;
    
    try {
      setIsSyncing(true);
      const response = await fetch('/api/wallet/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: profileData.address,
          role: profileData.role,
          interests: profileData.interests,
          onboardingComplete: profileData.onboardingComplete,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[v0] Profile synced with database:', data);
      }
    } catch (error) {
      console.error('[v0] Failed to sync profile with database:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const connectWallet = useCallback((address: string) => {
    const newProfile: WalletProfile = {
      ...DEFAULT_PROFILE,
      address,
      joinedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    // Sync to database
    syncProfileWithDatabase(newProfile);
  }, [syncProfileWithDatabase]);

  const disconnectWallet = useCallback(() => {
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setRole = useCallback((role: 'builder' | 'investor' | 'creator') => {
    if (!profile) return;
    const updated = { ...profile, role };
    setProfile(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    syncProfileWithDatabase(updated);
  }, [profile, syncProfileWithDatabase]);

  const setInterests = useCallback((interests: string[]) => {
    if (!profile) return;
    const updated = { ...profile, interests };
    setProfile(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    syncProfileWithDatabase(updated);
  }, [profile, syncProfileWithDatabase]);

  const completeOnboarding = useCallback(async () => {
    if (!profile) return;
    
    try {
      const response = await fetch('/api/wallet/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: profile.address,
          role: profile.role,
          interests: profile.interests,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updated = { ...profile, onboardingComplete: true };
        setProfile(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log('[v0] Onboarding completed and synced:', data);
      }
    } catch (error) {
      console.error('[v0] Failed to complete onboarding:', error);
    }
  }, [profile]);

  const initializeAI = useCallback(() => {
    if (!profile) return;
    const updated = { ...profile, aiInitialized: true };
    setProfile(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<WalletProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    syncProfileWithDatabase(updated);
  }, [profile, syncProfileWithDatabase]);

  const recordAchievement = useCallback(async (achievementType: string, points: number = 10) => {
    if (!profile) return;

    try {
      const response = await fetch('/api/wallet/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: profile.address,
          achievementType,
          points,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updated = { ...profile, reputation: (profile.reputation || 0) + points };
        setProfile(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log('[v0] Achievement recorded:', data);
      }
    } catch (error) {
      console.error('[v0] Failed to record achievement:', error);
    }
  }, [profile]);

  return {
    profile,
    isLoading,
    isSyncing,
    isConnected: !!profile?.address,
    connectWallet,
    disconnectWallet,
    setRole,
    setInterests,
    completeOnboarding,
    initializeAI,
    updateProfile,
    recordAchievement,
  };
}
