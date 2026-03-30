"use client";

import React from "react";

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const FormLayout: React.FC<FormLayoutProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};
