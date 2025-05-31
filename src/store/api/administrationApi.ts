import { baseApi } from "./baseApi";
import { ApiResponse } from "../types";

export const administrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSystemStats: builder.query<any, void>({
      query: () => "admin/stats",
    }),
    
    getSystemHealth: builder.query<any, void>({
      query: () => "admin/health",
    }),
    
    getUsersOverview: builder.query<any, void>({
      query: () => "admin/users-overview",
    }),
    
    exportData: builder.mutation<ApiResponse<any>, { type: string; filters?: any }>({
      query: (data) => ({
        url: "admin/export",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSystemStatsQuery,
  useGetSystemHealthQuery,
  useGetUsersOverviewQuery,
  useExportDataMutation,
} = administrationApi; 