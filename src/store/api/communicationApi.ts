import { baseApi } from "./baseApi";
import { ApiResponse } from "../types";

export const communicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<any[], void>({
      query: () => "messages",
      providesTags: ["Communication"],
    }),
    
    sendMessage: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: "messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Communication"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
} = communicationApi; 