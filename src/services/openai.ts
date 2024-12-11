import OpenAI from 'openai';
import { storeProfile, getCurrentProfile } from './profileStorage';
import type { Profile } from './profileStorage';
import type { CompatibilityScore } from '../types/profile';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeCompatibility = async (profile1: Profile, profile2: Profile): Promise<CompatibilityScore> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert AI matchmaker and relationship analyst. Analyze the compatibility between two profiles and provide detailed insights. Focus on:
            1. Emotional Compatibility (40%): Love languages, communication styles, emotional expression
            2. Intellectual Compatibility (30%): Shared interests, education, decision-making styles
            3. Lifestyle Compatibility (30%): Relationship goals, family plans, daily routines
            Return a JSON object with scores (0-1) and detailed analysis.`
        },
        {
          role: "user",
          content: JSON.stringify({
            profile1: {
              personality: profile1.psychologicalProfile,
              behavior: profile1.behavioralInsights,
              goals: profile1.relationshipGoals,
              preferences: profile1.preferences
            },
            profile2: {
              personality: profile2.psychologicalProfile,
              behavior: profile2.behavioralInsights,
              goals: profile2.relationshipGoals,
              preferences: profile2.preferences
            }
          })
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    
    return {
      overall: analysis.overall || 0,
      emotional: analysis.emotional || 0,
      intellectual: analysis.intellectual || 0,
      lifestyle: analysis.lifestyle || 0,
      details: {
        strengths: analysis.strengths || [],
        challenges: analysis.challenges || []
      }
    };
  } catch (error) {
    console.error('OpenAI compatibility analysis error:', error);
    // Fallback to local compatibility calculation
    return calculateLocalCompatibility(profile1, profile2);
  }
};

export const storeUserProfile = async (profileData: any): Promise<{ success: boolean; cupidId: string }> => {
  try {
    // Validate required sections
    const requiredSections = ['personalInfo', 'preferences', 'psychologicalProfile', 'relationshipGoals', 'behavioralInsights', 'dealbreakers'];
    const missingSections = requiredSections.filter(section => !profileData[section] || Object.keys(profileData[section]).length === 0);

    if (missingSections.length > 0) {
      throw new Error(`Please complete all sections: ${missingSections.join(', ')}`);
    }

    // Store profile
    const profile = storeProfile(profileData);
    return { success: true, cupidId: profile.cupidId };
  } catch (error: any) {
    console.error('Profile storage error:', error);
    throw new Error(error.message || 'Failed to save profile');
  }
};

// Local fallback compatibility calculation
const calculateLocalCompatibility = (profile1: Profile, profile2: Profile): CompatibilityScore => {
  const emotional = calculateEmotionalScore(profile1, profile2);
  const intellectual = calculateIntellectualScore(profile1, profile2);
  const lifestyle = calculateLifestyleScore(profile1, profile2);
  
  return {
    overall: (emotional * 0.4 + intellectual * 0.3 + lifestyle * 0.3),
    emotional,
    intellectual,
    lifestyle,
    details: {
      strengths: generateStrengths(profile1, profile2),
      challenges: generateChallenges(profile1, profile2)
    }
  };
};

const calculateEmotionalScore = (p1: Profile, p2: Profile): number => {
  let score = 0;
  if (p1.behavioralInsights.loveLanguage === p2.behavioralInsights.loveLanguage) score += 0.3;
  if (p1.psychologicalProfile.communicationStyle === p2.psychologicalProfile.communicationStyle) score += 0.3;
  if (p1.behavioralInsights.socialBattery === p2.behavioralInsights.socialBattery) score += 0.2;
  if (p1.behavioralInsights.stressResponse === p2.behavioralInsights.stressResponse) score += 0.2;
  return score;
};

const calculateIntellectualScore = (p1: Profile, p2: Profile): number => {
  let score = 0;
  const sharedInterests = p1.preferences.interests.filter(i => p2.preferences.interests.includes(i));
  score += Math.min(sharedInterests.length / p1.preferences.interests.length, 0.4);
  if (p1.preferences.educationPreference === p2.preferences.educationPreference) score += 0.3;
  if (p1.behavioralInsights.decisionMaking === p2.behavioralInsights.decisionMaking) score += 0.3;
  return score;
};

const calculateLifestyleScore = (p1: Profile, p2: Profile): number => {
  let score = 0;
  if (p1.relationshipGoals.relationshipType === p2.relationshipGoals.relationshipType) score += 0.3;
  if (p1.relationshipGoals.familyPlans === p2.relationshipGoals.familyPlans) score += 0.3;
  if (p1.relationshipGoals.timeline === p2.relationshipGoals.timeline) score += 0.2;
  if (p1.preferences.preferredDistance === p2.preferences.preferredDistance) score += 0.2;
  return score;
};

const generateStrengths = (p1: Profile, p2: Profile): string[] => {
  const strengths = [];
  if (p1.behavioralInsights.loveLanguage === p2.behavioralInsights.loveLanguage) {
    strengths.push('Matching love languages enhance emotional connection');
  }
  if (p1.psychologicalProfile.communicationStyle === p2.psychologicalProfile.communicationStyle) {
    strengths.push('Compatible communication styles promote understanding');
  }
  if (p1.relationshipGoals.relationshipType === p2.relationshipGoals.relationshipType) {
    strengths.push('Aligned relationship goals and expectations');
  }
  return strengths;
};

const generateChallenges = (p1: Profile, p2: Profile): string[] => {
  const challenges = [];
  if (p1.behavioralInsights.loveLanguage !== p2.behavioralInsights.loveLanguage) {
    challenges.push('Different love languages require understanding and adaptation');
  }
  if (p1.psychologicalProfile.communicationStyle !== p2.psychologicalProfile.communicationStyle) {
    challenges.push('Different communication styles may require extra effort');
  }
  if (p1.relationshipGoals.relationshipType !== p2.relationshipGoals.relationshipType) {
    challenges.push('Different relationship expectations need discussion');
  }
  return challenges;
};