import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-300% animate-shimmer"></div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="animate-pulse">
        <div className="bg-gray-300 rounded-lg w-12 h-12 mb-4"></div>
        <div className="bg-gray-300 rounded h-4 w-3/4 mb-2"></div>
        <div className="bg-gray-300 rounded h-3 w-full mb-1"></div>
        <div className="bg-gray-300 rounded h-3 w-2/3"></div>
      </div>
    </div>
  );
};

export const SkeletonStats: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="animate-pulse text-center">
        <div className="bg-gray-300 rounded-lg w-12 h-12 mx-auto mb-4"></div>
        <div className="bg-gray-300 rounded h-8 w-20 mx-auto mb-2"></div>
        <div className="bg-gray-300 rounded h-4 w-24 mx-auto mb-2"></div>
        <div className="bg-gray-300 rounded h-3 w-32 mx-auto"></div>
      </div>
    </div>
  );
};