import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { MonthlySales } from "./types";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchMonthlySales = createAsyncThunk<
  MonthlySales[],
  void,
  { rejectValue: string }
>("monthlySales/fetchMonthlySales", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Monthly_Sales").select("*");
    if (error) throw error;
    return data as MonthlySales[];
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createMonthlySale = createAsyncThunk<
  MonthlySales,
  Partial<MonthlySales>,
  { rejectValue: string }
>("monthlySales/createMonthlySale", async (newSale, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Monthly_Sales")
      .insert(newSale)
      .single();
    if (error) throw error;
    return data as MonthlySales;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const updateMonthlySale = createAsyncThunk<
  MonthlySales,
  Partial<MonthlySales>,
  { rejectValue: string }
>(
  "monthlySales/updateMonthlySale",
  async (updatedSale, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("Monthly_Sales")
        .update(updatedSale)
        .eq("id", updatedSale.id)
        .single();
      if (error) throw error;
      return data as MonthlySales;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteMonthlySale = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("monthlySales/deleteMonthlySale", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase
      .from("Monthly_Sales")
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
interface MonthlySalesState {
  monthlySales: MonthlySales[];
  loading: boolean;
  error: string | null;
}

const initialState: MonthlySalesState = {
  monthlySales: [],
  loading: false,
  error: null,
};

// Slice
const monthlySalesSlice = createSlice({
  name: "monthlySales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlySales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMonthlySales.fulfilled,
        (state, action: PayloadAction<MonthlySales[]>) => {
          state.loading = false;
          state.monthlySales = action.payload;
        },
      )
      .addCase(
        fetchMonthlySales.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(
        createMonthlySale.fulfilled,
        (state, action: PayloadAction<MonthlySales>) => {
          state.monthlySales.push(action.payload);
        },
      )
      .addCase(
        updateMonthlySale.fulfilled,
        (state, action: PayloadAction<MonthlySales>) => {
          const index = state.monthlySales.findIndex(
            (sale) => sale.id === action.payload.id,
          );
          if (index !== -1) {
            state.monthlySales[index] = action.payload;
          }
        },
      )
      .addCase(
        deleteMonthlySale.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.monthlySales = state.monthlySales.filter(
            (sale) => sale.id !== action.payload,
          );
        },
      );
  },
});

// Selectors
export const selectMonthlySales = (state: RootState) =>
  state.monthlySales?.monthlySales || [];
export const selectMonthlySaleById = (id: string) => (state: RootState) =>
  state.monthlySales?.monthlySales.find((sale: MonthlySales) => sale.id === id);

export default monthlySalesSlice.reducer;
