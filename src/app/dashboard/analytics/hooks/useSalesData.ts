"use client";

import { useState, useEffect } from "react";
import { MonthlySalesData } from "../data/mockAnalytics";

export const useSalesData = () => {
  const [data, setData] = useState<MonthlySalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await fetch("/api/analytics/sales");
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const salesData = await response.json();
        setData(salesData);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        const { mockMonthlySales } = await import("../data/mockAnalytics");
        setData(mockMonthlySales);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const refetch = () => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/sales");
        if (!response.ok) {
          throw new Error("Failed to fetch sales data");
        }
        const salesData = await response.json();
        setData(salesData);
      } catch (err) {
        console.error("Error refetching sales data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  };

  return { data, loading, error, refetch };
};
