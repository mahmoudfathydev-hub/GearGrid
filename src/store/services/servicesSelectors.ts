import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import servicesReducer from "./servicesSlice";
import { setName, setIcon, setDesc, setEditingId, resetForm } from "./servicesSlice";
import { fetchServices, createService, updateService, deleteService } from "./servicesThunks";

const selectServicesState = (state: RootState) => state.services;

export const selectServices = createSelector(
  [selectServicesState],
  (services) => services.services
);

export const selectServicesLoading = createSelector(
  [selectServicesState],
  (services) => services.loading
);

export const selectServicesError = createSelector(
  [selectServicesState],
  (services) => services.error
);

export const selectServicesForm = createSelector(
  [selectServicesState],
  (services) => services.formData
);

export const selectEditingId = createSelector(
  [selectServicesState],
  (services) => services.editingId
);

export const selectServicesSuccess = createSelector(
  [selectServicesState],
  (services) => services.success
);

export {
  setName,
  setIcon,
  setDesc,
  setEditingId,
  resetForm,
  fetchServices,
  createService,
  updateService,
  deleteService,
};
