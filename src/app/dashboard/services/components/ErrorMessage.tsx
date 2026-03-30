"use client";

import React from "react";
import { useAppDispatch } from "@/hooks";
import { fetchServices } from "@/store/services/servicesSelectors";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const dispatch = useAppDispatch();

  const handleRetry = () => {
    dispatch(fetchServices());
  };

  return (
    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 006. 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707a1 1 0 00-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
            Error loading services
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{message}</p>
          </div>
          <div className="mt-3">
            <button
              onClick={handleRetry}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
