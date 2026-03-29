"use client";

import { useState, useEffect } from "react";
import { UserStats } from "../data/mockAnalytics";

export const useUserStats = () => {
  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 400));

        const response = await fetch("/api/analytics/users");
        if (!response.ok) {
          throw new Error("Failed to fetch user stats");
        }
        const userData = await response.json();
        setData(userData);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        const { mockUserStats } = await import("../data/mockAnalytics");
        setData(mockUserStats);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const refetch = () => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/users");
        if (!response.ok) {
          throw new Error("Failed to fetch user stats");
        }
        const userData = await response.json();
        setData(userData);
      } catch (err) {
        console.error("Error refetching user stats:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  };

  return { data, loading, error, refetch };
};
