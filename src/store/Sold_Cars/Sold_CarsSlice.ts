import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { SoldCars } from "./types";
import { supabase } from "../../lib/supabaseClient";

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

// Initial state
interface SoldCarsState {
  soldCars: SoldCars[];
  loading: boolean;
  error: string | null;
}

const initialState: SoldCarsState = {
  soldCars: [],
  loading: false,
  error: null,
};

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
          state.soldCars = action.payload;
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
          state.soldCars.push(action.payload);
        },
      )
      .addCase(
        updateSoldCar.fulfilled,
        (state, action: PayloadAction<SoldCars>) => {
          const index = state.soldCars.findIndex(
            (soldCar) => soldCar.id === action.payload.id,
          );
          if (index !== -1) {
            state.soldCars[index] = action.payload;
          }
        },
      )
      .addCase(
        deleteSoldCar.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.soldCars = state.soldCars.filter(
            (soldCar) => soldCar.id !== action.payload,
          );
        },
      );
  },
});

// Selectors
export const selectSoldCars = (state: RootState) =>
  state.soldCars?.soldCars || [];
export const selectSoldCarById = (id: number) => (state: RootState) =>
  state.soldCars?.soldCars.find((soldCar: SoldCars) => soldCar.id === id);

export default soldCarsSlice.reducer;
