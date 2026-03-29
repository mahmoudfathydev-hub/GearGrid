import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { FuelType } from "./types";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchFuelTypes = createAsyncThunk<
  FuelType[],
  void,
  { rejectValue: string }
>("fuelType/fetchFuelTypes", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Fuel_Type").select("*");
    if (error) throw error;
    return data as FuelType[];
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createFuelType = createAsyncThunk<
  FuelType,
  Partial<FuelType>,
  { rejectValue: string }
>("fuelType/createFuelType", async (newFuelType, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Fuel_Type")
      .insert(newFuelType)
      .single();
    if (error) throw error;
    return data as FuelType;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const updateFuelType = createAsyncThunk<
  FuelType,
  Partial<FuelType>,
  { rejectValue: string }
>("fuelType/updateFuelType", async (updatedFuelType, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Fuel_Type")
      .update(updatedFuelType)
      .eq("id", updatedFuelType.id)
      .single();
    if (error) throw error;
    return data as FuelType;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const deleteFuelType = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("fuelType/deleteFuelType", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("Fuel_Type").delete().eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Initial state
interface FuelTypeState {
  fuelTypes: FuelType[];
  loading: boolean;
  error: string | null;
}

const initialState: FuelTypeState = {
  fuelTypes: [],
  loading: false,
  error: null,
};

// Slice
const fuelTypeSlice = createSlice({
  name: "fuelType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFuelTypes.fulfilled,
        (state, action: PayloadAction<FuelType[]>) => {
          state.loading = false;
          state.fuelTypes = action.payload;
        },
      )
      .addCase(
        fetchFuelTypes.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(
        createFuelType.fulfilled,
        (state, action: PayloadAction<FuelType>) => {
          state.fuelTypes.push(action.payload);
        },
      )
      .addCase(
        updateFuelType.fulfilled,
        (state, action: PayloadAction<FuelType>) => {
          const index = state.fuelTypes.findIndex(
            (fuelType) => fuelType.id === action.payload.id,
          );
          if (index !== -1) {
            state.fuelTypes[index] = action.payload;
          }
        },
      )
      .addCase(
        deleteFuelType.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.fuelTypes = state.fuelTypes.filter(
            (fuelType) => fuelType.id !== action.payload,
          );
        },
      );
  },
});

// Selectors
export const selectFuelTypes = (state: RootState) =>
  state.fuelType?.fuelTypes || [];
export const selectFuelTypeById = (id: number) => (state: RootState) =>
  state.fuelType?.fuelTypes.find((fuelType: FuelType) => fuelType.id === id);

export default fuelTypeSlice.reducer;
