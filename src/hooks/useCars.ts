import { useAppSelector } from "../hooks";
import {
  selectAllCars,
  selectCarById,
  selectCarIds,
  selectCarsLoading,
  selectCarsError,
} from "../store/Cars/CarsSlice";

export const useCars = () => {
  const cars = useAppSelector(selectAllCars);
  const carById = (id: number) =>
    useAppSelector((state) => selectCarById(state, id));
  const carIds = useAppSelector(selectCarIds);
  const loading = useAppSelector(selectCarsLoading);
  const error = useAppSelector(selectCarsError);

  return { cars, carById, carIds, loading, error };
};
