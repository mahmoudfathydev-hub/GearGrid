import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookTestDriveState } from "./types";
import { submitTestDriveBooking } from "./bookTestDriveThunks";

const initialState: BookTestDriveState = {
  loading: false,
  success: false,
  error: null,
  formData: {
    name: "",
    number: "",
    transmissions: "",
    date: "",
  },
};

const bookTestDriveSlice = createSlice({
  name: "bookTestDrive",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.formData.name = action.payload;
      state.error = null;
    },
    setNumber: (state, action: PayloadAction<string>) => {
      state.formData.number = action.payload;
      state.error = null;
    },
    setTransmission: (state, action: PayloadAction<string>) => {
      state.formData.transmissions = action.payload;
      state.error = null;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.formData.date = action.payload;
      state.error = null;
    },
    resetForm: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.formData = {
        name: "",
        number: "",
        transmissions: "",
        date: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitTestDriveBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitTestDriveBooking.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitTestDriveBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit booking";
        state.success = false;
      });
  },
});

export const {
  setName,
  setNumber,
  setTransmission,
  setDate,
  resetForm,
} = bookTestDriveSlice.actions;

export default bookTestDriveSlice.reducer;
