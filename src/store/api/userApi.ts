import { baseApi } from "./baseApi";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export interface StaffMember {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF";
  firstName?: string;
  lastName?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: string;
  permissions?: string[];
}

export interface RolePermission {
  role: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF";
  resource: string;
  permissions: ("create" | "read" | "update" | "delete")[];
}

export interface UpdateRolePermissionsRequest {
  role: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF";
  permissions: Record<string, ("create" | "read" | "update" | "delete")[]>;
}

export interface UpdateUserRoleRequest {
  userId: number;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "STAFF";
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: "GENERAL" | "EMERGENCY" | "ACADEMIC" | "TRANSPORT" | "EVENT";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  targetAudience: ("ADMIN" | "TEACHER" | "STUDENT" | "STAFF")[];
  isActive: boolean;
  publishDate: string;
  expiryDate?: string;
  createdBy: number;
  createdByUser?: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  attachments?: string[];
  readBy?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  type: "GENERAL" | "EMERGENCY" | "ACADEMIC" | "TRANSPORT" | "EVENT";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  targetAudience: ("ADMIN" | "TEACHER" | "STUDENT" | "STAFF")[];
  publishDate: string;
  expiryDate?: string;
  attachments?: string[];
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  type?: "GENERAL" | "EMERGENCY" | "ACADEMIC" | "TRANSPORT" | "EVENT";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  targetAudience?: ("ADMIN" | "TEACHER" | "STUDENT" | "STAFF")[];
  publishDate?: string;
  expiryDate?: string;
  isActive?: boolean;
  attachments?: string[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Staff Management
    getAllStaff: builder.query<PaginatedResponse<StaffMember>, UserFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `auth/users/staff?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
      }),
      providesTags: ["User"],
    }),

    getStaffMember: builder.query<StaffMember, number>({
      query: (id) => `auth/users/${id}`,
      transformResponse: (response: ApiResponse<StaffMember>) => response.data,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    createStaffMember: builder.mutation<ApiResponse<StaffMember>, CreateUserRequest>({
      query: (data) => ({
        url: "auth/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateStaffMember: builder.mutation<ApiResponse<StaffMember>, { id: number; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `auth/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }, "User"],
    }),

    deleteStaffMember: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `auth/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, "User"],
    }),

    // Role Management
    updateUserRole: builder.mutation<ApiResponse<StaffMember>, UpdateUserRoleRequest>({
      query: ({ userId, role }) => ({
        url: `auth/users/${userId}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "User", id: userId }, "User"],
    }),

    // Permission Management
    getRolePermissions: builder.query<RolePermission[], void>({
      query: () => "auth/users/permissions/roles",
      transformResponse: (response: ApiResponse<RolePermission[]>) => response.data,
      providesTags: ["User"],
    }),

    updateRolePermissions: builder.mutation<ApiResponse<RolePermission[]>, UpdateRolePermissionsRequest>({
      query: (data) => ({
        url: "auth/users/permissions/roles",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getUserPermissions: builder.query<string[], number>({
      query: (userId) => `auth/users/${userId}/permissions`,
      transformResponse: (response: ApiResponse<string[]>) => response.data,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    // Staff Analytics
    getStaffAnalytics: builder.query<{
      totalStaff: number;
      activeStaff: number;
      roleDistribution: Record<string, number>;
      recentActivity: any[];
    }, void>({
      query: () => "auth/users/analytics",
      transformResponse: (response: ApiResponse<{
        totalStaff: number;
        activeStaff: number;
        roleDistribution: Record<string, number>;
        recentActivity: any[];
      }>) => response.data,
      providesTags: ["User"],
    }),

    // Bulk Operations
    bulkUpdateStaffRoles: builder.mutation<ApiResponse<void>, { userIds: number[]; role: string }>({
      query: (data) => ({
        url: "auth/users/bulk/roles",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    bulkDeactivateStaff: builder.mutation<ApiResponse<void>, number[]>({
      query: (userIds) => ({
        url: "auth/users/bulk/deactivate",
        method: "PUT",
        body: { userIds },
      }),
      invalidatesTags: ["User"],
    }),

    // Activity Logs
    getStaffActivityLogs: builder.query<any[], { userId?: number; startDate?: string; endDate?: string }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `auth/users/activity-logs?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<any[]>) => response.data,
      providesTags: ["User"],
    }),

    // Announcements
    getAnnouncements: builder.query<PaginatedResponse<Announcement>, {
      page?: number;
      pageSize?: number;
      type?: string;
      priority?: string;
      isActive?: boolean;
      targetAudience?: string;
    }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `auth/announcements?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
      }),
      providesTags: ["Announcement"],
    }),

    getAllAnnouncements: builder.query<PaginatedResponse<Announcement>, {
      page?: number;
      pageSize?: number;
      type?: string;
      priority?: string;
      isActive?: boolean;
      targetAudience?: string;
    }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `auth/announcements/all?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
      }),
      providesTags: ["Announcement"],
    }),

    getAnnouncement: builder.query<Announcement, number>({
      query: (id) => `auth/announcements/${id}`,
      transformResponse: (response: ApiResponse<Announcement>) => response.data,
      providesTags: (result, error, id) => [{ type: "Announcement", id }],
    }),

    createAnnouncement: builder.mutation<ApiResponse<Announcement>, CreateAnnouncementRequest>({
      query: (data) => ({
        url: "auth/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Announcement"],
    }),

    updateAnnouncement: builder.mutation<ApiResponse<Announcement>, { id: number; data: UpdateAnnouncementRequest }>({
      query: ({ id, data }) => ({
        url: `auth/announcements/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Announcement", id }, "Announcement"],
    }),

    deleteAnnouncement: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `auth/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Announcement", id }, "Announcement"],
    }),

    markAnnouncementAsRead: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `auth/announcements/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Announcement", id }, "Announcement"],
    }),

    getActiveAnnouncements: builder.query<Announcement[], {
      limit?: number;
      priority?: string;
      type?: string;
    }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `auth/announcements/active?${params.toString()}`;
      },
      transformResponse: (response: ApiResponse<Announcement[]>) => response.data,
      providesTags: ["Announcement"],
    }),
  }),
});

export const {
  // Staff Management
  useGetAllStaffQuery,
  useGetStaffMemberQuery,
  useCreateStaffMemberMutation,
  useUpdateStaffMemberMutation,
  useDeleteStaffMemberMutation,

  // Role Management
  useUpdateUserRoleMutation,

  // Permission Management
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useGetUserPermissionsQuery,

  // Analytics
  useGetStaffAnalyticsQuery,

  // Bulk Operations
  useBulkUpdateStaffRolesMutation,
  useBulkDeactivateStaffMutation,

  // Activity Logs
  useGetStaffActivityLogsQuery,

  // Announcements
  useGetAnnouncementsQuery,
  useGetAllAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useMarkAnnouncementAsReadMutation,
  useGetActiveAnnouncementsQuery,
} = userApi; 