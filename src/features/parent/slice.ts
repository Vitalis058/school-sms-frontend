import { ParentType } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getParents } from "./api/parent_requests";

interface ParentsState {
  parents: ParentType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  parents: [],
  status: "idle",
} satisfies ParentsState as ParentsState;

export const fetchParents = createAsyncThunk(
  "parents/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getParents();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const parentsSlice = createSlice({
  name: "parents",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchParents.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.parents = action.payload;
      })
      .addCase(fetchParents.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default parentsSlice.reducer;
