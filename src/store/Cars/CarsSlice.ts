import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { Cars } from "./types";
import { supabase } from "../../lib/supabaseClient";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { SoldCars } from "../Sold_Cars/types";
import { createSoldCar } from "../Sold_Cars/Sold_CarsSlice";

const carsAdapter = createEntityAdapter<Cars>();

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

export const createSaleTransaction = createAsyncThunk<
  void,
  { carId: number; soldCar: Partial<SoldCars> },
  { rejectValue: string }
>(
  "cars/createSaleTransaction",
  async ({ carId, soldCar }, { dispatch, rejectWithValue }) => {
    try {
      // Create the sold car record
      await dispatch(createSoldCar(soldCar)).unwrap();

      // Delete the car from the Cars table
      await dispatch(deleteCar(carId)).unwrap();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

// Initial state
interface CarsState extends EntityState<Cars, number> {
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = carsAdapter.getInitialState({
  loading: false,
  error: null,
});

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
        carsAdapter.setAll(state, action.payload);
      })
      .addCase(
        fetchCars.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(createCar.fulfilled, (state, action: PayloadAction<Cars>) => {
        carsAdapter.addOne(state, action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action: PayloadAction<Cars>) => {
        carsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteCar.fulfilled, (state, action: PayloadAction<number>) => {
        carsAdapter.removeOne(state, action.payload);
      });
  },
});

// Selectors
const carsSelectors = carsAdapter.getSelectors<RootState>(
  (state) => state.cars,
);

export const selectCars = carsSelectors.selectAll;
export const selectCarById = carsSelectors.selectById;
export const selectCarsLoading = (state: { cars: CarsState }) =>
  state.cars.loading;
export const selectCarsError = (state: { cars: CarsState }) => state.cars.error;

// Adding memoized selectors for CarsSlice
export const {
  selectAll: selectAllCars,
  selectById: selectCarByIdAdapter,
  selectIds: selectCarIds,
} = carsSelectors;

export default carsSlice.reducer;
