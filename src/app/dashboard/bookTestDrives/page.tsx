"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectBookTestDrives, selectBookTestDrivesLoading, selectBookTestDrivesError, fetchBookTestDrives } from "@/store/bookTestDrive/bookTestDriveSelectors";
import { BookTestDriveCard } from "./components/BookTestDriveCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { ErrorMessage } from "./components/ErrorMessage";

export default function BookTestDrivesPage() {
  const dispatch = useAppDispatch();
  const bookTestDrives = useAppSelector(selectBookTestDrives);
  const loading = useAppSelector(selectBookTestDrivesLoading);
  const error = useAppSelector(selectBookTestDrivesError);

  useEffect(() => {
    dispatch(fetchBookTestDrives());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Test Drive Bookings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and view all test drive requests
          </p>
        </div>

        {loading && <LoadingSkeleton />}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookTestDrives.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2v4a2 2 0 01-2 2H9a2 2 0 01-2-2V5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No test drive bookings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    No test drive requests have been submitted yet.
                  </p>
                </div>
              </div>
            ) : (
              bookTestDrives.map((booking) => (
                <BookTestDriveCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
