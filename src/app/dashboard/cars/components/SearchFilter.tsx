import React from "react";
import { CarFilters } from "../types/cars";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

interface SearchFilterProps {
  filters: CarFilters;
  availableBrands: string[];
  onFiltersChange: (filters: Partial<CarFilters>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  availableBrands,
  onFiltersChange,
  onReset,
  hasActiveFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ brand: e.target.value });
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ availability: e.target.value as any });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    onFiltersChange({ sortBy: sortBy as any, sortOrder: sortOrder as any });
  };

  const toggleSortOrder = () => {
    onFiltersChange({
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by car name, brand, or description..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Brand Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filters.brand}
              onChange={handleBrandChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="">All Brands</option>
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <select
            value={filters.availability}
            onChange={handleAvailabilityChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>

          {/* Sort Options */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={handleSortChange}
              className="px-3 py-2 outline-none appearance-none bg-white"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="brand-asc">Brand (A-Z)</option>
              <option value="brand-desc">Brand (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="px-2 py-2 hover:bg-gray-50 transition-colors"
              title="Toggle sort order"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 text-gray-700"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-xs">
            {filters.search && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Search: "{filters.search}"
              </span>
            )}
            {filters.brand && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Brand: {filters.brand}
              </span>
            )}
            {filters.availability !== "all" && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Status: {filters.availability}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
