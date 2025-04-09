
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface HealthProfile {
  hasCondition: {
    diabetes: boolean;
    hypertension: boolean;
    thyroidIssues: boolean;
    foodAllergies: string[];
  };
  scanHistory: {
    count: number;
    lastScan: Date | null;
    streak: number;
  };
  achievements: {
    firstScan: boolean;
    threeDayStreak: boolean;
    fiveSafeProducts: boolean;
    tenScans: boolean;
  };
}

const defaultHealthProfile: HealthProfile = {
  hasCondition: {
    diabetes: false,
    hypertension: false,
    thyroidIssues: false,
    foodAllergies: [],
  },
  scanHistory: {
    count: 0,
    lastScan: null,
    streak: 0,
  },
  achievements: {
    firstScan: false,
    threeDayStreak: false,
    fiveSafeProducts: false,
    tenScans: false,
  },
};

interface UserContextType {
  healthProfile: HealthProfile;
  updateHealthProfile: (profile: Partial<HealthProfile>) => void;
  updateHealthCondition: (condition: keyof HealthProfile['hasCondition'], value: any) => void;
  recordScan: (wasSafeProduct: boolean) => void;
  resetProfile: () => void;
  safeFoodCount: number;
  setSafeFoodCount: (count: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [healthProfile, setHealthProfile] = useState<HealthProfile>(() => {
    const savedProfile = localStorage.getItem('healthProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Ensure lastScan is a Date object if it exists
      if (parsed.scanHistory.lastScan) {
        parsed.scanHistory.lastScan = new Date(parsed.scanHistory.lastScan);
      }
      return parsed;
    }
    return defaultHealthProfile;
  });

  const [safeFoodCount, setSafeFoodCount] = useState<number>(() => {
    const savedCount = localStorage.getItem('safeFoodCount');
    return savedCount ? parseInt(savedCount) : 0;
  });

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem('healthProfile', JSON.stringify(healthProfile));
  }, [healthProfile]);

  useEffect(() => {
    localStorage.setItem('safeFoodCount', safeFoodCount.toString());
  }, [safeFoodCount]);

  const updateHealthProfile = (profile: Partial<HealthProfile>) => {
    setHealthProfile((prev) => ({ ...prev, ...profile }));
  };

  const updateHealthCondition = (condition: keyof HealthProfile['hasCondition'], value: any) => {
    setHealthProfile((prev) => ({
      ...prev,
      hasCondition: { ...prev.hasCondition, [condition]: value },
    }));
  };

  const recordScan = (wasSafeProduct: boolean) => {
    const now = new Date();
    const lastScan = healthProfile.scanHistory.lastScan;
    let newStreak = healthProfile.scanHistory.streak;
    
    // Check if this is a new day scan to increase streak
    if (lastScan) {
      const lastScanDate = new Date(lastScan);
      const isYesterday = 
        now.getDate() - lastScanDate.getDate() === 1 || 
        (now.getDate() === 1 && new Date(now.getFullYear(), now.getMonth(), 0).getDate() - lastScanDate.getDate() === 0);
      
      if (isYesterday) {
        newStreak += 1;
      } else if (now.toDateString() !== lastScanDate.toDateString()) {
        // Reset streak if not consecutive days, but don't reset if same day
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newCount = healthProfile.scanHistory.count + 1;
    
    // Update achievements
    const newAchievements = { ...healthProfile.achievements };
    if (newCount === 1) {
      newAchievements.firstScan = true;
    }
    if (newCount >= 10) {
      newAchievements.tenScans = true;
    }
    if (newStreak >= 3) {
      newAchievements.threeDayStreak = true;
    }
    
    if (wasSafeProduct) {
      const newSafeFoodCount = safeFoodCount + 1;
      setSafeFoodCount(newSafeFoodCount);
      if (newSafeFoodCount >= 5) {
        newAchievements.fiveSafeProducts = true;
      }
    }

    setHealthProfile((prev) => ({
      ...prev,
      scanHistory: {
        count: newCount,
        lastScan: now,
        streak: newStreak,
      },
      achievements: newAchievements,
    }));
  };

  const resetProfile = () => {
    setHealthProfile(defaultHealthProfile);
    setSafeFoodCount(0);
  };

  return (
    <UserContext.Provider 
      value={{ 
        healthProfile, 
        updateHealthProfile, 
        updateHealthCondition, 
        recordScan, 
        resetProfile,
        safeFoodCount,
        setSafeFoodCount
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
