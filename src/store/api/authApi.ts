import { baseApi } from "./baseApi";
import {
  User,
  LoginRequest,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
} from "../types";

// Re-export types for convenience
export type { LoginRequest };

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "TEACHER" | "STAFF" | "DRIVER" | "LIBRARIAN";
  departmentId?: string;
}

// Backend auth response structure (token at root level)
export interface BackendAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  data: {
    user: User;
    defaultPassword?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  image?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation<BackendAuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    signup: builder.mutation<BackendAuthResponse, SignupRequest>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    register: builder.mutation<BackendAuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    
    // User profile
    getCurrentUser: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),
    
    updateProfile: builder.mutation<ApiResponse<{ user: User }>, UpdateProfileRequest>({
      query: (data) => ({
        url: "auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    
    // Password management
    changePassword: builder.mutation<ApiResponse<void>, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: "auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    
    resetPassword: builder.mutation<ApiResponse<{ message: string }>, ResetPasswordRequest>({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    
    // Token management
    refreshToken: builder.mutation<ApiResponse<{ token: string }>, void>({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
    }),
    
    // Admin endpoints
    getAllUsers: builder.query<ApiResponse<{
      users: User[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>, {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
        return `auth/users?${searchParams.toString()}`;
      },
      providesTags: ["User"],
    }),
  }),
});

export const {
  // Authentication
  useLoginMutation,
  useSignupMutation,
  useRegisterMutation,
  useLogoutMutation,
  
  // User profile
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  
  // Password management
  useChangePasswordMutation,
  useResetPasswordMutation,
  
  // Token management
  useRefreshTokenMutation,
  
  // Admin endpoints
  useGetAllUsersQuery,
} = authApi; 