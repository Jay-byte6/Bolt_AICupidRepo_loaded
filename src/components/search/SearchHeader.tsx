import React from 'react';

export const SearchHeader: React.FC = () => {
  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">Check Compatibility</h2>
      <p className="text-gray-600">
        Enter a CUPID ID to check your compatibility with another registered user
      </p>
    </div>
  );
};