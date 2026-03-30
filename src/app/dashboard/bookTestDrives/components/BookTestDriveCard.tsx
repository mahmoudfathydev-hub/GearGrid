"use client";

import React from "react";
import { BookTestDrive } from "@/store/bookTestDrive/types";
import { Phone, Calendar, User } from "lucide-react";

interface BookTestDriveCardProps {
  booking: BookTestDrive;
}

export const BookTestDriveCard: React.FC<BookTestDriveCardProps> = ({
  booking,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Simple phone formatting for US numbers
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const getStatusBadge = () => {
    const daysSinceBooking = Math.floor(
      (new Date().getTime() - new Date(booking.created_at).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (daysSinceBooking <= 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          New
        </span>
      );
    } else if (daysSinceBooking <= 7) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          Recent
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
          Older
        </span>
      );
    }
  };

  const getTransmissionIcon = (transmission: string) => {
    return transmission.toLowerCase() === "automatic" ? (
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-xs text-gray-600 dark:text-gray-400">Auto</span>
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className="text-xs text-gray-600 dark:text-gray-400">Manual</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {booking.name}
              </h3>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
              <Phone className="w-4 h-4 mr-2" />
              {formatPhoneNumber(booking.number)}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            {getTransmissionIcon(booking.transmissions)}
          </div>

          <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Preferred Date
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(booking.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Booking ID: #{String(booking.id).slice(-6)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(booking.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
