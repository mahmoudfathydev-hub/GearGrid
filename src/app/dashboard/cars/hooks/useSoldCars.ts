"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import { Car } from "../types/cars";

interface SoldCar {
  id: string;
  car_id: string;
  sold_at: string;
  car: Car;
}

interface SoldCarsResponse {
  soldCars: SoldCar[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface UseSoldCarsOptions {
  page?: number;
  itemsPerPage?: number;
}

export const useSoldCars = (options: UseSoldCarsOptions = {}) => {
  const [soldCars, setSoldCars] = useState<SoldCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
  });

  const { page = 1, itemsPerPage = 12 } = options;

  useEffect(() => {
    const fetchSoldCars = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        // Get sold cars with car details
        const {
          data: soldCarsData,
          error: fetchError,
          count,
        } = await supabase
          .from("Sold_Cars")
          .select("*", { count: "exact" })
          .order("sold_at", { ascending: false })
          .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

        if (fetchError) {
          throw new Error(`Failed to fetch sold cars: ${fetchError.message}`);
        }

        console.log("Raw sold cars data:", soldCarsData);

        // Transform the data - the car details are already in the sold car record
        const transformedSoldCars: SoldCar[] = (soldCarsData || []).map(
          (item: any) => {
            console.log("Processing sold car item:", item);
            console.log("Item price:", item.price);
            console.log("Item image_urls:", item.image_urls);

            // Map the database car data to our Car interface
            const car: Car = {
              id: item.id?.toString() || "",
              name: item.name || "",
              brand: item.brand || "",
              price: item.price || 0,
              image: item.image_urls?.[0] || "",
              description: item.description || "",
              year: item.year_of_manufacture,
              mileage: item.miles,
              fuel_type: item.fuel_type,
              transmission: item.transmission,
              color: item.color,
              availability_status: "sold",
              created_at: item.created_at || new Date().toISOString(),
            };

            console.log("Mapped car data:", car);

            return {
              id: item.id,
              car_id: item.car_id || item.id?.toString(),
              sold_at: item.sold_at,
              car,
            };
          },
        );

        console.log("Transformed sold cars:", transformedSoldCars);

        const totalItems = count || 0;

        setSoldCars(transformedSoldCars);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(totalItems / itemsPerPage),
          totalItems,
          itemsPerPage,
        });
      } catch (err) {
        console.error("Error fetching sold cars:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch sold cars",
        );
        setSoldCars([]);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSoldCars();
  }, [page, itemsPerPage]);

  const refetch = () => {
    const fetchSoldCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        // Get sold cars with car details
        const {
          data: soldCarsData,
          error: fetchError,
          count,
        } = await supabase
          .from("Sold_Cars")
          .select("*", { count: "exact" })
          .order("sold_at", { ascending: false })
          .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

        if (fetchError) {
          throw new Error(`Failed to fetch sold cars: ${fetchError.message}`);
        }

        console.log("Raw sold cars data:", soldCarsData);

        // Transform the data - the car details are already in the sold car record
        const transformedSoldCars: SoldCar[] = (soldCarsData || []).map(
          (item: any) => {
            console.log("Processing sold car item:", item);
            console.log("Item price:", item.price);
            console.log("Item image_urls:", item.image_urls);

            // Map the database car data to our Car interface
            const car: Car = {
              id: item.id?.toString() || "",
              name: item.name || "",
              brand: item.brand || "",
              price: item.price || 0,
              image: item.image_urls?.[0] || "",
              description: item.description || "",
              year: item.year_of_manufacture,
              mileage: item.miles,
              fuel_type: item.fuel_type,
              transmission: item.transmission,
              color: item.color,
              availability_status: "sold",
              created_at: item.created_at || new Date().toISOString(),
            };

            console.log("Mapped car data:", car);

            return {
              id: item.id,
              car_id: item.car_id || item.id?.toString(),
              sold_at: item.sold_at,
              car,
            };
          },
        );

        console.log("Transformed sold cars:", transformedSoldCars);

        const totalItems = count || 0;

        setSoldCars(transformedSoldCars);
        setPagination((prev) => ({
          ...prev,
          totalItems,
          totalPages: Math.ceil(totalItems / itemsPerPage),
        }));
      } catch (err) {
        console.error("Error refetching sold cars:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch sold cars",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSoldCars();
  };

  return {
    soldCars,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useSoldCarsCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { count, error: fetchError } = await supabase
        .from("Sold_Cars")
        .select("*", { count: "exact", head: true });

      if (fetchError) {
        throw new Error(
          `Failed to fetch sold cars count: ${fetchError.message}`,
        );
      }

      setCount(count || 0);
    } catch (err) {
      console.error("Error fetching sold cars count:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch count");
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return { count, loading, error, refetch: fetchCount };
};
