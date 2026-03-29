"use client";

import { useState, useEffect } from "react";
import { InstallmentCustomer } from "../../types/sales";

export interface InstallmentAnalytics {
  total_customers: number;
  active_installments: number;
  total_receivable: number;
  monthly_revenue: number;
  average_months: number;
  completion_rate: number;
}

export const useInstallmentAnalytics = () => {
  const [data, setData] = useState<InstallmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallmentData = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await fetch("/api/analytics/installments");
        if (!response.ok) {
          throw new Error("Failed to fetch installment analytics");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error("Error fetching installment analytics:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // Fallback to mock data
        setData({
          total_customers: 156,
          active_installments: 142,
          total_receivable: 2450000,
          monthly_revenue: 185000,
          average_months: 18,
          completion_rate: 78.5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstallmentData();
  }, []);

  const refetch = () => {
    const fetchInstallmentData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/installments");
        if (!response.ok) {
          throw new Error("Failed to fetch installment analytics");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error("Error refetching installment analytics:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchInstallmentData();
  };

  return { data, loading, error, refetch };
};
