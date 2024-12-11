import { Profile } from '../../../types/profile';

export const validateProfileCompleteness = (profile: Profile): boolean => {
  if (!profile || !profile.cupidId) return false;

  const requiredSections = [
    'personalInfo',
    'preferences',
    'psychologicalProfile',
    'relationshipGoals',
    'behavioralInsights',
    'dealbreakers'
  ];

  return requiredSections.every(section => {
    const sectionData = profile[section as keyof Profile];
    return sectionData && Object.keys(sectionData).length > 0;
  });
};