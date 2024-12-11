import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../types/profile';

const indianFirstNames = {
  male: ['Aarav', 'Arjun', 'Vihaan', 'Aditya', 'Kabir', 'Rohan', 'Vivaan', 'Dev', 'Ishaan', 'Reyansh'],
  female: ['Aanya', 'Diya', 'Zara', 'Ananya', 'Myra', 'Aadhya', 'Aaradhya', 'Avni', 'Kiara', 'Riya']
};

const indianLastNames = [
  'Patel', 'Sharma', 'Kumar', 'Singh', 'Verma', 'Gupta', 'Shah', 'Mehta', 'Reddy', 'Kapoor'
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const occupations = [
  'Software Engineer', 'Doctor', 'Entrepreneur', 'Architect', 'Teacher',
  'Data Scientist', 'Marketing Manager', 'Financial Analyst', 'Designer', 'Consultant'
];

const interests = [
  'Yoga', 'Cricket', 'Bollywood', 'Reading', 'Travel',
  'Photography', 'Cooking', 'Music', 'Dancing', 'Art',
  'Meditation', 'Technology', 'Fitness', 'Movies', 'Food'
];

const generateDummyProfile = (
  preferredGender: string,
  minAge: number = 21,
  maxAge: number = 35
): Profile => {
  const gender = preferredGender === 'all' 
    ? Math.random() > 0.5 ? 'male' : 'female'
    : preferredGender;

  const firstName = indianFirstNames[gender as keyof typeof indianFirstNames][
    Math.floor(Math.random() * indianFirstNames[gender as keyof typeof indianFirstNames].length)
  ];
  const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

  const selectedInterests = [...interests]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return {
    cupidId: `CUPID-${uuidv4().slice(0, 8).toUpperCase()}`,
    personalInfo: {
      fullName: `${firstName} ${lastName}`,
      age,
      gender,
      location: indianCities[Math.floor(Math.random() * indianCities.length)],
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      relationshipHistory: 'never-married',
      lifestyle: 'Active and health-conscious'
    },
    preferences: {
      interests: selectedInterests,
      minAge: Math.max(18, age - 5),
      maxAge: age + 5,
      preferredDistance: '50',
      educationPreference: 'bachelors',
      sexualOrientation: 'straight',
      genderPreference: gender === 'male' ? 'female' : 'male'
    },
    psychologicalProfile: {
      extroversion: Math.random() * 10,
      openness: Math.random() * 10,
      agreeableness: Math.random() * 10,
      conscientiousness: Math.random() * 10,
      emotionalStability: Math.random() * 10,
      communicationStyle: 'direct',
      conflictResolution: 'collaborative'
    },
    relationshipGoals: {
      relationshipType: 'long-term',
      timeline: 'few-months',
      familyPlans: 'want-children',
      relationshipValues: 'Trust, respect, and understanding'
    },
    behavioralInsights: {
      loveLanguage: 'words',
      socialBattery: 'moderate',
      stressResponse: 'talk',
      decisionMaking: 'logical'
    },
    dealbreakers: {
      dealbreakers: ['Smoking', 'Dishonesty'],
      dealbreakersFlexibility: 'moderate'
    },
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
};

export const generateDummyProfiles = (
  count: number,
  preferredGender: string,
  minAge?: number,
  maxAge?: number
): Profile[] => {
  return Array(count)
    .fill(null)
    .map(() => generateDummyProfile(preferredGender, minAge, maxAge));
};