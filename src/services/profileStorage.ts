import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const PROFILES_KEY = 'ai_cupid_profiles';
const CURRENT_PROFILE_KEY = 'ai_cupid_current_profile';

export interface Profile {
  cupidId: string;
  personalInfo: {
    fullName: string;
    age: number;
    gender: string;
    location: string;
    occupation: string;
    relationshipHistory: string;
    lifestyle: string;
  };
  preferences: {
    interests: string[];
    minAge?: number;
    maxAge?: number;
    preferredDistance?: string;
    educationPreference?: string;
    sexualOrientation: string;
    genderPreference: string;
  };
  psychologicalProfile: {
    extroversion: number;
    openness: number;
    agreeableness: number;
    conscientiousness: number;
    emotionalStability: number;
    communicationStyle: string;
    conflictResolution: string;
  };
  relationshipGoals: {
    relationshipType: string;
    timeline: string;
    familyPlans: string;
    relationshipValues: string;
  };
  behavioralInsights: {
    loveLanguage: string;
    socialBattery: string;
    stressResponse: string;
    decisionMaking: string;
  };
  dealbreakers: {
    dealbreakers: string[];
    customDealbreakers?: string;
    dealbreakersFlexibility: string;
  };
  createdAt: string;
  lastUpdated: string;
}

export const generateCupidId = (): string => {
  return `CUPID-${uuidv4().slice(0, 8).toUpperCase()}`;
};

export const getStoredProfiles = (): { [key: string]: Profile } => {
  try {
    const storedProfiles = localStorage.getItem(PROFILES_KEY);
    return storedProfiles ? JSON.parse(storedProfiles) : {};
  } catch (error) {
    console.error('Error reading profiles:', error);
    return {};
  }
};

export const findProfileByCupidId = (cupidId: string): Profile | null => {
  try {
    const profiles = getStoredProfiles();
    return profiles[cupidId] || null;
  } catch (error) {
    console.error('Error finding profile by CUPID ID:', error);
    return null;
  }
};

export const storeProfile = (profileData: Omit<Profile, 'cupidId' | 'createdAt' | 'lastUpdated'>): Profile => {
  try {
    const cupidId = generateCupidId();
    const timestamp = new Date().toISOString();
    
    const profile: Profile = {
      ...profileData,
      cupidId,
      createdAt: timestamp,
      lastUpdated: timestamp
    };

    const profiles = getStoredProfiles();
    profiles[cupidId] = profile;
    
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(CURRENT_PROFILE_KEY, JSON.stringify(profile));

    return profile;
  } catch (error: any) {
    console.error('Error storing profile:', error);
    throw new Error(error.message || 'Failed to save profile data');
  }
};

export const getCurrentProfile = (): Profile | null => {
  try {
    const storedProfile = localStorage.getItem(CURRENT_PROFILE_KEY);
    return storedProfile ? JSON.parse(storedProfile) : null;
  } catch (error) {
    console.error('Error getting current profile:', error);
    return null;
  }
};

export const clearProfileData = (): void => {
  localStorage.removeItem(CURRENT_PROFILE_KEY);
};

export const isProfileComplete = (): boolean => {
  return !!getCurrentProfile();
};

export const getAllRegisteredProfiles = (): Profile[] => {
  try {
    const profiles = getStoredProfiles();
    return Object.values(profiles)
      .filter(profile => !!profile.cupidId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting registered profiles:', error);
    return [];
  }
};

export const storeGeneratedProfiles = (profiles: Profile[]): void => {
  try {
    const existingProfiles = getStoredProfiles();
    const updatedProfiles = { ...existingProfiles };
    
    profiles.forEach(profile => {
      updatedProfiles[profile.cupidId] = profile;
    });
    
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
  } catch (error) {
    console.error('Error storing generated profiles:', error);
  }
};