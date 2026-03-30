"use client";

import React from "react";

interface FormLayoutProps {
  children: React.ReactNode;
}

export const FormLayout: React.FC<FormLayoutProps> = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};
