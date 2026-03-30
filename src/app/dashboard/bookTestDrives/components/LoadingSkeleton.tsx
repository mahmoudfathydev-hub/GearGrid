"use client";

import React from "react";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
