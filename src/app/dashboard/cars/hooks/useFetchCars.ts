"use client";

import { useState, useEffect } from "react";
import { Car, PaginationInfo } from "../types/cars";
import { getCars } from "../../../../lib/supabase";

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
          image: dbCar.image,
          description: dbCar.description,
          year: dbCar.year,
          mileage: dbCar.mileage,
          fuel_type: dbCar.fuelType,
          transmission: dbCar.transmission,
          color: dbCar.color,
          availability_status: "available", // Default status since DB doesn't have this field
          created_at: new Date().toISOString(), // Default since DB doesn't have this field
        }));

        // Apply filters
        let filteredCars = mappedCars;

        if (filters.brand) {
          filteredCars = filteredCars.filter(
            (car) => car.brand.toLowerCase() === filters.brand!.toLowerCase(),
          );
        }

        if (filters.availability && filters.availability !== "all") {
          filteredCars = filteredCars.filter(
            (car) => car.availability_status === filters.availability,
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
          image: dbCar.image,
          description: dbCar.description,
          year: dbCar.year,
          mileage: dbCar.mileage,
          fuel_type: dbCar.fuelType,
          transmission: dbCar.transmission,
          color: dbCar.color,
          availability_status: "available",
          created_at: new Date().toISOString(),
        }));

        let filteredCars = mappedCars;

        if (filters.brand) {
          filteredCars = filteredCars.filter(
            (car) => car.brand.toLowerCase() === filters.brand!.toLowerCase(),
          );
        }

        if (filters.availability && filters.availability !== "all") {
          filteredCars = filteredCars.filter(
            (car) => car.availability_status === filters.availability,
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
