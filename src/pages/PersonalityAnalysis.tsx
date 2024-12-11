import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PersonalInfo from '../components/analysis/PersonalInfo';
import Preferences from '../components/analysis/Preferences';
import PsychologicalProfile from '../components/analysis/PsychologicalProfile';
import RelationshipGoals from '../components/analysis/RelationshipGoals';
import BehavioralInsights from '../components/analysis/BehavioralInsights';
import Dealbreakers from '../components/analysis/Dealbreakers';
import { storeUserProfile } from '../services/openai';
import ErrorAlert from '../components/ErrorAlert';

const steps = [
  { id: 1, name: 'Personal Information', key: 'personalInfo' },
  { id: 2, name: 'Preferences', key: 'preferences' },
  { id: 3, name: 'Psychological Profile', key: 'psychologicalProfile' },
  { id: 4, name: 'Relationship Goals', key: 'relationshipGoals' },
  { id: 5, name: 'Behavioral Insights', key: 'behavioralInsights' },
  { id: 6, name: 'Dealbreakers', key: 'dealbreakers' }
];

const PersonalityAnalysis = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    preferences: {},
    psychologicalProfile: {},
    relationshipGoals: {},
    behavioralInsights: {},
    dealbreakers: {}
  });

  const validateCurrentSection = () => {
    const currentSection = steps[currentStep - 1];
    const sectionData = formData[currentSection.key as keyof typeof formData];
    
    // Basic validation - check if section has data
    if (!sectionData || Object.keys(sectionData).length === 0) {
      setError(`Please complete all fields in ${currentSection.name}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      setError(null);
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      // Validate current section
      if (!validateCurrentSection()) {
        return;
      }

      // Validate all sections
      for (const step of steps) {
        const sectionData = formData[step.key as keyof typeof formData];
        if (!sectionData || Object.keys(sectionData).length === 0) {
          throw new Error(`Please complete ${step.name} section before submitting`);
        }
      }

      const result = await storeUserProfile(formData);
      if (result.success) {
        navigate('/smart-matching');
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error: any) {
      setError(error.message || 'Error saving profile. Please try again.');
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo data={formData.personalInfo} updateData={(data) => updateFormData('personalInfo', data)} />;
      case 2:
        return <Preferences data={formData.preferences} updateData={(data) => updateFormData('preferences', data)} />;
      case 3:
        return <PsychologicalProfile data={formData.psychologicalProfile} updateData={(data) => updateFormData('psychologicalProfile', data)} />;
      case 4:
        return <RelationshipGoals data={formData.relationshipGoals} updateData={(data) => updateFormData('relationshipGoals', data)} />;
      case 5:
        return <BehavioralInsights data={formData.behavioralInsights} updateData={(data) => updateFormData('behavioralInsights', data)} />;
      case 6:
        return <Dealbreakers data={formData.dealbreakers} updateData={(data) => updateFormData('dealbreakers', data)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Personality Analysis</h1>
        <p className="text-gray-600">Complete this comprehensive assessment to find your perfect match</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              {step.id !== steps.length && (
                <div
                  className={`h-1 w-12 md:w-24 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          {steps.map((step) => (
            <div key={step.id} className="w-24 text-center">
              {step.name}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center px-6 py-3 rounded-lg ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        
        {currentStep === steps.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            <Check className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalityAnalysis;