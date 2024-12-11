import React, { useState } from 'react';
import { Heart, User, Bell, LogOut } from 'lucide-react';
import { getCurrentProfile, clearProfileData } from '../services/profileStorage';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profile = getCurrentProfile();

  const handleLogout = () => {
    clearProfileData();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-rose-500" />
            <span className="ml-2 text-xl font-semibold">AI Cupid</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowProfile(!showProfile)}
              >
                <User className="h-6 w-6 text-gray-600" />
              </button>

              {showProfile && profile && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Profile Details</h3>
                      <button
                        onClick={handleLogout}
                        className="text-rose-600 hover:text-rose-700 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cupid ID</p>
                        <p className="text-gray-900">{profile.cupidId}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Personal Info</p>
                        <p className="text-gray-900">
                          {profile.personalInfo.fullName}, {profile.personalInfo.age}
                        </p>
                        <p className="text-gray-600">
                          {profile.personalInfo.location} • {profile.personalInfo.occupation}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Interests</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.preferences.interests.map((interest: string, index: number) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Looking For</p>
                        <p className="text-gray-900">{profile.relationshipGoals.relationshipType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;