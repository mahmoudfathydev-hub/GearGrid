import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { Cars } from "./types";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchCars = createAsyncThunk<
  Cars[],
  void,
  { rejectValue: string }
>("cars/fetchCars", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Cars").select("*");
    if (error) throw error;
    return data as Cars[];
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createCar = createAsyncThunk<
  Cars,
  Partial<Cars>,
  { rejectValue: string }
>("cars/createCar", async (newCar, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Cars").insert(newCar).single();
    if (error) throw error;
    return data as Cars;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const updateCar = createAsyncThunk<
  Cars,
  Partial<Cars>,
  { rejectValue: string }
>("cars/updateCar", async (updatedCar, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Cars")
      .update(updatedCar)
      .eq("id", updatedCar.id)
      .single();
    if (error) throw error;
    return data as Cars;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const deleteCar = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cars/deleteCar", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("Cars").delete().eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Initial state
interface CarsState {
  cars: Cars[];
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = {
  cars: [],
  loading: false,
  error: null,
};

// Slice
const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Cars[]>) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(
        fetchCars.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(createCar.fulfilled, (state, action: PayloadAction<Cars>) => {
        state.cars.push(action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action: PayloadAction<Cars>) => {
        const index = state.cars.findIndex(
          (car) => car.id === action.payload.id,
        );
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })
      .addCase(deleteCar.fulfilled, (state, action: PayloadAction<number>) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
      });
  },
});

// Selectors
export const selectCars = (state: RootState) => state.cars?.cars || [];
export const selectCarById = (id: number) => (state: RootState) =>
  state.cars?.cars.find((car: Cars) => car.id === id);

export default carsSlice.reducer;
