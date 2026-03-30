import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import themeReducer from "@/store/themeSlice";
import carsReducer from "@/store/Cars/CarsSlice";
import soldCarsReducer from "@/store/Sold_Cars/Sold_CarsSlice";
import userReducer from "@/store/User/UserSlice";

export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      cars: carsReducer,
      soldCars: soldCarsReducer,
      users: userReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const mockStoreState = {
  theme: {
    theme: "light",
  },
  cars: {
    entities: {},
    ids: [],
    status: "idle" as const,
    error: null,
  },
  soldCars: {
    entities: {},
    ids: [],
    status: "idle" as const,
    error: null,
  },
  users: {
    currentUser: null,
    users: [],
    status: "idle" as const,
    error: null,
  },
};

export const mockLoadingState = {
  ...mockStoreState,
  cars: {
    ...mockStoreState.cars,
    status: "loading" as const,
  },
};

export const mockErrorState = {
  ...mockStoreState,
  cars: {
    ...mockStoreState.cars,
    status: "failed" as const,
    error: "Failed to fetch cars",
  },
};
