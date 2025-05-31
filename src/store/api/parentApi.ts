import { baseApi } from "./baseApi";
import {
  Guardian,
  CreateGuardianRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export const parentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Parent/Guardian Operations
    getParents: builder.query<PaginatedResponse<Guardian>, { search?: string; page?: number; pageSize?: number }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `parents?${params.toString()}`;
      },
      providesTags: ["Parent"],
    }),
    
    getParent: builder.query<Guardian, string>({
      query: (id) => `parents/${id}`,
      providesTags: (result, error, id) => [{ type: "Parent", id }],
    }),
    
    getParentByEmail: builder.query<Guardian, string>({
      query: (email) => `parents/by-email/${email}`,
      providesTags: (result, error, email) => [{ type: "Parent", id: email }],
    }),
    
    getParentStudents: builder.query<any[], string>({
      query: (parentId) => `parents/${parentId}/students`,
      providesTags: (result, error, parentId) => [{ type: "Parent", id: parentId }],
    }),
    
    createParent: builder.mutation<ApiResponse<Guardian>, CreateGuardianRequest>({
      query: (data) => ({
        url: "parents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parent", "Student"],
    }),
    
    updateParent: builder.mutation<ApiResponse<Guardian>, { id: string; data: Partial<CreateGuardianRequest> }>({
      query: ({ id, data }) => ({
        url: `parents/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Parent", id }, "Parent", "Student"],
    }),
    
    deleteParent: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `parents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Parent", id }, "Parent", "Student"],
    }),

    // Parent-Student Relationships
    linkStudentToParent: builder.mutation<ApiResponse<void>, { parentId: string; studentId: string }>({
      query: ({ parentId, studentId }) => ({
        url: `parents/${parentId}/students`,
        method: "POST",
        body: { studentId },
      }),
      invalidatesTags: (result, error, { parentId, studentId }) => [
        { type: "Parent", id: parentId },
        { type: "Student", id: studentId },
        "Parent",
        "Student"
      ],
    }),
    
    unlinkStudentFromParent: builder.mutation<ApiResponse<void>, { parentId: string; studentId: string }>({
      query: ({ parentId, studentId }) => ({
        url: `parents/${parentId}/students/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { parentId, studentId }) => [
        { type: "Parent", id: parentId },
        { type: "Student", id: studentId },
        "Parent",
        "Student"
      ],
    }),

    // Parent Communications
    getParentMessages: builder.query<any[], { parentId: string; startDate?: string; endDate?: string }>({
      query: ({ parentId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `parents/${parentId}/messages?${params.toString()}`;
      },
      providesTags: (result, error, { parentId }) => [{ type: "Parent", id: parentId }, "Communication"],
    }),
    
    sendMessageToParent: builder.mutation<ApiResponse<any>, { parentId: string; message: string; subject: string }>({
      query: ({ parentId, ...data }) => ({
        url: `parents/${parentId}/messages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { parentId }) => [
        { type: "Parent", id: parentId }, 
        "Parent", 
        "Communication"
      ],
    }),
  }),
});

export const {
  // Parent Operations
  useGetParentsQuery,
  useGetParentQuery,
  useGetParentByEmailQuery,
  useGetParentStudentsQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
  
  // Parent-Student Relationships
  useLinkStudentToParentMutation,
  useUnlinkStudentFromParentMutation,
  
  // Parent Communications
  useGetParentMessagesQuery,
  useSendMessageToParentMutation,
} = parentApi; 