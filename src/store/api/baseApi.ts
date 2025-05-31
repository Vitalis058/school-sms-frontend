import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/constants/apiUrl";

// Base query with authentication header
const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api/v1/`,
  // credentials: "include", // Temporarily disabled due to CORS
  prepareHeaders: (headers) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh token or redirect to login
    localStorage.removeItem("auth_token");
    window.location.href = "/sign-in";
  }

  return result;
};

// Create base API
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Student",
    "Teacher", 
    "Parent",
    "Department",
    "Subject",
    "Grade",
    "Stream",
    "Lesson",
    "TimeSlot",
    "User",
    "Attendance",
    "Fee",
    "Communication",
    "Report",
    "Asset",
    "Route",
    "Performance",
    "LeaveRequest",
    "Driver",
    "Vehicle",
    "VehicleBooking",
    "MaintenanceReport",
    "TransportAnalytics",
    "Announcement",
    "Book",
    "BookIssue",
    "LibraryMember",
    "LibraryAnalytics",
    "SystemSettings",
    "SystemHealth",
    "SystemLogs",
  ],
  // Enhanced cache configuration
  keepUnusedDataFor: 300, // Keep cache for 5 minutes
  refetchOnMountOrArgChange: false, // Don't auto-refetch on mount
  refetchOnFocus: false, // Don't refetch when window regains focus
  refetchOnReconnect: true, // Refetch when internet reconnects
  endpoints: () => ({}),
});

export type CacheTag = 
  | "Auth" 
  | "Student" 
  | "Teacher" 
  | "Parent" 
  | "Grade" 
  | "Stream" 
  | "Subject" 
  | "Department"
  | "Performance"
  | "Driver"
  | "Vehicle"
  | "VehicleBooking"
  | "MaintenanceReport"
  | "TransportAnalytics"
  | "Announcement"
  | "Book"
  | "BookIssue"
  | "LibraryMember"
  | "LibraryAnalytics"
  | "SystemSettings"
  | "SystemHealth"
  | "SystemLogs"; 