import { Profile } from '../profileStorage';
import { MatchingFilters } from './matchingTypes';

export const filterProfiles = (
  profiles: Profile[],
  currentProfile: Profile,
  filters: MatchingFilters
): Profile[] => {
  return profiles.filter(profile => {
    // Skip current user's profile
    if (profile.cupidId === currentProfile.cupidId) return false;

    // Apply gender preference and orientation filter
    if (!isGenderMatch(filters, profile.personalInfo.gender)) return false;

    // Apply age filter
    if (filters.minAge && profile.personalInfo.age < filters.minAge) return false;
    if (filters.maxAge && profile.personalInfo.age > filters.maxAge) return false;

    return true;
  });
};

export const isGenderMatch = (filters: MatchingFilters, matchGender: string): boolean => {
  const { sexualOrientation, userGender, genderPreference } = filters;

  // Handle orientation-specific matching
  switch (sexualOrientation.toLowerCase()) {
    case 'straight':
      if (userGender === 'male') return matchGender === 'female';
      if (userGender === 'female') return matchGender === 'male';
      return false;

    case 'gay':
      if (userGender === 'male') return matchGender === 'male';
      return false;

    case 'lesbian':
      if (userGender === 'female') return matchGender === 'female';
      return false;

    case 'bisexual':
    case 'pansexual':
      if (genderPreference === 'all') return true;
      return matchGender === genderPreference;

    default:
      return false;
  }
};

export const validateProfileCompleteness = (profile: Profile): boolean => {
  return !!(
    profile &&
    profile.cupidId &&
    profile.personalInfo?.gender &&
    profile.personalInfo?.age &&
    profile.preferences?.sexualOrientation &&
    profile.preferences?.genderPreference &&
    profile.psychologicalProfile
  );
};