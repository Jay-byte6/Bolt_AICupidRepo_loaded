import { Profile } from '../../../types/profile';
import { MATCHING_ERRORS } from '../constants/errors';

export const validateMatchCriteria = (
  currentProfile: Profile,
  targetProfile: Profile
): string | null => {
  // Check for self-match
  if (currentProfile.cupidId === targetProfile.cupidId) {
    return MATCHING_ERRORS.SELF_MATCH;
  }

  // Validate gender preferences
  if (!isGenderMatch(currentProfile, targetProfile)) {
    return MATCHING_ERRORS.GENDER_MISMATCH;
  }

  // Validate age preferences
  if (!isAgeMatch(currentProfile, targetProfile)) {
    return MATCHING_ERRORS.AGE_MISMATCH;
  }

  return null;
};

const isGenderMatch = (currentProfile: Profile, targetProfile: Profile): boolean => {
  const { genderPreference, sexualOrientation } = currentProfile.preferences;
  const targetGender = targetProfile.personalInfo.gender;

  if (genderPreference === 'all') return true;

  switch (sexualOrientation.toLowerCase()) {
    case 'straight':
      return currentProfile.personalInfo.gender === 'male' ? 
        targetGender === 'female' : targetGender === 'male';
    case 'gay':
    case 'lesbian':
      return currentProfile.personalInfo.gender === targetGender;
    case 'bisexual':
    case 'pansexual':
      return genderPreference === 'all' || genderPreference === targetGender;
    default:
      return false;
  }
};

const isAgeMatch = (currentProfile: Profile, targetProfile: Profile): boolean => {
  const { minAge, maxAge } = currentProfile.preferences;
  const targetAge = targetProfile.personalInfo.age;

  if (!minAge || !maxAge) return true;
  return targetAge >= minAge && targetAge <= maxAge;
};