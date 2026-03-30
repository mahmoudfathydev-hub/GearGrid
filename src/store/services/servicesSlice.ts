import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServicesState, ServiceFormData } from "./types";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "./servicesThunks";

const initialState: ServicesState = {
  loading: false,
  success: false,
  error: null,
  services: [],
  formData: {
    name: "",
    icon: "",
    desc: "",
  },
  editingId: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.formData.name = action.payload;
      state.error = null;
    },
    setIcon: (state, action: PayloadAction<string>) => {
      state.formData.icon = action.payload;
      state.error = null;
    },
    setDesc: (state, action: PayloadAction<string>) => {
      state.formData.desc = action.payload;
      state.error = null;
    },
    setEditingId: (state, action: PayloadAction<number | null>) => {
      state.editingId = action.payload;
      if (action.payload === null) {
        state.formData = { name: "", icon: "", desc: "" };
      }
    },
    resetForm: (state) => {
      state.formData = { name: "", icon: "", desc: "" };
      state.editingId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        console.log("servicesSlice - fetchServices.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        console.log(
          "servicesSlice - fetchServices.fulfilled with payload:",
          action.payload,
        );
        state.loading = false;
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        console.log(
          "servicesSlice - fetchServices.rejected with payload:",
          action.payload,
        );
        state.loading = false;
        state.error = action.payload || "Failed to fetch services";
        state.services = [];
      })
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.unshift(action.payload);
        state.success = true;
        state.error = null;
        state.formData = { name: "", icon: "", desc: "" };
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create service";
        state.success = false;
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.map((service) =>
          service.id === action.payload.id ? action.payload : service,
        );
        state.success = true;
        state.error = null;
        state.formData = { name: "", icon: "", desc: "" };
        state.editingId = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update service";
        state.success = false;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(
          (service) => service.id !== action.payload,
        );
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete service";
      });
  },
});

export const { setName, setIcon, setDesc, setEditingId, resetForm } =
  servicesSlice.actions;

export default servicesSlice.reducer;
