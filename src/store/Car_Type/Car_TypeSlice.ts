import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { CarType } from "./types";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchCarTypes = createAsyncThunk<
  CarType[],
  void,
  { rejectValue: string }
>("carType/fetchCarTypes", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Car_Type").select("*");
    if (error) throw error;
    return data as CarType[];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const createCarType = createAsyncThunk<
  CarType,
  Partial<CarType>,
  { rejectValue: string }
>("carType/createCarType", async (newCarType, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Car_Type")
      .insert(newCarType)
      .single();
    if (error) throw error;
    return data as CarType;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const updateCarType = createAsyncThunk<
  CarType,
  Partial<CarType>,
  { rejectValue: string }
>("carType/updateCarType", async (updatedCarType, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Car_Type")
      .update(updatedCarType)
      .eq("id", updatedCarType.id)
      .single();
    if (error) throw error;
    return data as CarType;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const deleteCarType = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("carType/deleteCarType", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("Car_Type").delete().eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

// Initial state
interface CarTypeState {
  carTypes: CarType[];
  loading: boolean;
  error: string | null;
}

const initialState: CarTypeState = {
  carTypes: [],
  loading: false,
  error: null,
};

// Slice
const carTypeSlice = createSlice({
  name: "carType",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCarTypes.fulfilled,
        (state, action: PayloadAction<CarType[]>) => {
          state.loading = false;
          state.carTypes = action.payload;
        },
      )
      .addCase(
        fetchCarTypes.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(
        createCarType.fulfilled,
        (state, action: PayloadAction<CarType>) => {
          state.carTypes.push(action.payload);
        },
      )
      .addCase(
        updateCarType.fulfilled,
        (state, action: PayloadAction<CarType>) => {
          const index = state.carTypes.findIndex(
            (carType) => carType.id === action.payload.id,
          );
          if (index !== -1) {
            state.carTypes[index] = action.payload;
          }
        },
      )
      .addCase(
        deleteCarType.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.carTypes = state.carTypes.filter(
            (carType) => carType.id !== action.payload,
          );
        },
      );
  },
});

// Selectors
export const selectCarTypes = (state: RootState & { carType: CarTypeState }) =>
  state.carType.carTypes;
export const selectCarTypeById =
  (id: number) => (state: RootState & { carType: CarTypeState }) =>
    state.carType.carTypes.find((carType: CarType) => carType.id === id);

export default carTypeSlice.reducer;
