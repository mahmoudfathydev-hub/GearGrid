import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { Service, ServiceFormData } from "./types";

export const fetchServices = createAsyncThunk<
  Service[],
  void,
  { rejectValue: string }
>("services/fetchServices", async (_, { rejectWithValue }) => {
  try {
    console.log("fetchServices thunk - About to query Supabase");
    const { data, error } = await supabase
      .from("Servises")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("fetchServices thunk - data:", data);
    console.log("fetchServices thunk - error:", error);

    if (error) {
      console.log("fetchServices thunk - error found:", error.message);
      return rejectWithValue(error.message);
    }

    console.log("fetchServices thunk - returning data:", data as Service[]);
    return data as Service[];
  } catch (error: any) {
    console.log("fetchServices thunk - catch error:", error.message);
    return rejectWithValue(error.message || "Failed to fetch services");
  }
});

export const createService = createAsyncThunk<
  Service,
  ServiceFormData,
  { rejectValue: string }
>("services/createService", async (serviceData, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("Servises")
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }

    return data as Service;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create service");
  }
});

export const updateService = createAsyncThunk<
  Service,
  { id: number; data: ServiceFormData },
  { rejectValue: string }
>("services/updateService", async ({ id, data }, { rejectWithValue }) => {
  try {
    const { data: updatedData, error } = await supabase
      .from("Servises")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }

    return updatedData as Service;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update service");
  }
});

export const deleteService = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("services/deleteService", async (id, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("Servises").delete().eq("id", id);

    if (error) {
      return rejectWithValue(error.message);
    }

    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete service");
  }
});
