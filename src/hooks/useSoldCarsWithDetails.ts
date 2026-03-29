import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import { fetchSoldCars } from "../store/Sold_Cars/Sold_CarsSlice";
import { fetchCars } from "../store/Cars/CarsSlice";
import { SoldCars } from "../store/Sold_Cars/types";
import { Cars } from "../store/Cars/types";
import { Car } from "../app/dashboard/cars/types/cars";


const mapToDashboardCar = (reduxCar: Cars): Car => ({
  id: reduxCar.id.toString(),
  name: reduxCar.name,
  brand: reduxCar.brand,
  price: reduxCar.price,
  image: Array.isArray(reduxCar.image_urls) ? reduxCar.image_urls[0] : reduxCar.image_urls || undefined,
  description: reduxCar.description,
  year: reduxCar.year_of_manufacture,
  mileage: reduxCar.miles,
  fuel_type: reduxCar.fuel_type,
  transmission: reduxCar.transmission,
  color: reduxCar.color,
  created_at: reduxCar.created_at,
});

export const useSoldCarsWithDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const soldCars = useSelector((state: RootState) => state.soldCars);
  const cars = useSelector((state: RootState) => state.cars);


  React.useEffect(() => {
    dispatch(fetchSoldCars());
    dispatch(fetchCars());
  }, [dispatch]);


  const soldCarsWithDetails = React.useMemo(() => {
    return Object.values(soldCars.entities)
      .filter((soldCar): soldCar is SoldCars => soldCar !== undefined)
      .map((soldCar) => {

        if (soldCar.name && soldCar.brand) {

          return {
            ...soldCar,
            car: {
              id: soldCar.car_id || soldCar.id?.toString(),
              name: soldCar.name,
              brand: soldCar.brand,
              price: soldCar.price || 0,
              image: Array.isArray(soldCar.image_urls) ? soldCar.image_urls[0] : soldCar.image_urls || undefined,
              images: Array.isArray(soldCar.image_urls)
                ? soldCar.image_urls
                : typeof soldCar.image_urls === "string"
                  ? [soldCar.image_urls]
                  : [],
              description: soldCar.description,
              year: soldCar.year_of_manufacture,
              mileage: soldCar.miles,
              fuel_type: soldCar.fuel_type,
              transmission: soldCar.transmission,
              color: soldCar.color,
              created_at: soldCar.created_at,
            } as Car,
          };
        } else {

          return {
            ...soldCar,
            car: {
              id: soldCar.car_id,
              name: soldCar.name || "Sold Car",
              brand: soldCar.brand || "Unknown",
              price: soldCar.price || 0,
              created_at: soldCar.created_at,
            } as Car,
          };
        }
      });
  }, [soldCars.entities]);

  return {
    soldCars: soldCarsWithDetails,
    loading: soldCars.loading || cars.loading,
    error: soldCars.error || cars.error,
    refetch: () => {
      dispatch(fetchSoldCars());
      dispatch(fetchCars());
    },
  };
};
