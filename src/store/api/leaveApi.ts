import { baseApi } from "./baseApi";
import { ApiResponse } from "../types";

export interface LeaveRequest {
  id: number;
  userId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: number;
  approvedDate?: string;
  rejectionReason?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = 
  | "SICK" 
  | "ANNUAL" 
  | "PERSONAL" 
  | "MATERNITY" 
  | "PATERNITY" 
  | "EMERGENCY";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CreateLeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachments?: string[];
}

export interface UpdateLeaveStatusRequest {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export interface LeaveRequestsResponse {
  data: LeaveRequest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LeaveStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byType: {
    SICK: number;
    ANNUAL: number;
    PERSONAL: number;
    MATERNITY: number;
    PATERNITY: number;
    EMERGENCY: number;
  };
  recentRequests: LeaveRequest[];
}

export interface LeaveRequestFilters {
  status?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get leave requests with filters
    getLeaveRequests: builder.query<LeaveRequestsResponse, LeaveRequestFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
        return `auth/users/leave-requests?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<LeaveRequest[]> & {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }) => ({
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      }),
      providesTags: ["LeaveRequest"],
    }),

    // Create leave request
    createLeaveRequest: builder.mutation<ApiResponse<LeaveRequest>, CreateLeaveRequest>({
      query: (data) => ({
        url: "auth/users/leave-requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveRequest"],
    }),

    // Update leave request status (Admin only)
    updateLeaveRequestStatus: builder.mutation<
      ApiResponse<LeaveRequest>,
      { requestId: number; data: UpdateLeaveStatusRequest }
    >({
      query: ({ requestId, data }) => ({
        url: `auth/users/leave-requests/${requestId}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeaveRequest"],
    }),

    // Cancel leave request
    cancelLeaveRequest: builder.mutation<ApiResponse<void>, number>({
      query: (requestId) => ({
        url: `auth/users/leave-requests/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveRequest"],
    }),

    // Get leave statistics
    getLeaveStatistics: builder.query<ApiResponse<LeaveStatistics>, void>({
      query: () => "auth/users/leave-requests/statistics",
      transformResponse: (response: ApiResponse<LeaveStatistics>) => response,
      providesTags: ["LeaveRequest"],
    }),
  }),
});

export const {
  useGetLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestStatusMutation,
  useCancelLeaveRequestMutation,
  useGetLeaveStatisticsQuery,
} = leaveApi; 