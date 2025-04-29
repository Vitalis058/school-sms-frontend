import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDepartments } from "./api/department_requests";
import { DepartmentType } from "@/types/types";

interface DepartmentsState {
  departments: DepartmentType[];
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  departments: [],
  status: "idle",
} satisfies DepartmentsState as DepartmentsState;

// Create the thunk to fetch the data
export const fetchDepartments = createAsyncThunk(
  "departments/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDepartments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    // you can add non-async reducers here if needed
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default departmentsSlice.reducer;
