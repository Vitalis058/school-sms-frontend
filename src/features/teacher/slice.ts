/* eslint-disable @typescript-eslint/no-unused-vars */
import { TeacherType } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTeachers } from "./api/teachers_requests";

interface TeachersState {
  teachers: TeacherType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  teachers: [],
  status: "idle",
} satisfies TeachersState as TeachersState;

//create the thunk to fetch the data
export const fetchTeachers = createAsyncThunk(
  "teachers/fetch",
  async (_, { rejectWithValue }) => {
    const response = await getTeachers();
    return response.data;
  },
);

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    // we can have the rest of the common reducers
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default teachersSlice.reducer;
