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

// Create Sale Transaction Thunk
export const createSaleTransaction = createAsyncThunk<
  CreateSaleResponse,
  CreateSaleRequest,
  { rejectValue: string; state: RootState; dispatch: AppDispatch }
>(
  "sales/createSaleTransaction",
  async ({ carId }, { rejectWithValue, getState, dispatch }) => {
    try {
      // STEP 1: Validate car exists in Redux state
      const state = getState();
      const car = state.cars.entities[carId];

      if (!car) {
        return rejectWithValue(`Car with ID ${carId} not found in Redux state`);
      }

      // STEP 2: Insert record into Sold_Cars table
      const soldCarData = {
        car_id: carId.toString(), // Convert to string as per existing type
        sold_at: new Date().toISOString(),
      };

      const { data: soldCarInsertData, error: soldCarInsertError } =
        await supabase.from("Sold_Cars").insert(soldCarData).select().single();

      if (soldCarInsertError) {
        console.error("Failed to insert into Sold_Cars:", soldCarInsertError);
        return rejectWithValue(
          `Failed to record sale: ${soldCarInsertError.message}`,
        );
      }

      // STEP 3: Delete the car from Cars table
      const { error: carDeleteError } = await supabase
        .from("Cars")
        .delete()
        .eq("id", carId);

      if (carDeleteError) {
        console.error("Failed to delete from Cars:", carDeleteError);

        // ROLLBACK: Remove the inserted Sold_Cars record
        const { error: rollbackError } = await supabase
          .from("Sold_Cars")
          .delete()
          .eq("id", soldCarInsertData.id);

        if (rollbackError) {
          console.error(
            "CRITICAL: Failed to rollback Sold_Cars insert:",
            rollbackError,
          );
          return rejectWithValue(
            `Failed to delete car and CRITICAL: Failed to rollback sale record. Manual intervention required.`,
          );
        }

        return rejectWithValue(
          `Failed to delete car: ${carDeleteError.message}`,
        );
      }

      // STEP 4: Refresh sold cars data to show the new sold car
      dispatch(fetchSoldCars());

      // STEP 5: Return success response
      return {
        success: true,
        message: `Car ${car.name} sold successfully`,
      };
    } catch (error) {
      console.error("Unexpected error in createSaleTransaction:", error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unexpected error occurred during sale transaction",
      );
    }
  },
);

// Sales slice for managing sales-specific state
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

// Export actions
export const { clearSaleError, clearLastSale } = salesSlice.actions;

// Export reducer
export default salesSlice.reducer;
