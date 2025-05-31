import { baseApi } from "./baseApi";
import { ApiResponse } from "../types";

export const resourcesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLibraryBooks: builder.query<any[], void>({
      query: () => "resources/library/books",
      providesTags: ["Asset"],
    }),
    
    getInventoryItems: builder.query<any[], void>({
      query: () => "resources/inventory",
      providesTags: ["Asset"],
    }),
    
    getFacilities: builder.query<any[], void>({
      query: () => "resources/facilities",
      providesTags: ["Asset"],
    }),
    
    createAsset: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: "resources/assets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Asset"],
    }),
  }),
});

export const {
  useGetLibraryBooksQuery,
  useGetInventoryItemsQuery,
  useGetFacilitiesQuery,
  useCreateAssetMutation,
} = resourcesApi; 