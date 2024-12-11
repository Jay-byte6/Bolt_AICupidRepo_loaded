import React from 'react';
import { X, Heart, MessageCircle, Gift, Clock, Star, Sparkles } from 'lucide-react';
import { MatchedProfile } from '../../types/profile';
import CompatibilityScore from './CompatibilityScore';
import CompatibilityTips from './CompatibilityTips';

interface Props {
  profile: MatchedProfile;
  onClose: () => void;
}

const CompatibilityInsights: React.FC<Props> = ({ profile, onClose }) => {
  const { personalInfo, compatibility, cupidId } = profile;

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

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <img
                src={profile.image}
                alt={personalInfo.fullName}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {personalInfo.fullName}, {personalInfo.age}
              </h3>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" />
                <span className="text-lg font-semibold">
                  {Math.round(compatibility.overall * 100)}% Compatible
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 text-indigo-500 mr-2" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  <span>{personalInfo.occupation}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-2">
                  <span className="font-medium">CUPID ID:</span>
                  <span className="ml-2">{cupidId}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-lg font-semibold mb-4">Compatibility Breakdown</h4>
              <CompatibilityScore
                emotional={compatibility.emotional}
                intellectual={compatibility.intellectual}
                lifestyle={compatibility.lifestyle}
              />
            </section>

            <section>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                Relationship Dynamics
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-3">Strengths</h5>
                  <ul className="space-y-2">
                    {compatibility.details.strengths.map((strength, index) => (
                      <li key={`strength-${index}`} className="text-green-700 flex items-start">
                        <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs">
                          {index + 1}
                        </span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-3">Growth Areas</h5>
                  <ul className="space-y-2">
                    {compatibility.details.challenges.map((challenge, index) => (
                      <li key={`challenge-${index}`} className="text-yellow-700 flex items-start">
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

            <CompatibilityTips
              recommendations={{
                communication: [
                  "Practice active listening",
                  "Share feelings openly",
                  "Respect communication styles"
                ],
                activities: [
                  "Try new experiences together",
                  "Share hobbies and interests",
                  "Create memorable moments"
                ],
                bonding: [
                  "Build trust through consistency",
                  "Show appreciation daily",
                  "Support each other's goals"
                ]
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityInsights;