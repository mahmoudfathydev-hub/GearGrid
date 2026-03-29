import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { User } from "./types";
import { supabase } from "../../lib/supabaseClient";

// Async thunks
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("user/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("User").select("*");
    if (error) throw error;
    return data as User[];
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createUser = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>("user/createUser", async (newUser, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("User")
      .insert(newUser)
      .single();
    if (error) throw error;
    return data as User;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const updateUser = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>("user/updateUser", async (updatedUser, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("User")
      .update(updatedUser)
      .eq("id", updatedUser.id)
      .single();
    if (error) throw error;
    return data as User;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("user/deleteUser", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("User").delete().eq("id", id);
    if (error) throw error;
    return id;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return rejectWithValue(errorMessage);
  }
});

// Initial state
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(
        fetchUsers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        },
      )
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

// Selectors
export const selectUsers = (state: RootState) => state.user?.users || [];
export const selectUserById = (id: number) => (state: RootState) =>
  state.user?.users.find((user: User) => user.id === id);

export default userSlice.reducer;
