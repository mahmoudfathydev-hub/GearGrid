"use client";

import { AddCarForm } from "../components/add-car/components/AddCarForm";

export default function AddCarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                Add New Vehicle
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Expand your inventory with a new premium vehicle
              </p>
            </div>
          </div>
        </div>

        <AddCarForm />
      </div>
    </div>
  );
}
