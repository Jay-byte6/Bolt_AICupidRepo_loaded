export const MATCHING_ERRORS = {
  INCOMPLETE_PROFILE: 'Please complete your personality analysis first',
  PROFILE_NOT_FOUND: 'No registered user found with this CUPID ID',
  SELF_MATCH: 'Cannot check compatibility with your own profile',
  GENDER_MISMATCH: 'This profile does not match your gender preferences',
  AGE_MISMATCH: 'This profile does not match your age preferences',
  LOW_COMPATIBILITY: 'No matches found with 75%+ compatibility',
  STORAGE_ERROR: 'Unable to access profile data. Please try again later.',
  GENERAL_ERROR: 'An error occurred while finding matches'
} as const;