import { GradesType } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getGradesData } from "./api/grades_requests";

interface GradesState {
  grades: GradesType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  grades: [],
  status: "idle",
} satisfies GradesState as GradesState;

// Create the thunk to fetch the data
export const fetchGrades = createAsyncThunk(
  "grades/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGradesData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {
    // you can add non-async reducers here if needed
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGrades.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.grades = action.payload;
      })
      .addCase(fetchGrades.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default gradesSlice.reducer;
