import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import bookTestDriveReducer from "./bookTestDriveSlice";
import {
  setName,
  setNumber,
  setTransmission,
  setDate,
  resetForm,
} from "./bookTestDriveSlice";
import {
  submitTestDriveBooking,
  fetchBookTestDrives,
} from "./bookTestDriveThunks";

const selectBookTestDriveState = (state: RootState) => state.bookTestDrive;

export const selectBookingLoading = createSelector(
  [selectBookTestDriveState],
  (bookTestDrive) => bookTestDrive.loading,
);

export const selectBookingSuccess = createSelector(
  [selectBookTestDriveState],
  (bookTestDrive) => bookTestDrive.success,
);

export const selectBookingError = createSelector(
  [selectBookTestDriveState],
  (bookTestDrive) => bookTestDrive.error,
);

export const selectBookingForm = createSelector(
  [selectBookTestDriveState],
  (bookTestDrive) => bookTestDrive.formData,
);

export const selectBookTestDrives = createSelector(
  [selectBookTestDriveState],
  (bookTestDrive) => bookTestDrive.data,
);

export const selectBookTestDrivesLoading = createSelector(
  [selectBookTestDriveState],
  (bookTestDrive) => bookTestDrive.loading,
);

export const selectBookTestDrivesError = createSelector(
  [selectBookTestDriveState],
  (bookTestDrive) => bookTestDrive.error,
);

// Re-export actions and thunks for convenience
export {
  setName,
  setNumber,
  setTransmission,
  setDate,
  resetForm,
  submitTestDriveBooking,
  fetchBookTestDrives,
};
