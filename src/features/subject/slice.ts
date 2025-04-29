import { SubjectType } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllSubjects } from "./api/subjects_requests";

interface SubjectsState {
  subjects: SubjectType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  subjects: [],
  status: "idle",
} satisfies SubjectsState as SubjectsState;

// Create the thunk to fetch the data
export const fetchSubjects = createAsyncThunk(
  "subjects/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSubjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    // you can add synchronous reducers here if needed later
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default subjectsSlice.reducer;
