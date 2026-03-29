"use client";

import { useState, useEffect } from "react";

interface CarStats {
  total: number;
  available: number;
  reserved: number;
  sold: number;
}

export const useCarStats = () => {
  const [stats, setStats] = useState<CarStats>({
    total: 0,
    available: 0,
    reserved: 0,
    sold: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const { getCarStats } = await import("../../../../lib/supabase");
        const carStats = await getCarStats();

        setStats(carStats);
      } catch (err) {
        console.error("Error fetching car stats:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch car stats",
        );

        // Set empty state on error
        setStats({
          total: 0,
          available: 0,
          reserved: 0,
          sold: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refetch = async () => {
    try {
      setError(null);
      const { getCarStats } = await import("../../../../lib/supabase");
      const carStats = await getCarStats();
      setStats(carStats);
    } catch (err) {
      console.error("Error refetching car stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch car stats",
      );
    }
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
