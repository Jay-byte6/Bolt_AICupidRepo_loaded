import React, { useState, useEffect } from 'react';
import { Users, Heart } from 'lucide-react';
import { getAllRegisteredProfiles, getCurrentProfile } from '../../services/profileStorage';
import { findMatchByCupidId } from '../../services/matching';
import { MatchedProfile } from '../../types/profile';
import MemberCard from './MemberCard';
import CompatibilityInsights from '../compatibility/CompatibilityInsights';
import { generateDummyProfiles } from '../../utils/dummyProfileGenerator';
import ErrorAlert from '../ErrorAlert';

const LatestMembers = () => {
  const [latestMembers, setLatestMembers] = useState<MatchedProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MatchedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLatestMembers();
  }, []);

  const loadLatestMembers = async () => {
    try {
      const currentProfile = getCurrentProfile();
      if (!currentProfile) {
        setLoading(false);
        return;
      }

      let profiles = getAllRegisteredProfiles()
        .filter(profile => profile.cupidId !== currentProfile.cupidId)
        .filter(profile => {
          const createdAt = new Date(profile.createdAt);
          const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
          return createdAt > tenMinutesAgo;
        });

      // Generate dummy profiles if needed
      if (profiles.length < 6) {
        const dummyProfiles = generateDummyProfiles(
          6 - profiles.length,
          currentProfile.preferences.genderPreference || 'all',
          currentProfile.preferences.minAge,
          currentProfile.preferences.maxAge
        );
        profiles = [...profiles, ...dummyProfiles];
      }

      // Get compatibility scores for all profiles
      const matchPromises = profiles.slice(0, 6).map(async (profile) => {
        try {
          return await findMatchByCupidId(profile.cupidId);
        } catch (error) {
          console.error('Error matching profile:', error);
          return null;
        }
      });

      const matchedProfiles = (await Promise.all(matchPromises))
        .filter((profile): profile is MatchedProfile => profile !== null)
        .sort((a, b) => b.compatibility.overall - a.compatibility.overall);

      setLatestMembers(matchedProfiles);
      setError(null);
    } catch (error: any) {
      console.error('Error loading latest members:', error);
      setError(error.message || 'Failed to load latest members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-.3s]" />
          <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce [animation-delay:-.5s]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <ErrorAlert message={error} onClose={() => setError(null)} />
      </div>
    );
  }

  if (!latestMembers || latestMembers.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold">Latest Members</h2>
        </div>
        <div className="flex items-center text-rose-500">
          <Heart className="w-5 h-5 mr-1" />
          <span className="font-medium">{latestMembers.length} potential matches</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestMembers.map((profile) => (
          <MemberCard
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

export default LatestMembers;