"use client";

import React from "react";

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
}) => {
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Preferred Date <span className="text-red-500 ml-1">*</span>
      </label>
      <input
        type="date"
        id="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={today}
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};
