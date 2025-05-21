/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimeSlotType } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get_time_slots } from "./api/get_time_slots";

interface TimeSlot {
  timeSlot: TimeSlotType[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | undefined;
}

const initialState: TimeSlot = {
  timeSlot: [],
  status: "idle",
  error: undefined,
};

//create the async function
export const fetchTimeSlots = createAsyncThunk(
  "timeSlots/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await get_time_slots();
      return response.data;
    } catch (error: any) {
      rejectWithValue(error.message || "Failed to fetch the time slots");
    }
  },
);

const timeSlotSlice = createSlice({
  name: "timeSlots",
  initialState,
  reducers: {
    // rest of the reducers like data update
  },

  extraReducers(builder) {
    builder.addCase(fetchTimeSlots.pending, (state) => {
      state.status = "pending";
    });

    builder.addCase(fetchTimeSlots.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.timeSlot = action.payload;
    });

    builder.addCase(fetchTimeSlots.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export default timeSlotSlice.reducer;
