import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-cyan-200 dark:border-cyan-800 border-t-cyan-600 dark:border-t-cyan-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white dark:bg-gray-900 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Loading</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your weight tracking data...</p>
    </div>
  );
};

export default LoadingState;