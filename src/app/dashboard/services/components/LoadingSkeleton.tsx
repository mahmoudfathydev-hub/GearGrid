"use client";

import React from "react";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>

          {/* Table skeleton */}
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
