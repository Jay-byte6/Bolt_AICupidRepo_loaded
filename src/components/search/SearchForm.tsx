import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchFormProps {
  cupidId: string;
  loading: boolean;
  onCupidIdChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  cupidId,
  loading,
  onCupidIdChange,
  onSearch
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter CUPID ID (e.g., CUPID-12345678)"
        value={cupidId}
        onChange={(e) => onCupidIdChange(e.target.value.toUpperCase())}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
      />
      <button 
        className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-r-lg disabled:bg-indigo-400"
        onClick={onSearch}
        disabled={loading || !cupidId.trim()}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          'Check Compatibility'
        )}
      </button>
    </div>
  );
};