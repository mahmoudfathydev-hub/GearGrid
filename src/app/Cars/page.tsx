"use client";

import React, { useState, useEffect, useCallback } from "react";
import FilteringAndSorting, {
  FilterState,
  FilterOptions,
} from "./components/FilteringAndSorting";
import CarsSection from "./components/CarsSection";

function Page() {
  const [filters, setFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [resultsCount, setResultsCount] = useState<number | undefined>(undefined);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    carTypes: [],
    fuelTypes: [],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("search");
    if (query) setSearchQuery(query);

    const handleSearchEvent = (event: CustomEvent) => {
      setSearchQuery(event.detail);
    };

    window.addEventListener("search", handleSearchEvent as EventListener);
    return () => {
      window.removeEventListener("search", handleSearchEvent as EventListener);
    };
  }, []);

  const handleOptionsReady = useCallback((options: FilterOptions) => {
    setFilterOptions(options);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <FilteringAndSorting
        value={filters}
        onChange={setFilters}
        resultsCount={resultsCount}
        options={filterOptions}
      />
      <CarsSection
        filters={filters}
        searchQuery={searchQuery}
        onResultsCountChange={setResultsCount}
        onOptionsReady={handleOptionsReady}
      />
    </main>
  );
}

export default Page;
