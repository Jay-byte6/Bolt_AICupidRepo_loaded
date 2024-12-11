import React, { useState } from 'react';
import { Search, Scan, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeCompatibility } from '../services/openai';

const ProfileScanner = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleScan = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const mockProfile = {
        name: query,
        interests: ["technology", "travel", "music"],
        personalityTraits: ["outgoing", "creative", "ambitious"]
      };

      const analysis = await analyzeCompatibility(mockProfile);
      setResult(analysis);
    } catch (error) {
      console.error('Error scanning profile:', error);
      setResult('Error analyzing profile. Please try again.');
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
          Scan any profile to get instant compatibility insights and personalized relationship advice
        </p>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter profile name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-r-lg disabled:bg-indigo-400"
            onClick={handleScan}
            disabled={loading || !query.trim()}
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

        {result && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h3 className="font-semibold mb-2">Analysis Result:</h3>
            <p className="text-gray-700 whitespace-pre-line">{result}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileScanner;