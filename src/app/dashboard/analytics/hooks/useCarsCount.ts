"use client";

import { useState, useEffect } from "react";
import { CarStats } from "../data/mockAnalytics";

export const useCarsCount = () => {
  const [data, setData] = useState<CarStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarsCount = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 300));

        const response = await fetch("/api/analytics/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars data");
        }
        const carsData = await response.json();
        setData(carsData);
      } catch (err) {
        console.error("Error fetching cars data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        const { mockCarStats } = await import("../data/mockAnalytics");
        setData(mockCarStats);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsCount();
  }, []);

  const refetch = () => {
    const fetchCarsCount = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars data");
        }
        const carsData = await response.json();
        setData(carsData);
      } catch (err) {
        console.error("Error refetching cars data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCarsCount();
  };

  return { data, loading, error, refetch };
};
