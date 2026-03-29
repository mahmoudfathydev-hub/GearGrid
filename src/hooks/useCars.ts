import { useAppSelector } from "../hooks";
import { selectAllCars, selectCarIds } from "../store/Cars/CarsSlice";
import { Cars } from "../store/Cars/types";

export const useCars = () => {
  const cars = useAppSelector(selectAllCars);
  const carIds = useAppSelector(selectCarIds);
  const loading = useAppSelector((state) => state.cars.loading);
  const error = useAppSelector((state) => state.cars.error);

  // Create a lookup object for efficient access
  const carsMap = cars.reduce(
    (acc, car) => {
      acc[car.id] = car;
      return acc;
    },
    {} as Record<number, Cars>,
  );

  const carById = (id: number): Cars | undefined => carsMap[id];

  return { cars, carById, carIds, loading, error };
};
