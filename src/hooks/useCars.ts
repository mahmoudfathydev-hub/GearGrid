import { useAppSelector } from "../hooks";
import { selectAllCars, selectCarById, selectCarIds } from "../store/Cars/CarsSlice";

export const useCars = () => {
  const cars = useAppSelector(selectAllCars);
  const carById = (id: number) => useAppSelector((state) => selectCarById(state, id));
  const carIds = useAppSelector(selectCarIds);

  return { cars, carById, carIds };
};