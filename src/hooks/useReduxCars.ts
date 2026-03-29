import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import { fetchCars } from "../store/Cars/CarsSlice";
import { fetchSoldCars } from "../store/Sold_Cars/Sold_CarsSlice";
import { Cars } from "../store/Cars/types";
import { SoldCars } from "../store/Sold_Cars/types";
import { Car } from "../app/dashboard/cars/types/cars";

const mapToDashboardCar = (reduxCar: Cars): Car => ({
  id: reduxCar.id.toString(),
  name: reduxCar.name,
  brand: reduxCar.brand,
  price: reduxCar.price,
  image: Array.isArray(reduxCar.image_urls)
    ? reduxCar.image_urls[0]
    : (reduxCar.image_urls as string | undefined),
  description: reduxCar.description,
  year: reduxCar.year_of_manufacture,
  mileage: reduxCar.miles,
  fuel_type: reduxCar.fuel_type,
  transmission: reduxCar.transmission,
  color: reduxCar.color,
  created_at: reduxCar.created_at,
});

export const useReduxCars = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cars = useSelector((state: RootState) => state.cars);
  const soldCars = useSelector((state: RootState) => state.soldCars);

  React.useEffect(() => {
    dispatch(fetchCars());
    dispatch(fetchSoldCars());
  }, [dispatch]);

  const availableCars = React.useMemo(() => {
    const soldCarIds = new Set(
      Object.values(soldCars.entities).map((car) => car?.car_id),
    );
    return Object.values(cars.entities)
      .filter((car) => car && !soldCarIds.has(car.id.toString()))
      .map(mapToDashboardCar);
  }, [cars.entities, soldCars.entities]);

  const refetch = () => {
    dispatch(fetchCars());
    dispatch(fetchSoldCars());
  };

  const stats = React.useMemo(
    () => ({
      total: availableCars.length,
      available: availableCars.length,
      reserved: 0,
      sold: Object.keys(soldCars.entities).length,
    }),
    [availableCars.length, soldCars.entities],
  );

  return {
    cars: availableCars,
    loading: cars.loading || soldCars.loading,
    error: cars.error || soldCars.error,
    refetch,
    allCars: Object.values(cars.entities).map(mapToDashboardCar),
    soldCars: Object.values(soldCars.entities),
    stats,
  };
};
