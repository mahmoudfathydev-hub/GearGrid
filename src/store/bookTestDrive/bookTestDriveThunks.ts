import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { BookTestDrive } from "./types";

export const submitTestDriveBooking = createAsyncThunk<
  BookTestDrive,
  {
    name: string;
    number: string;
    transmissions: string;
    date: string;
  },
  { rejectValue: string }
>(
  "bookTestDrive/submitBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("Book_Test_Drive")
        .insert([
          {
            name: bookingData.name,
            number: bookingData.number,
            transmissions: bookingData.transmissions,
            date: bookingData.date,
          },
        ])
        .select()
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data as BookTestDrive;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to submit booking");
    }
  }
);
