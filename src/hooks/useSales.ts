import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/index";
import {
  createSaleTransaction,
  clearSaleError,
  clearLastSale,
} from "../store/Sales/SalesSlice";
import { CreateSaleRequest } from "../store/Sales/types";

export const useSales = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sales = useSelector((state: RootState) => state.sales);
  const cars = useSelector((state: RootState) => state.cars);
  const soldCars = useSelector((state: RootState) => state.soldCars);

  const sellCar = async (carId: number) => {
    const result = await dispatch(createSaleTransaction({ carId }));
    return result;
  };

  const clearError = () => {
    dispatch(clearSaleError());
  };

  const clearLastSaleSuccess = () => {
    dispatch(clearLastSale());
  };

  return {
    // State
    loading: sales.loading,
    error: sales.error,
    lastSale: sales.lastSale,

    // Cars state
    cars: cars.entities,
    carsLoading: cars.loading,
    carsError: cars.error,

    // Sold cars state
    soldCars: soldCars.entities,
    soldCarsLoading: soldCars.loading,
    soldCarsError: soldCars.error,

    // Actions
    sellCar,
    clearError,
    clearLastSaleSuccess,
  };
};
