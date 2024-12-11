import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { MatchedProfile } from '../../types/profile';

interface Props {
  profile: MatchedProfile;
  onViewProfile: () => void;
}

const UserCard = ({ profile, onViewProfile }: Props) => {
  const { personalInfo, compatibility, cupidId } = profile;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={profile.image}
          alt={personalInfo.fullName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-rose-500 mr-1" fill="currentColor" />
            <span className="font-semibold">{Math.round(compatibility.overall * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">
          {personalInfo.fullName}, {personalInfo.age}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {personalInfo.location} • {personalInfo.occupation}
        </p>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {profile.preferences.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            ID: {cupidId}
          </span>
          <button
            onClick={onViewProfile}
            className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View Profile
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;