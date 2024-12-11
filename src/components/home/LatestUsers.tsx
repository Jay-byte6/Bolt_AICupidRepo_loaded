import React, { useState, useEffect } from 'react';
import { Users, Heart } from 'lucide-react';
import { getAllRegisteredProfiles, getCurrentProfile } from '../../services/profileStorage';
import { findMatchByCupidId } from '../../services/matchingService';
import { Profile, MatchedProfile } from '../../types/profile';
import UserCard from './UserCard';
import CompatibilityInsights from '../compatibility/CompatibilityInsights';

const LatestUsers = () => {
  const [latestUsers, setLatestUsers] = useState<MatchedProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MatchedProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestUsers();
  }, []);

  const loadLatestUsers = async () => {
    try {
      const currentProfile = getCurrentProfile();
      const allProfiles = getAllRegisteredProfiles()
        .filter(profile => profile.cupidId !== currentProfile?.cupidId)
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6);

      const matchedProfiles = await Promise.all(
        allProfiles.map(async (profile) => {
          try {
            return await findMatchByCupidId(profile.cupidId);
          } catch (error) {
            console.error('Error matching profile:', error);
            return null;
          }
        })
      );

      setLatestUsers(matchedProfiles.filter((profile): profile is MatchedProfile => profile !== null));
    } catch (error) {
      console.error('Error loading latest users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-.3s]" />
          <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce [animation-delay:-.5s]" />
        </div>
      </div>
    );
  }

  if (latestUsers.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-8 mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold">Latest Members</h2>
        </div>
        <div className="flex items-center text-rose-500">
          <Heart className="w-5 h-5 mr-1" />
          <span className="font-medium">{latestUsers.length} new matches</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestUsers.map((profile) => (
          <UserCard
            key={profile.cupidId}
            profile={profile}
            onViewProfile={() => setSelectedProfile(profile)}
          />
        ))}
      </div>

      {selectedProfile && (
        <CompatibilityInsights
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </section>
  );
};

export default LatestUsers;