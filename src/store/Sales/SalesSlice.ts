import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../index";
import { Cars } from "../Cars/types";
import { SoldCars } from "../Sold_Cars/types";
import { supabase } from "../../lib/supabaseClient";
import { fetchSoldCars } from "../Sold_Cars/Sold_CarsSlice";

export interface CreateSaleRequest {
  carId: number;
}

export interface CreateSaleResponse {
  success: boolean;
  message: string;
}


export const createSaleTransaction = createAsyncThunk<
  CreateSaleResponse,
  CreateSaleRequest,
  { rejectValue: string; state: RootState; dispatch: AppDispatch }
>(
  "sales/createSaleTransaction",
  async ({ carId }, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log(" Starting createSaleTransaction for car ID:", carId);

      
      const { sellCar } = await import("../../lib/supabase");
      console.log(" Imported sellCar function");

      const result = await sellCar(carId);
      console.log(" sellCar result:", result);

      if (!result.success) {
        console.log(" sellCar failed:", result.message);
        return rejectWithValue(result.message || "Failed to sell car");
      }

      
      console.log(" Refreshing sold cars data...");
      dispatch(fetchSoldCars());

      
      console.log(" Sale transaction completed successfully");
      return {
        success: true,
        message: result.message || "Car sold successfully",
      };
    } catch (error) {
      console.error(" Unexpected error in createSaleTransaction:", error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unexpected error occurred during sale transaction",
      );
    }
  },
);


interface SalesState {
  loading: boolean;
  error: string | null;
  lastSale: CreateSaleResponse | null;
}

const initialState: SalesState = {
  loading: false,
  error: null,
  lastSale: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSaleError: (state) => {
      state.error = null;
    },
    clearLastSale: (state) => {
      state.lastSale = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSaleTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSaleTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSale = action.payload;
        state.error = null;
      })
      .addCase(createSaleTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create sale transaction";
        state.lastSale = null;
      });
  },
});


export const { clearSaleError, clearLastSale } = salesSlice.actions;


export default salesSlice.reducer;
