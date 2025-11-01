
import React from 'react';

const AnimeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-96 bg-gray-700"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
        <div className="flex flex-wrap gap-1">
            <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
            <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCardSkeleton;
