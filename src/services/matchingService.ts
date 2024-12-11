import { Profile, getCurrentProfile, getAllRegisteredProfiles } from './profileStorage';
import { CompatibilityScore, MatchedProfile } from '../types/profile';
import { analyzeCompatibility } from './openai';
import { getProfileImage } from '../utils/profileUtils';

const isGenderMatch = (userProfile: Profile, potentialMatch: Profile): boolean => {
  const { genderPreference, sexualOrientation } = userProfile.preferences;
  const matchGender = potentialMatch.personalInfo.gender;

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

const isAgeMatch = (userProfile: Profile, potentialMatch: Profile): boolean => {
  const { minAge, maxAge } = userProfile.preferences;
  const matchAge = potentialMatch.personalInfo.age;

  if (!minAge || !maxAge) return true;
  return matchAge >= minAge && matchAge <= maxAge;
};

export const findCompatibleMatches = async (
  currentCupidId: string, 
  includeLowMatches = false
): Promise<MatchedProfile[]> => {
  try {
    const currentProfile = getCurrentProfile();
    if (!currentProfile) {
      throw new Error('Please complete your personality analysis first');
    }

    const allProfiles = getAllRegisteredProfiles();
    if (!allProfiles || allProfiles.length <= 1) {
      throw new Error('No other registered users found in the system');
    }

    // Filter out invalid profiles, current user, and apply gender/age preferences
    const validProfiles = allProfiles.filter(profile => 
      profile && 
      profile.cupidId && 
      profile.cupidId !== currentCupidId &&
      profile.personalInfo &&
      profile.preferences &&
      profile.psychologicalProfile &&
      isGenderMatch(currentProfile, profile) &&
      isAgeMatch(currentProfile, profile)
    );

    if (validProfiles.length === 0) {
      throw new Error('No valid profiles found matching your preferences');
    }

    // Analyze compatibility using OpenAI for each profile
    const matchPromises = validProfiles.map(async profile => {
      try {
        const compatibility = await analyzeCompatibility(currentProfile, profile);
        return {
          ...profile,
          compatibility,
          image: getProfileImage(profile.personalInfo.gender)
        };
      } catch (error) {
        console.error('Error analyzing compatibility for profile:', profile.cupidId, error);
        return null;
      }
    });

    const matches = (await Promise.all(matchPromises))
      .filter((match): match is MatchedProfile => 
        match !== null && 
        (includeLowMatches || match.compatibility.overall >= 0.75)
      )
      .sort((a, b) => b.compatibility.overall - a.compatibility.overall)
      .slice(0, 10);

    if (matches.length === 0) {
      throw new Error(includeLowMatches 
        ? 'No compatible matches found matching your preferences' 
        : 'No matches found with 75%+ compatibility. Would you like to see profiles with lower compatibility scores?');
    }

    return matches;
  } catch (error: any) {
    console.error('Error in findCompatibleMatches:', error);
    throw new Error(error.message || 'Failed to find compatible matches');
  }
};

export const findMatchByCupidId = async (cupidId: string): Promise<MatchedProfile | null> => {
  try {
    const currentProfile = getCurrentProfile();
    if (!currentProfile) {
      throw new Error('Please complete your personality analysis first');
    }

    if (currentProfile.cupidId === cupidId) {
      throw new Error('Cannot check compatibility with your own profile');
    }

    const targetProfile = getAllRegisteredProfiles().find(p => p.cupidId === cupidId);
    if (!targetProfile) {
      throw new Error('No registered user found with this CUPID ID');
    }

    // Validate profile completeness
    if (!targetProfile.personalInfo || !targetProfile.preferences || !targetProfile.psychologicalProfile) {
      throw new Error('Target profile is incomplete');
    }

    // Check if the match aligns with user's preferences
    if (!isGenderMatch(currentProfile, targetProfile)) {
      throw new Error('This profile does not match your gender preferences');
    }

    if (!isAgeMatch(currentProfile, targetProfile)) {
      throw new Error('This profile does not match your age preferences');
    }

    const compatibility = await analyzeCompatibility(currentProfile, targetProfile);

    return {
      ...targetProfile,
      compatibility,
      image: getProfileImage(targetProfile.personalInfo.gender)
    };
  } catch (error: any) {
    console.error('Error in findMatchByCupidId:', error);
    throw new Error(error.message || 'Failed to find profile with the provided CUPID ID');
  }
};