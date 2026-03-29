import { useAppSelector } from "../hooks";
import { selectAllSoldCars, selectSoldCarById, selectSoldCarIds } from "../store/Sold_Cars/Sold_CarsSlice";

export const useSoldCars = () => {
  const soldCars = useAppSelector(selectAllSoldCars);
  const soldCarById = (id: number) => useAppSelector((state) => selectSoldCarById(state, id));
  const soldCarIds = useAppSelector(selectSoldCarIds);

  return { soldCars, soldCarById, soldCarIds };
};