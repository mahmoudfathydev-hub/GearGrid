import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { Transmissions } from "./types";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchTransmissions = createAsyncThunk<
  Transmissions[],
  void,
  { rejectValue: string }
>("transmissions/fetchTransmissions", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Transmissions").select("*");
    if (error) throw error;
    return data as Transmissions[];
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createTransmission = createAsyncThunk<
  Transmissions,
  Partial<Transmissions>,
  { rejectValue: string }
>(
  "transmissions/createTransmission",
  async (newTransmission, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("Transmissions")
        .insert(newTransmission)
        .single();
      if (error) throw error;
      return data as Transmissions;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateTransmission = createAsyncThunk<
  Transmissions,
  Partial<Transmissions>,
  { rejectValue: string }
>(
  "transmissions/updateTransmission",
  async (updatedTransmission, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("Transmissions")
        .update(updatedTransmission)
        .eq("id", updatedTransmission.id)
        .single();
      if (error) throw error;
      return data as Transmissions;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteTransmission = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("transmissions/deleteTransmission", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase
      .from("Transmissions")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Initial state
interface TransmissionsState {
  transmissions: Transmissions[];
  loading: boolean;
  error: string | null;
}

const initialState: TransmissionsState = {
  transmissions: [],
  loading: false,
  error: null,
};

// Slice
const transmissionsSlice = createSlice({
  name: "transmissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransmissions.fulfilled,
        (state, action: PayloadAction<Transmissions[]>) => {
          state.loading = false;
          state.transmissions = action.payload;
        },
      )
      .addCase(
        fetchTransmissions.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(
        createTransmission.fulfilled,
        (state, action: PayloadAction<Transmissions>) => {
          state.transmissions.push(action.payload);
        },
      )
      .addCase(
        updateTransmission.fulfilled,
        (state, action: PayloadAction<Transmissions>) => {
          const index = state.transmissions.findIndex(
            (transmission) => transmission.id === action.payload.id,
          );
          if (index !== -1) {
            state.transmissions[index] = action.payload;
          }
        },
      )
      .addCase(
        deleteTransmission.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.transmissions = state.transmissions.filter(
            (transmission) => transmission.id !== action.payload,
          );
        },
      );
  },
});

// Selectors
export const selectTransmissions = (state: RootState) =>
  state.transmissions?.transmissions || [];
export const selectTransmissionById = (id: number) => (state: RootState) =>
  state.transmissions?.transmissions.find(
    (transmission: Transmissions) => transmission.id === id,
  );

export default transmissionsSlice.reducer;
