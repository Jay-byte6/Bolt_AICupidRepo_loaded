import { v4 as uuidv4 } from 'uuid';
import profileStorage from '../storage/profileStorage';
import type { Profile } from '../../types/profile';

export const generateCupidId = (): string => {
  return `CUPID-${uuidv4().slice(0, 8).toUpperCase()}`;
};

export const createProfile = (profileData: Omit<Profile, 'cupidId' | 'createdAt' | 'lastUpdated'>): Profile => {
  const profile: Profile = {
    ...profileData,
    cupidId: generateCupidId(),
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };

  profileStorage.storeProfile(profile);
  profileStorage.setCurrentProfile(profile);

  return profile;
};

export const updateProfile = (cupidId: string, updates: Partial<Profile>): Profile => {
  const existingProfile = profileStorage.getProfile(cupidId);
  if (!existingProfile) {
    throw new Error('Profile not found');
  }

  const updatedProfile: Profile = {
    ...existingProfile,
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  profileStorage.storeProfile(updatedProfile);
  
  // Update current profile if this is the current user
  const currentProfile = profileStorage.getCurrentProfile();
  if (currentProfile?.cupidId === cupidId) {
    profileStorage.setCurrentProfile(updatedProfile);
  }

  return updatedProfile;
};