import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { findMatchByCupidId } from '../services/matching/matchingService';
import CompatibilityInsights from './compatibility/CompatibilityInsights';
import ErrorAlert from './ErrorAlert';
import { MatchedProfile } from '../types/profile';
import { SearchForm } from './search/SearchForm';
import { SearchHeader } from './search/SearchHeader';

const CupidSearch: React.FC = () => {
  const [cupidId, setCupidId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<MatchedProfile | null>(null);

  const handleSearch = async () => {
    if (!cupidId.trim()) {
      setError('Please enter a valid CUPID ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const match = await findMatchByCupidId(cupidId);
      setMatchedProfile(match);
    } catch (error: any) {
      setError(error.message || 'Failed to find profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <SearchHeader />
      
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <SearchForm
        cupidId={cupidId}
        loading={loading}
        onCupidIdChange={setCupidId}
        onSearch={handleSearch}
      />

      {matchedProfile && (
        <CompatibilityInsights
          profile={matchedProfile}
          onClose={() => {
            setMatchedProfile(null);
            setCupidId('');
          }}
        />
      )}
    </section>
  );
};

export default CupidSearch;