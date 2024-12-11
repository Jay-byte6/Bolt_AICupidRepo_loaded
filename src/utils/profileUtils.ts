export const getProfileImage = (gender: string): string => {
  const images = {
    female: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    ],
    male: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    ],
    other: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400'
    ]
  };

  const collection = gender.toLowerCase() === 'female' ? images.female : 
                    gender.toLowerCase() === 'male' ? images.male : 
                    images.other;

  return collection[Math.floor(Math.random() * collection.length)];
};