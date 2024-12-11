import React, { useState } from 'react';
import { Search, Scan, ArrowRight, Loader2 } from 'lucide-react';
import { findMatchByCupidId } from '../../services/matchingService';
import { findProfileByUsername } from '../../services/profileStorage';
import CompatibilityCard from '../compatibility/CompatibilityCard';
import CompatibilityInsights from '../compatibility/CompatibilityInsights';
import ErrorAlert from '../ErrorAlert';
import { MatchedProfile } from '../../types/profile';
import { useNavigate } from 'react-router-dom';

const ProfileScanner = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<MatchedProfile | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  const handleScan = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a CUPID ID or username');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let profile;
      if (searchQuery.startsWith('CUPID-')) {
        profile = await findMatchByCupidId(searchQuery);
      } else {
        const foundProfile = findProfileByUsername(searchQuery);
        if (foundProfile) {
          profile = await findMatchByCupidId(foundProfile.cupidId);
        }
      }

      if (profile) {
        setMatchedProfile(profile);
      } else {
        setError('No registered user found with this CUPID ID or username');
      }
    } catch (error: any) {
      if (error.message === 'Please complete your personality analysis first') {
        setError('Please complete your personality analysis before scanning profiles');
        setTimeout(() => {
          navigate('/personality-analysis');
        }, 2000);
      } else {
        setError(error.message || 'Error scanning profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Scan className="w-8 h-8 text-indigo-500 mr-2" />
          <h2 className="text-2xl font-bold">Profile Scanner</h2>
        </div>
        
        <p className="text-center text-gray-600 mb-8">
          Enter a CUPID ID or username to get instant compatibility insights
        </p>
        
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter CUPID ID or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleScan();
              }
            }}
          />
          <button 
            className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-r-lg disabled:bg-indigo-400"
            onClick={handleScan}
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                Scan Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>

        {matchedProfile && (
          <div className="mt-8">
            <CompatibilityCard
              profile={matchedProfile}
              onViewInsights={() => setShowInsights(true)}
            />
          </div>
        )}

        {showInsights && matchedProfile && (
          <CompatibilityInsights
            profile={matchedProfile}
            onClose={() => setShowInsights(false)}
          />
        )}
      </div>
    </section>
  );
};

export default ProfileScanner;