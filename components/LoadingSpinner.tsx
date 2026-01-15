import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <p className="mt-4 text-blue-300 font-medium animate-pulse">Generative AI is processing...</p>
    <p className="mt-1 text-xs text-gray-500">This may take up to 20 seconds</p>
  </div>
);