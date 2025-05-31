import { baseApi } from "./baseApi";
import { ApiResponse } from "../types";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicReports: builder.query<any[], void>({
      query: () => "reports/academic",
      providesTags: ["Report"],
    }),
    
    getFinancialReports: builder.query<any[], void>({
      query: () => "reports/financial",
      providesTags: ["Report"],
    }),
    
    getAttendanceReports: builder.query<any[], void>({
      query: () => "reports/attendance",
      providesTags: ["Report"],
    }),
    
    generateCustomReport: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: "reports/custom",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),
  }),
});

export const {
  useGetAcademicReportsQuery,
  useGetFinancialReportsQuery,
  useGetAttendanceReportsQuery,
  useGenerateCustomReportMutation,
} = reportsApi; 