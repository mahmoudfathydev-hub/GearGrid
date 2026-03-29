import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import { fetchSoldCars } from "../store/Sold_Cars/Sold_CarsSlice";
import { fetchCars } from "../store/Cars/CarsSlice";
import { SoldCars } from "../store/Sold_Cars/types";
import { Cars } from "../store/Cars/types";
import { Car } from "../app/dashboard/cars/types/cars";

// Mapper to convert Cars to dashboard Car type
const mapToDashboardCar = (reduxCar: Cars): Car => ({
  id: reduxCar.id.toString(),
  name: reduxCar.name,
  brand: reduxCar.brand,
  price: reduxCar.price,
  image: reduxCar.image_urls || undefined,
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

  // Fetch sold cars and all cars on mount
  React.useEffect(() => {
    dispatch(fetchSoldCars());
    dispatch(fetchCars());
  }, [dispatch]);

  // Combine sold car records with car details
  const soldCarsWithDetails = React.useMemo(() => {
    const carsMap = new Map(
      Object.values(cars.entities).map((car) => [car.id.toString(), car]),
    );

    return Object.values(soldCars.entities)
      .filter((soldCar): soldCar is SoldCars => soldCar !== undefined)
      .map((soldCar) => {
        const carDetails = carsMap.get(soldCar.car_id);

        if (carDetails) {
          // If we have car details, use them
          return {
            ...soldCar,
            car: mapToDashboardCar(carDetails),
          };
        } else {
          // If car details are not found (deleted from Cars table), create a fallback
          return {
            ...soldCar,
            car: {
              id: soldCar.car_id,
              name: "Sold Car",
              brand: "Unknown",
              price: 0,
              created_at: soldCar.created_at,
            } as Car,
          };
        }
      });
  }, [soldCars.entities, cars.entities]);

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
