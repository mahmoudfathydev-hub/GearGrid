import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { Brand } from "./types";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchBrands = createAsyncThunk<
  Brand[],
  void,
  { rejectValue: string }
>("brand/fetchBrands", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("Brand").select("*");
    if (error) throw error;
    return data as Brand[];
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createBrand = createAsyncThunk<
  Brand,
  Partial<Brand>,
  { rejectValue: string }
>("brand/createBrand", async (newBrand, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Brand")
      .insert(newBrand)
      .single();
    if (error) throw error;
    return data as Brand;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const updateBrand = createAsyncThunk<
  Brand,
  Partial<Brand>,
  { rejectValue: string }
>("brand/updateBrand", async (updatedBrand, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Brand")
      .update(updatedBrand)
      .eq("id", updatedBrand.id)
      .single();
    if (error) throw error;
    return data as Brand;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const deleteBrand = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("brand/deleteBrand", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("Brand").delete().eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Initial state
interface BrandState {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

// Slice
const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBrands.fulfilled,
        (state, action: PayloadAction<Brand[]>) => {
          state.loading = false;
          state.brands = action.payload;
        },
      )
      .addCase(
        fetchBrands.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(createBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        state.brands.push(action.payload);
      })
      .addCase(updateBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
        const index = state.brands.findIndex(
          (brand) => brand.id === action.payload.id,
        );
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(
        deleteBrand.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.brands = state.brands.filter(
            (brand) => brand.id !== action.payload,
          );
        },
      );
  },
});

// Selectors
export const selectBrands = (state: RootState) => state.brand?.brands || [];
export const selectBrandById = (id: number) => (state: RootState) =>
  state.brand?.brands.find((brand: Brand) => brand.id === id);

export default brandSlice.reducer;
