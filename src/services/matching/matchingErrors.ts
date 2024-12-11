export class MatchingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MatchingError';
  }
}

export const MATCHING_ERRORS = {
  INCOMPLETE_PROFILE: 'Please complete your personality analysis first',
  NO_REGISTERED_USERS: 'No other registered users found in the system',
  NO_VALID_PROFILES: 'No valid profiles found matching your preferences',
  SELF_MATCH: 'Cannot check compatibility with your own profile',
  GENDER_MISMATCH: 'This profile does not match your gender preferences',
  AGE_MISMATCH: 'This profile does not match your age preferences',
  PROFILE_NOT_FOUND: 'No registered user found with this CUPID ID',
  LOW_COMPATIBILITY: 'No matches found with 75%+ compatibility. Would you like to see profiles with lower compatibility scores?',
  NO_MATCHES: 'No compatible matches found matching your preferences'
};