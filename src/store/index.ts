import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import brandReducer from "./Brand/BrandSlice";
import carsReducer from "./Cars/CarsSlice";
import transmissionsReducer from "./Transmissions/TransmissionsSlice";
import fuelTypeReducer from "./Fuel_Type/Fuel_TypeSlice";
import userReducer from "./User/UserSlice";
import soldCarsReducer from "./Sold_Cars/Sold_CarsSlice";
import carTypeReducer from "./Car_Type/Car_TypeSlice";
import monthlySalesReducer from "./Monthly_Sales/Monthly_SalesSlice";
import salesReducer from "./Sales/SalesSlice";
import bookTestDriveReducer from "./bookTestDrive/bookTestDriveSlice";
import servicesReducer from "./services/servicesSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    brand: brandReducer,
    cars: carsReducer,
    transmissions: transmissionsReducer,
    fuelType: fuelTypeReducer,
    user: userReducer,
    soldCars: soldCarsReducer,
    carType: carTypeReducer,
    monthlySales: monthlySalesReducer,
    sales: salesReducer,
    bookTestDrive: bookTestDriveReducer,
    services: servicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
