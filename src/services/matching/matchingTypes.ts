import { Profile } from '../profileStorage';
import { CompatibilityScore } from '../../types/profile';

export interface MatchingOptions {
  includeLowMatches?: boolean;
  minAge?: number;
  maxAge?: number;
  limit?: number;
}

export interface MatchingResult {
  profile: Profile;
  compatibility: CompatibilityScore;
}

export interface MatchingFilters {
  genderPreference: string;
  sexualOrientation: string;
  userGender: string;
  minAge?: number;
  maxAge?: number;
  distance?: string;
}