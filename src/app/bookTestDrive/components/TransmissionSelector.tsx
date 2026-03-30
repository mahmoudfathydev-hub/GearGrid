"use client";

import React from "react";

interface TransmissionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TransmissionSelector: React.FC<TransmissionSelectorProps> = ({
  value,
  onChange,
}) => {
  const transmissions = [
    { value: "Automatic", label: "Automatic" },
    { value: "Manual", label: "Manual" },
  ];

  return (
    <div>
      <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Transmission Type <span className="text-red-500 ml-1">*</span>
      </label>
      <select
        id="transmission"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select transmission</option>
        {transmissions.map((transmission) => (
          <option key={transmission.value} value={transmission.value}>
            {transmission.label}
          </option>
        ))}
      </select>
    </div>
  );
};
