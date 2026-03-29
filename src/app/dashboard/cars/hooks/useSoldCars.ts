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

interface CarData {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_urls: string[];
  description: string;
  year_of_manufacture?: number;
  miles?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  created_at: string;
}

interface SoldCarData {
  id: string;
  car_id: string;
  sold_at: string;
  created_at: string;
}

interface UseSoldCarsOptions {
  page?: number;
  itemsPerPage?: number;
  filter?: {
    brand?: string;
    model?: string;
    year?: number;
    price?: {
      min?: number;
      max?: number;
    };
  };
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

        // First get sold cars
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

        // Then fetch car details for each sold car
        const carIds = soldCarsData
          ?.map((item: SoldCarData) => item.car_id)
          .filter(Boolean);
        let carsData: Record<string, CarData> = {};

        if (carIds.length > 0) {
          const { data: cars } = await supabase
            .from("Cars")
            .select("*")
            .in("id", carIds);

          // Create a lookup map
          carsData = (cars || []).reduce(
            (acc: Record<string, CarData>, car: CarData) => {
              acc[car.id] = car;
              return acc;
            },
            {},
          );
        }

        // Transform the data - use the fetched car data
        const transformedSoldCars: SoldCar[] = (soldCarsData || []).map(
          (item: SoldCarData) => {
            console.log("Processing sold car item:", item);
            const carData = carsData[item.car_id]; // Get car from lookup
            console.log("Car data from lookup:", carData);
            console.log("Image URLs:", carData?.image_urls);

            // Handle image URLs - it might be a string or array
            let imageUrl = "";
            if (carData?.image_urls) {
              if (Array.isArray(carData.image_urls)) {
                imageUrl = carData.image_urls[0];
              } else if (typeof carData.image_urls === "string") {
                // If it's a string that looks like JSON, try to parse it
                try {
                  const parsed = JSON.parse(carData.image_urls);
                  imageUrl = Array.isArray(parsed) ? parsed[0] : "";
                } catch {
                  imageUrl = carData.image_urls;
                }
              }
            }

            const car: Car = {
              id: carData?.id?.toString() || item.car_id || "",
              name: carData?.name || "Unknown Car",
              brand: carData?.brand || "Unknown Brand",
              price: carData?.price || 0,
              image:
                imageUrl && imageUrl.startsWith("[")
                  ? "" // Skip malformed URLs starting with [
                  : imageUrl?.startsWith("http")
                    ? imageUrl
                    : `https://kknqhkkwffxflwfxheqv.supabase.co/storage/v1/object/public/${imageUrl}`,
              description: carData?.description || "",
              year: carData?.year_of_manufacture,
              mileage: carData?.miles,
              fuel_type: carData?.fuel_type,
              transmission: carData?.transmission,
              color: carData?.color,
              availability_status: "sold",
              created_at:
                carData?.created_at ||
                item.created_at ||
                new Date().toISOString(),
            };

            console.log("Mapped car data:", car);

            return {
              id: item.id,
              car_id: item.car_id,
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

        // First get sold cars
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

        // Then fetch car details for each sold car
        const carIds = soldCarsData
          ?.map((item: SoldCarData) => item.car_id)
          .filter(Boolean);
        let carsData: Record<string, CarData> = {};

        if (carIds.length > 0) {
          const { data: cars } = await supabase
            .from("Cars")
            .select("*")
            .in("id", carIds);

          // Create a lookup map
          carsData = (cars || []).reduce(
            (acc: Record<string, CarData>, car: CarData) => {
              acc[car.id] = car;
              return acc;
            },
            {},
          );
        }

        // Transform the data - use the fetched car data
        const transformedSoldCars: SoldCar[] = (soldCarsData || []).map(
          (item: SoldCarData) => {
            console.log("Processing sold car item:", item);
            const carData = carsData[item.car_id]; // Get car from lookup
            console.log("Car data from lookup:", carData);
            console.log("Image URLs:", carData?.image_urls);

            // Handle image URLs - it might be a string or array
            let imageUrl = "";
            if (carData?.image_urls) {
              if (Array.isArray(carData.image_urls)) {
                imageUrl = carData.image_urls[0];
              } else if (typeof carData.image_urls === "string") {
                // If it's a string that looks like JSON, try to parse it
                try {
                  const parsed = JSON.parse(carData.image_urls);
                  imageUrl = Array.isArray(parsed) ? parsed[0] : "";
                } catch {
                  imageUrl = carData.image_urls;
                }
              }
            }

            const car: Car = {
              id: carData?.id?.toString() || item.car_id || "",
              name: carData?.name || "Unknown Car",
              brand: carData?.brand || "Unknown Brand",
              price: carData?.price || 0,
              image:
                imageUrl && imageUrl.startsWith("[")
                  ? "" // Skip malformed URLs starting with [
                  : imageUrl?.startsWith("http")
                    ? imageUrl
                    : `https://kknqhkkwffxflwfxheqv.supabase.co/storage/v1/object/public/${imageUrl}`,
              description: carData?.description || "",
              year: carData?.year_of_manufacture,
              mileage: carData?.miles,
              fuel_type: carData?.fuel_type,
              transmission: carData?.transmission,
              color: carData?.color,
              availability_status: "sold",
              created_at:
                carData?.created_at ||
                item.created_at ||
                new Date().toISOString(),
            };

            console.log("Mapped car data:", car);

            return {
              id: item.id,
              car_id: item.car_id,
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
