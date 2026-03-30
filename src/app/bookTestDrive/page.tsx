"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { BookTestDriveForm, SuccessMessage, FormLayout } from "./components";
import {
  selectBookingSuccess,
  selectBookingError,
  resetForm,
} from "@/store/bookTestDrive/bookTestDriveSelectors";
import { useEffect } from "react";

export default function BookTestDrivePage() {
  const dispatch = useAppDispatch();
  const success = useAppSelector(selectBookingSuccess);
  const error = useAppSelector(selectBookingError);

  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book a Test Drive
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Schedule your test drive experience
          </p>
        </div>

        <FormLayout>
          {success ? <SuccessMessage /> : <BookTestDriveForm />}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </FormLayout>
      </div>
    </div>
  );
}
