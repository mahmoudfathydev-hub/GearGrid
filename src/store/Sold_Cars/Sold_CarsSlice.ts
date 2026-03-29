import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../index";
import { SoldCars } from "./types";
import { supabase } from "../../lib/supabaseClient";
import { createSaleTransaction } from "../Sales/SalesSlice";

// Async thunks
export const fetchSoldCars = createAsyncThunk<
  SoldCars[],
  void,
  { rejectValue: string }
>("soldCars/fetchSoldCars", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Sold_Cars").select("*");
    if (error) throw error;
    return data as SoldCars[];
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createSoldCar = createAsyncThunk<
  SoldCars,
  Partial<SoldCars>,
  { rejectValue: string }
>("soldCars/createSoldCar", async (newSoldCar, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Sold_Cars")
      .insert(newSoldCar)
      .single();
    if (error) throw error;
    return data as SoldCars;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const updateSoldCar = createAsyncThunk<
  SoldCars,
  Partial<SoldCars>,
  { rejectValue: string }
>("soldCars/updateSoldCar", async (updatedSoldCar, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Sold_Cars")
      .update(updatedSoldCar)
      .eq("id", updatedSoldCar.id)
      .single();
    if (error) throw error;
    return data as SoldCars;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const deleteSoldCar = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("soldCars/deleteSoldCar", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("Sold_Cars").delete().eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Refactored SoldCarsSlice to use normalized state shape
const soldCarsAdapter = createEntityAdapter<SoldCars>();

interface SoldCarsState extends EntityState<SoldCars, number> {
  loading: boolean;
  error: string | null;
}

const initialState: SoldCarsState = soldCarsAdapter.getInitialState({
  loading: false,
  error: null,
});

// Slice
const soldCarsSlice = createSlice({
  name: "soldCars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSoldCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSoldCars.fulfilled,
        (state, action: PayloadAction<SoldCars[]>) => {
          state.loading = false;
          soldCarsAdapter.setAll(state, action.payload);
        },
      )
      .addCase(
        fetchSoldCars.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(
        createSoldCar.fulfilled,
        (state, action: PayloadAction<SoldCars>) => {
          soldCarsAdapter.addOne(state, action.payload);
        },
      )
      .addCase(
        updateSoldCar.fulfilled,
        (state, action: PayloadAction<SoldCars>) => {
          soldCarsAdapter.upsertOne(state, action.payload);
        },
      )
      .addCase(
        deleteSoldCar.fulfilled,
        (state, action: PayloadAction<number>) => {
          soldCarsAdapter.removeOne(state, action.payload);
        },
      )
      // Handle createSaleTransaction
      .addCase(createSaleTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSaleTransaction.fulfilled, (state, action) => {
        state.loading = false;
        // Note: The actual sold car data is added to the database in the thunk
        // We could refetch sold cars here or add the data directly if we have it
        // For now, we'll rely on the existing fetchSoldCars to keep the state updated
      })
      .addCase(createSaleTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create sale transaction";
      });
  },
});

// Selectors
const soldCarsSelectors = soldCarsAdapter.getSelectors<RootState>(
  (state) => state.soldCars,
);

export const {
  selectAll: selectAllSoldCars,
  selectById: selectSoldCarById,
  selectIds: selectSoldCarIds,
} = soldCarsSelectors;

export default soldCarsSlice.reducer;
