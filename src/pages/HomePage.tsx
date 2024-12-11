import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Brain, MessageCircleHeart } from 'lucide-react';
import CupidSearch from '../components/CupidSearch';
import LatestMembers from '../components/home/LatestMembers';

function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-12 h-12 text-rose-500 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">AI Cupid</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find your perfect match with our advanced AI-powered compatibility analysis
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div 
          onClick={() => navigate('/personality-analysis')}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 duration-200"
        >
          <Brain className="w-10 h-10 text-indigo-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Personality Analysis</h3>
          <p className="text-gray-600">Advanced AI assessment of personality traits and compatibility factors</p>
        </div>
        <div 
          onClick={() => navigate('/smart-matching')}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 duration-200"
        >
          <Sparkles className="w-10 h-10 text-rose-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
          <p className="text-gray-600">Find your most compatible matches with our AI algorithm</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <MessageCircleHeart className="w-10 h-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Relationship Insights</h3>
          <p className="text-gray-600">Detailed compatibility insights and relationship guidance</p>
        </div>
      </div>

      <div className="mb-16">
        <LatestMembers />
      </div>

      <div className="mb-16">
        <CupidSearch />
      </div>
    </main>
  );
}

export default HomePage;