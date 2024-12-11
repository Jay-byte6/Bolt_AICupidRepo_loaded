import { Profile } from '../profileStorage';

export const isGenderMatch = (userProfile: Profile, potentialMatch: Profile): boolean => {
  const { genderPreference, sexualOrientation } = userProfile.preferences;
  const matchGender = potentialMatch.personalInfo.gender;

  if (!genderPreference || !sexualOrientation) return false;

  // If user prefers all genders
  if (genderPreference === 'all') return true;

  // Handle straight preferences
  if (sexualOrientation === 'straight') {
    if (userProfile.personalInfo.gender === 'male' && matchGender === 'female') return true;
    if (userProfile.personalInfo.gender === 'female' && matchGender === 'male') return true;
  }

  // Handle gay/lesbian preferences
  if (sexualOrientation === 'gay' || sexualOrientation === 'lesbian') {
    if (userProfile.personalInfo.gender === matchGender) return true;
  }

  // Handle bisexual/pansexual preferences
  if (sexualOrientation === 'bisexual' || sexualOrientation === 'pansexual') {
    if (genderPreference === matchGender || genderPreference === 'all') return true;
  }

  return false;
};

export const isAgeMatch = (userProfile: Profile, potentialMatch: Profile): boolean => {
  const { minAge, maxAge } = userProfile.preferences;
  const matchAge = potentialMatch.personalInfo.age;

  if (!minAge || !maxAge || !matchAge) return false;
  return matchAge >= minAge && matchAge <= maxAge;
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