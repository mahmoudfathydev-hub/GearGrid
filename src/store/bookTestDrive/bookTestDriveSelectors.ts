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
import { submitTestDriveBooking } from "./bookTestDriveThunks";

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

export {
  setName,
  setNumber,
  setTransmission,
  setDate,
  resetForm,
  submitTestDriveBooking,
};
