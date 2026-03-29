"use client";

import React from "react";
import CarTypeFilter from "./filters/CarTypeFilter";
import BrandFilter from "./filters/BrandFilter";
import PriceRangeFilter from "./filters/PriceRangeFilter";
import FuelTypeFilter from "./filters/FuelTypeFilter";
import SortDropdown from "./filters/SortDropdown";

export type FilterState = {
  type?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  fuel?: string;
  sort?: string;
};

export type FilterOptions = {
  brands: string[];
  carTypes: string[];
  fuelTypes: string[];
};

interface FilteringAndSortingProps {
  value: FilterState;
  onChange: (filters: FilterState) => void;
  resultsCount?: number;
  options?: FilterOptions;
}

export default function FilteringAndSorting({
  value,
  onChange,
  resultsCount,
  options,
}: FilteringAndSortingProps) {
  const updateFilter = (
    key: keyof FilterState,
    val: string | number | undefined,
  ) => {
    onChange({ ...value, [key]: val || undefined });
  };

  const activeFiltersCount = [
    value.type,
    value.brand,
    value.fuel,
    value.minPrice,
    value.maxPrice,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const clearAll = () => {
    onChange({ sort: value.sort });
  };

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4 lg:p-5">
      <div className="flex flex-col max-w-7xl mx-auto gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex flex-wrap gap-3 flex-1">
            <CarTypeFilter
              value={value.type}
              onChange={(val) => updateFilter("type", val)}
              options={options?.carTypes}
            />
            <BrandFilter
              value={value.brand}
              onChange={(val) => updateFilter("brand", val)}
              options={options?.brands}
            />
            <PriceRangeFilter
              minPrice={value.minPrice}
              maxPrice={value.maxPrice}
              onMinPriceChange={(val) => updateFilter("minPrice", val)}
              onMaxPriceChange={(val) => updateFilter("maxPrice", val)}
            />
            <FuelTypeFilter
              value={value.fuel}
              onChange={(val) => updateFilter("fuel", val)}
              options={options?.fuelTypes}
            />
          </div>

          <div className="hidden lg:block w-px h-8 bg-gray-300 dark:bg-gray-600" />

          <SortDropdown
            value={value.sort}
            onChange={(val) => updateFilter("sort", val)}
          />
        </div>

        {(hasActiveFilters || resultsCount !== undefined) && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {resultsCount !== undefined && (
                <span className="text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{resultsCount}</span>{" "}
                  {resultsCount === 1 ? "car" : "cars"} found
                </span>
              )}
              {hasActiveFilters && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
