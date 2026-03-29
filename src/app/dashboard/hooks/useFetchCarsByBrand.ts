import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Car } from "../types/sales";

export const useFetchCarsByBrand = (brand: string | null) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    if (!brand) {
      setCars([]);
      return;
    }

    try {
      setLoading(true);

      // Fetch cars for selected brand from Cars table
      const { data: carsData, error: carsError } = await supabase
        .from("Cars")
        .select("*")
        .eq("brand", brand)
        .order("created_at", { ascending: false });

      if (carsError) {
        throw carsError;
      }

      // Fetch sold car IDs for this brand (using text car_id)
      const { data: soldCars, error: soldError } = await supabase
        .from("Sold_Cars")
        .select("car_id")
        .in("car_id", carsData?.map((car) => car.id.toString()) || []);

      if (soldError && soldError.code !== "PGRST116") {
        // Ignore if table doesn't exist
        console.warn("Warning: Could not check sold cars:", soldError);
      }

      const soldCarIds = new Set(soldCars?.map((sold) => sold.car_id) || []);

      // Filter out sold cars and map to Car interface
      const mappedCars: Car[] =
        carsData
          ?.filter((car) => !soldCarIds.has(car.id.toString())) // Re-enabled filtering
          ?.map((car) => ({
            id: car.id.toString(),
            name: car.name,
            brand: car.brand,
            price: car.price,
            image:
              car.image_urls && Array.isArray(car.image_urls)
                ? car.image_urls[0]
                : undefined,
            description: car.description,
            availability_status: "available",
          })) || [];

      setCars(mappedCars);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cars");
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [brand]);

  return { cars, loading, error, refetch: fetchCars };
};
