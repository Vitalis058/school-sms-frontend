import { StreamsType } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllStreams } from "./api/streams_requests";

interface StreamsState {
  streams: StreamsType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  streams: [],
  status: "idle",
} satisfies StreamsState as StreamsState;

// Create the thunk to fetch the data
export const fetchStreams = createAsyncThunk(
  "streams/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllStreams();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const streamsSlice = createSlice({
  name: "streams",
  initialState,
  reducers: {
    // Add more synchronous reducers here if needed
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStreams.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchStreams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.streams = action.payload;
      })
      .addCase(fetchStreams.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default streamsSlice.reducer;
