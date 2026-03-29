"use client";

import React from "react";
import { RecordSaleForm } from "./components/RecordSaleForm";
import { Car as CarIcon } from "lucide-react";

export default function RecordSalePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CarIcon className="w-8 h-8 text-green-600" />
            Record New Sale
          </h1>
          <p className="text-gray-600 mt-2">
            Mark a car as sold and move it to the sold inventory
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <RecordSaleForm />
        </div>
      </div>
    </div>
  );
}
