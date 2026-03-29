import { useAppSelector } from "../hooks";
import {
  selectAllSoldCars,
  selectSoldCarIds,
} from "../store/Sold_Cars/Sold_CarsSlice";
import { SoldCars } from "../store/Sold_Cars/types";

export const useSoldCars = () => {
  const soldCars = useAppSelector(selectAllSoldCars);
  const soldCarIds = useAppSelector(selectSoldCarIds);
  const loading = useAppSelector((state) => state.soldCars.loading);
  const error = useAppSelector((state) => state.soldCars.error);

  // Create a lookup object for efficient access
  const soldCarsMap = soldCars.reduce(
    (acc, soldCar) => {
      acc[soldCar.id] = soldCar;
      return acc;
    },
    {} as Record<number, SoldCars>,
  );

  const soldCarById = (id: number): SoldCars | undefined => soldCarsMap[id];

  return { soldCars, soldCarById, soldCarIds, loading, error };
};
