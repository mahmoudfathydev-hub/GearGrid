"use client";

import { Car } from "lucide-react";

export function ComparePageHeader() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
        <Car className="w-8 h-8" />
        Car Comparison Tool
      </h1>
      <p className="text-lg text-gray-600">
        Compare up to 3 cars side-by-side to make the best choice
      </p>
    </div>
  );
}
