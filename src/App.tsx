import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PersonalityAnalysis from './pages/PersonalityAnalysis';
import SmartMatching from './components/SmartMatching';
import Navbar from './components/Navbar';
import Breadcrumb from './components/Breadcrumb';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumb />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/personality-analysis" element={<PersonalityAnalysis />} />
            <Route path="/smart-matching" element={<SmartMatching />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;