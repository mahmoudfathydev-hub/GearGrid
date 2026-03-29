"use client";

import { useState, useEffect } from "react";
import { Car, PaginationInfo } from "../types/cars";
import { getCars, checkIfCarSold } from "../../../../lib/supabase";

// Helper function to validate image URLs
const validateImageUrl = (image?: string, images?: string[]): string => {
  // Try single image first
  if (image && typeof image === "string" && image.trim() !== "") {
    // Check if it's a JSON array string
    if (image.startsWith("[")) {
      try {
        const parsed = JSON.parse(image);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch (e) {
        console.log("Failed to parse JSON array");
      }
    }

    // Skip malformed URLs that start with { or other invalid characters
    if (image.startsWith("{") || !image.includes("/")) {
      return "/images/1.png";
    }
    return image;
  }

  // Try images array
  if (images && Array.isArray(images) && images.length > 0) {
    const firstImage = images[0];
    if (
      firstImage &&
      typeof firstImage === "string" &&
      firstImage.trim() !== ""
    ) {
      if (
        firstImage.startsWith("[") ||
        firstImage.startsWith("{") ||
        !firstImage.includes("/")
      ) {
        return "/images/1.png";
      }
      return firstImage;
    }
  }

  return "/images/1.png";
};

interface FetchCarsOptions {
  page?: number;
  itemsPerPage?: number;
  filters?: {
    brand?: string;
    availability?: string;
  };
}

export const useFetchCars = (options: FetchCarsOptions = {}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  const { page = 1, itemsPerPage = 12, filters = {} } = options;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cars from Supabase
        const dbCars = await getCars();

        // Map database cars to our Car interface
        const mappedCars: Car[] = dbCars.map((dbCar) => ({
          id: dbCar.id,
          name: dbCar.model,
          brand: dbCar.brand,
          price: dbCar.price,
          image: validateImageUrl(dbCar.image, dbCar.images),
          images: dbCar.images,
          description: dbCar.description,
          year: dbCar.year,
          mileage: dbCar.mileage,
          fuel_type: dbCar.fuelType,
          transmission: dbCar.transmission,
          color: dbCar.color,
          created_at: new Date().toISOString(), // Default since DB doesn't have this field
        }));

        // Filter out sold cars
        const availableCars = [];
        for (const car of mappedCars) {
          const isSold = await checkIfCarSold(Number(car.id));
          if (!isSold) {
            availableCars.push(car);
          }
        }

        // Apply filters
        let filteredCars = availableCars;

        if (filters.brand) {
          filteredCars = filteredCars.filter(
            (car) => car.brand.toLowerCase() === filters.brand!.toLowerCase(),
          );
        }

        if (filters.availability && filters.availability !== "all") {
          filteredCars = filteredCars.filter(
            (car) =>
              car.availability_status === filters.availability ||
              (!car.availability_status &&
                filters.availability === "available"),
          );
        }

        // Apply pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCars = filteredCars.slice(startIndex, endIndex);

        setCars(paginatedCars);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(filteredCars.length / itemsPerPage),
          totalItems: filteredCars.length,
          itemsPerPage,
        });
      } catch (err) {
        console.error("Error fetching cars from database:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch cars");

        // Set empty state on error
        setCars([]);
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

    fetchCars();
  }, [page, itemsPerPage, filters.brand, filters.availability]);

  const refetch = () => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const dbCars = await getCars();

        // Map and filter logic (same as above)
        const mappedCars: Car[] = dbCars.map((dbCar) => ({
          id: dbCar.id,
          name: dbCar.model,
          brand: dbCar.brand,
          price: dbCar.price,
          image: validateImageUrl(dbCar.image, dbCar.images),
          images: dbCar.images,
          description: dbCar.description,
          year: dbCar.year,
          mileage: dbCar.mileage,
          fuel_type: dbCar.fuelType,
          transmission: dbCar.transmission,
          color: dbCar.color,
          created_at: new Date().toISOString(),
        }));

        // Filter out sold cars
        const availableCars = [];
        for (const car of mappedCars) {
          const isSold = await checkIfCarSold(Number(car.id));
          if (!isSold) {
            availableCars.push(car);
          }
        }

        let filteredCars = availableCars;

        if (filters.brand) {
          filteredCars = filteredCars.filter(
            (car) => car.brand.toLowerCase() === filters.brand!.toLowerCase(),
          );
        }

        if (filters.availability && filters.availability !== "all") {
          filteredCars = filteredCars.filter(
            (car) =>
              car.availability_status === filters.availability ||
              (!car.availability_status &&
                filters.availability === "available"),
          );
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedCars = filteredCars.slice(startIndex, endIndex);

        setCars(paginatedCars);
        setPagination((prev) => ({
          ...prev,
          totalItems: filteredCars.length,
          totalPages: Math.ceil(filteredCars.length / itemsPerPage),
        }));
      } catch (err) {
        console.error("Error refetching cars:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  };

  const addCar = (newCar: Car) => {
    setCars((prevCars) => [newCar, ...prevCars]);
    setPagination((prev) => ({
      ...prev,
      totalItems: prev.totalItems + 1,
    }));
  };

  return {
    cars,
    loading,
    error,
    pagination,
    refetch,
    addCar,
  };
};
