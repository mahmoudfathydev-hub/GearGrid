"use client";

import React from "react";

interface IconInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const IconInput: React.FC<IconInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
      />
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Enter icon name (e.g., "car", "wrench") or icon class (e.g., "fas fa-car")
      </p>
    </div>
  );
};
