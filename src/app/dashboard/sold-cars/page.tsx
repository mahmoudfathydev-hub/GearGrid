"use client";

import React, { useState } from "react";
import { useSoldCars } from "../cars/hooks/useSoldCars";
import { CarCard } from "../cars/components/CarCard";
import { Pagination } from "../cars/components/Pagination";
import { Car as CarIcon, Calendar, DollarSign } from "lucide-react";

export default function SoldCarsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { soldCars, loading, error, pagination, refetch } = useSoldCars({
    page: currentPage,
    itemsPerPage: 12,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CarIcon className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading sold cars
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CarIcon className="w-6 h-6 text-red-600" />
              Sold Cars
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your sold vehicles
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {pagination.totalItems}
              </div>
              <div className="text-sm text-gray-600">Total Sold Cars</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(
                  soldCars.reduce((total, soldCar) => total + soldCar.car.price, 0)
                )}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-red-800 text-sm font-medium">This Month</div>
            <div className="text-red-900 text-xl font-bold">
              {
                soldCars.filter(
                  (soldCar) =>
                    new Date(soldCar.sold_at).getMonth() ===
                      new Date().getMonth() &&
                    new Date(soldCar.sold_at).getFullYear() ===
                      new Date().getFullYear()
                ).length
              }
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-green-800 text-sm font-medium">Revenue</div>
            <div className="text-green-900 text-xl font-bold">
              {formatPrice(
                soldCars
                  .filter(
                    (soldCar) =>
                      new Date(soldCar.sold_at).getMonth() ===
                        new Date().getMonth() &&
                      new Date(soldCar.sold_at).getFullYear() ===
                        new Date().getFullYear()
                  )
                  .reduce((total, soldCar) => total + soldCar.car.price, 0)
              )}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-blue-800 text-sm font-medium">Avg Sale Price</div>
            <div className="text-blue-900 text-xl font-bold">
              {soldCars.length > 0
                ? formatPrice(
                    soldCars.reduce((total, soldCar) => total + soldCar.car.price, 0) /
                      soldCars.length
                  )
                : "$0"}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-purple-800 text-sm font-medium">Latest Sale</div>
            <div className="text-purple-900 text-xl font-bold">
              {soldCars.length > 0
                ? formatDate(soldCars[0].sold_at)
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && soldCars.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sold cars yet
          </h3>
          <p className="text-gray-600">
            When you sell cars, they will appear here for your records
          </p>
        </div>
      )}

      {/* Sold Cars Grid */}
      {!loading && soldCars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldCars.map((soldCar) => (
            <div key={soldCar.id} className="relative">
              <CarCard car={soldCar.car} />
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  SOLD
                </span>
              </div>
              <div className="mt-2 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Sold {formatDate(soldCar.sold_at)}
                  </div>
                  <div className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatPrice(soldCar.car.price)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && soldCars.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}
