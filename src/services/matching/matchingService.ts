import { Profile, MatchedProfile } from '../../types/profile';
import { calculateCompatibilityScore } from '../../utils/compatibilityCalculator';
import { getProfileImage } from '../../utils/profileUtils';
import { validateProfileCompleteness } from './validators/profileValidator';
import { MATCHING_ERRORS } from './constants/errors';
import { MatchingError } from './errors/MatchingError';
import { getCachedResult, setCachedResult } from './cache/matchingCache';
import { profileStorage } from '../storage';
import { validateMatchCriteria } from './validators/matchValidator';
import { StorageError } from '../storage/types';

export const findMatchByCupidId = async (cupidId: string): Promise<MatchedProfile> => {
  try {
    // Check cache first
    const cachedResult = getCachedResult(`match-${cupidId}`);
    if (cachedResult) return cachedResult;

    // Get and validate current profile
    let currentProfile: Profile | null;
    try {
      currentProfile = profileStorage.getCurrentProfile();
    } catch (error) {
      if (error instanceof StorageError) {
        throw new MatchingError(MATCHING_ERRORS.STORAGE_ERROR);
      }
      throw error;
    }

    if (!currentProfile) {
      throw new MatchingError(MATCHING_ERRORS.INCOMPLETE_PROFILE);
    }

    // Validate current profile completeness
    if (!validateProfileCompleteness(currentProfile)) {
      throw new MatchingError(MATCHING_ERRORS.INCOMPLETE_PROFILE);
    }

    // Get and validate target profile
    let targetProfile: Profile | null;
    try {
      targetProfile = profileStorage.getProfile(cupidId);
    } catch (error) {
      if (error instanceof StorageError) {
        throw new MatchingError(MATCHING_ERRORS.STORAGE_ERROR);
      }
      throw error;
    }

    if (!targetProfile) {
      throw new MatchingError(MATCHING_ERRORS.PROFILE_NOT_FOUND);
    }

    // Validate match criteria
    const validationError = validateMatchCriteria(currentProfile, targetProfile);
    if (validationError) {
      throw new MatchingError(validationError);
    }

    // Calculate compatibility
    const compatibility = calculateCompatibilityScore(currentProfile, targetProfile);
    
    const matchedProfile: MatchedProfile = {
      ...targetProfile,
      compatibility,
      image: getProfileImage(targetProfile.personalInfo.gender)
    };

    // Cache the result
    setCachedResult(`match-${cupidId}`, matchedProfile);
    return matchedProfile;

  } catch (error) {
    if (error instanceof MatchingError) {
      throw error;
    }
    console.error('Error finding match:', error);
    throw new MatchingError(MATCHING_ERRORS.GENERAL_ERROR);
  }
};