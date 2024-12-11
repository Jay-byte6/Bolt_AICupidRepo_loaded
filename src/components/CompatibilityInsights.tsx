import React, { useEffect, useState } from 'react';
import { X, Heart, MessageCircle, Gift, Clock, Star, Loader2, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { MatchedProfile } from '../services/matchingService';
import ErrorAlert from './ErrorAlert';

interface Props {
  profile: MatchedProfile;
  onClose: () => void;
}

const CompatibilityInsights: React.FC<Props> = ({ profile, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) {
    return null;
  }

  const { compatibility } = profile;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-rose-500 mr-2" fill="currentColor" />
              <h2 className="text-2xl font-bold">Compatibility Analysis</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <img
                src={profile.image}
                alt={profile.personalInfo.fullName}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {profile.personalInfo.fullName}, {profile.personalInfo.age}
              </h3>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" />
                <span className="text-lg font-semibold">{Math.round(compatibility.overall * 100)}% Compatible</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 text-indigo-500 mr-2" />
                  <span>{profile.personalInfo.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{profile.personalInfo.occupation}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Compatibility Analysis */}
            <section>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                Relationship Dynamics
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-3 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Strengths
                  </h5>
                  <ul className="space-y-2">
                    {compatibility.details.strengths.map((strength, index) => (
                      <li key={index} className="text-green-700 flex items-start">
                        <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                          {index + 1}
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Growth Areas
                  </h5>
                  <ul className="space-y-2">
                    {compatibility.details.challenges.map((challenge, index) => (
                      <li key={index} className="text-yellow-700 flex items-start">
                        <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                          {index + 1}
                        </span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Compatibility Scores */}
            <section>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="w-5 h-5 text-rose-500 mr-2" />
                Compatibility Scores
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h5 className="font-medium text-indigo-800 mb-2">Emotional</h5>
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round(compatibility.emotional * 100)}%
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-medium text-purple-800 mb-2">Intellectual</h5>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(compatibility.intellectual * 100)}%
                  </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h5 className="font-medium text-rose-800 mb-2">Lifestyle</h5>
                  <div className="text-2xl font-bold text-rose-600">
                    {Math.round(compatibility.lifestyle * 100)}%
                  </div>
                </div>
              </div>
            </section>

            {/* Recommendations */}
            <section>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Gift className="w-5 h-5 text-purple-500 mr-2" />
                Connection Tips
              </h4>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li className="text-purple-700 flex items-start">
                    <Clock className="w-4 h-4 mr-2 mt-1" />
                    Take time to understand each other's communication styles
                  </li>
                  <li className="text-purple-700 flex items-start">
                    <Heart className="w-4 h-4 mr-2 mt-1" />
                    Focus on shared interests and values
                  </li>
                  <li className="text-purple-700 flex items-start">
                    <MessageCircle className="w-4 h-4 mr-2 mt-1" />
                    Practice active listening and open communication
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityInsights;