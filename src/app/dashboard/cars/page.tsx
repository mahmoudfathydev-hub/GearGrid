"use client";

import React, { useState } from "react";
import { Inventory } from "./components/Inventory";

export default function CarsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCarAdded = () => {
    // Trigger inventory refresh when a new car is added
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Car Inventory</h1>
          <p className="text-gray-600 mt-2">
            Manage and browse your available vehicles
          </p>
        </div>

        {/* Main Content - Full Width Inventory */}
        <div className="w-full">
          <Inventory refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
