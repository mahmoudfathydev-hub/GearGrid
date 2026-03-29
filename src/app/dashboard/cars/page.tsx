"use client";

import React, { useState } from "react";
import { Inventory } from "./components/Inventory";
import { deleteAllSoldCars } from "@/lib/supabase";

export default function CarsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleCarAdded = () => {
    // Trigger inventory refresh when a new car is added
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteSoldCars = async () => {
    if (
      !confirm(
        "Are you sure you want to delete all sold cars from the Cars table? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsCleaning(true);
    try {
      const result = await deleteAllSoldCars();
      if (result.success) {
        alert(result.message);
        setRefreshTrigger((prev) => prev + 1);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert(
        "Failed to delete sold cars: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Car Inventory</h1>
            <p className="text-gray-600 mt-2">
              Manage and browse your available vehicles
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteSoldCars}
              disabled={isCleaning}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCleaning ? "Cleaning..." : "Delete Sold Cars"}
            </button>
            <button
              onClick={async () => {
                // Test sellCar function with car ID 1
                const { sellCar } = await import("@/lib/supabase");
                const result = await sellCar(1);
                console.log("Test sellCar result:", result);
                alert(JSON.stringify(result, null, 2));
                setRefreshTrigger((prev) => prev + 1);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Test Sell Car ID 1
            </button>
          </div>
        </div>

        {/* Main Content - Full Width Inventory */}
        <div className="w-full">
          <Inventory refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
