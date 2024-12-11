import { Profile } from '../types/profile';
import type { CompatibilityScore } from '../types/profile';

const calculateEmotionalCompatibility = (profile1: Profile, profile2: Profile): number => {
  let score = 0;
  const maxScore = 5;
  
  // Love languages match
  if (profile1.behavioralInsights.loveLanguage === profile2.behavioralInsights.loveLanguage) {
    score += 1;
  }
  
  // Communication styles
  if (profile1.psychologicalProfile.communicationStyle === profile2.psychologicalProfile.communicationStyle) {
    score += 1;
  }
  
  // Emotional stability difference
  const stabilityDiff = Math.abs(
    profile1.psychologicalProfile.emotionalStability - 
    profile2.psychologicalProfile.emotionalStability
  );
  score += (10 - stabilityDiff) / 10;
  
  // Social battery compatibility
  if (profile1.behavioralInsights.socialBattery === profile2.behavioralInsights.socialBattery) {
    score += 1;
  }
  
  // Stress response compatibility
  if (profile1.behavioralInsights.stressResponse === profile2.behavioralInsights.stressResponse) {
    score += 1;
  }

  return score / maxScore;
};

const calculateIntellectualCompatibility = (profile1: Profile, profile2: Profile): number => {
  let score = 0;
  const maxScore = 4;
  
  // Shared interests
  const sharedInterests = profile1.preferences.interests.filter(
    interest => profile2.preferences.interests.includes(interest)
  );
  score += Math.min(sharedInterests.length / 3, 1);
  
  // Education preference match
  if (profile1.preferences.educationPreference === profile2.preferences.educationPreference) {
    score += 1;
  }
  
  // Decision making style
  if (profile1.behavioralInsights.decisionMaking === profile2.behavioralInsights.decisionMaking) {
    score += 1;
  }
  
  // Values alignment
  if (profile1.relationshipGoals.relationshipValues === profile2.relationshipGoals.relationshipValues) {
    score += 1;
  }

  return score / maxScore;
};

const calculateLifestyleCompatibility = (profile1: Profile, profile2: Profile): number => {
  let score = 0;
  const maxScore = 5;
  
  // Relationship goals
  if (profile1.relationshipGoals.relationshipType === profile2.relationshipGoals.relationshipType) {
    score += 1;
  }
  
  // Family plans
  if (profile1.relationshipGoals.familyPlans === profile2.relationshipGoals.familyPlans) {
    score += 1;
  }
  
  // Timeline alignment
  if (profile1.relationshipGoals.timeline === profile2.relationshipGoals.timeline) {
    score += 1;
  }
  
  // Location/distance preference
  if (profile1.preferences.preferredDistance === profile2.preferences.preferredDistance) {
    score += 1;
  }
  
  // Dealbreakers check
  const hasConflictingDealbreakers = profile1.dealbreakers.dealbreakers.some(
    dealbreaker => profile2.dealbreakers.dealbreakers.includes(dealbreaker)
  );
  if (!hasConflictingDealbreakers) {
    score += 1;
  }

  return score / maxScore;
};

const getCompatibilityDetails = (profile1: Profile, profile2: Profile): { strengths: string[]; challenges: string[] } => {
  const strengths: string[] = [];
  const challenges: string[] = [];

  // Analyze love languages
  if (profile1.behavioralInsights.loveLanguage === profile2.behavioralInsights.loveLanguage) {
    strengths.push('Matching love languages enhance emotional connection');
  } else {
    challenges.push('Different love languages require understanding and adaptation');
  }

  // Analyze communication styles
  if (profile1.psychologicalProfile.communicationStyle === profile2.psychologicalProfile.communicationStyle) {
    strengths.push('Compatible communication styles promote understanding');
  } else {
    challenges.push('Different communication styles may require extra effort');
  }

  // Analyze relationship goals
  if (profile1.relationshipGoals.relationshipType === profile2.relationshipGoals.relationshipType) {
    strengths.push('Aligned relationship goals and expectations');
  } else {
    challenges.push('Different relationship expectations need discussion');
  }

  // Analyze interests
  const sharedInterests = profile1.preferences.interests.filter(
    interest => profile2.preferences.interests.includes(interest)
  );
  if (sharedInterests.length > 2) {
    strengths.push('Multiple shared interests create strong bonds');
  } else {
    challenges.push('Need to explore and develop common interests');
  }

  return { strengths, challenges };
};

export const calculateCompatibilityScore = (profile1: Profile, profile2: Profile): CompatibilityScore => {
  try {
    const emotional = calculateEmotionalCompatibility(profile1, profile2);
    const intellectual = calculateIntellectualCompatibility(profile1, profile2);
    const lifestyle = calculateLifestyleCompatibility(profile1, profile2);
    
    const overall = (emotional * 0.4 + intellectual * 0.3 + lifestyle * 0.3);

    return {
      overall,
      emotional,
      intellectual,
      lifestyle,
      details: getCompatibilityDetails(profile1, profile2)
    };
  } catch (error) {
    console.error('Error calculating compatibility score:', error);
    throw new Error('Failed to calculate compatibility score');
  }
};