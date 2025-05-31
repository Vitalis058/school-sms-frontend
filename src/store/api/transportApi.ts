import { baseApi } from "./baseApi";
import {
  Driver,
  Vehicle,
  VehicleBooking,
  MaintenanceReport,
  TransportAnalytics,
  CreateDriverRequest,
  CreateVehicleRequest,
  CreateVehicleBookingRequest,
  CreateMaintenanceReportRequest,
  TransportFilters,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export const transportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Driver Management
    getDrivers: builder.query<PaginatedResponse<Driver>, TransportFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `transport/drivers?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
      }),
      providesTags: ["Driver"],
    }),

    getDriver: builder.query<Driver, string>({
      query: (id) => `transport/drivers/${id}`,
      transformResponse: (response: ApiResponse<Driver>) => response.data,
      providesTags: (result, error, id) => [{ type: "Driver", id }],
    }),

    createDriver: builder.mutation<ApiResponse<Driver>, CreateDriverRequest>({
      query: (data) => ({
        url: "transport/drivers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Driver"],
    }),

    updateDriver: builder.mutation<ApiResponse<Driver>, { id: string; data: Partial<CreateDriverRequest> }>({
      query: ({ id, data }) => ({
        url: `transport/drivers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Driver", id }, "Driver"],
    }),

    deleteDriver: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `transport/drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Driver", id }, "Driver"],
    }),

    // Vehicle Management
    getVehicles: builder.query<PaginatedResponse<Vehicle>, TransportFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `transport/vehicles?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
      }),
      providesTags: ["Vehicle"],
    }),

    getVehicle: builder.query<Vehicle, string>({
      query: (id) => `transport/vehicles/${id}`,
      transformResponse: (response: ApiResponse<Vehicle>) => response.data,
      providesTags: (result, error, id) => [{ type: "Vehicle", id }],
    }),

    createVehicle: builder.mutation<ApiResponse<Vehicle>, CreateVehicleRequest>({
      query: (data) => ({
        url: "transport/vehicles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vehicle"],
    }),

    updateVehicle: builder.mutation<ApiResponse<Vehicle>, { id: string; data: Partial<CreateVehicleRequest> }>({
      query: ({ id, data }) => ({
        url: `transport/vehicles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Vehicle", id }, "Vehicle"],
    }),

    deleteVehicle: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `transport/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Vehicle", id }, "Vehicle"],
    }),

    assignVehicleToDriver: builder.mutation<ApiResponse<Vehicle>, { vehicleId: string; driverId: string }>({
      query: ({ vehicleId, driverId }) => ({
        url: `transport/vehicles/${vehicleId}/assign`,
        method: "PUT",
        body: { driverId },
      }),
      invalidatesTags: ["Vehicle", "Driver"],
    }),

    // Vehicle Booking Management
    getVehicleBookings: builder.query<PaginatedResponse<VehicleBooking>, TransportFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `transport/bookings?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
      }),
      providesTags: ["VehicleBooking"],
    }),

    getVehicleBooking: builder.query<VehicleBooking, string>({
      query: (id) => `transport/bookings/${id}`,
      transformResponse: (response: ApiResponse<VehicleBooking>) => response.data,
      providesTags: (result, error, id) => [{ type: "VehicleBooking", id }],
    }),

    createVehicleBooking: builder.mutation<ApiResponse<VehicleBooking>, CreateVehicleBookingRequest>({
      query: (data) => ({
        url: "transport/bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VehicleBooking", "Vehicle"],
    }),

    updateVehicleBooking: builder.mutation<ApiResponse<VehicleBooking>, { id: string; data: Partial<CreateVehicleBookingRequest> }>({
      query: ({ id, data }) => ({
        url: `transport/bookings/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "VehicleBooking", id }, "VehicleBooking"],
    }),

    approveVehicleBooking: builder.mutation<ApiResponse<VehicleBooking>, { id: string; approved: boolean; notes?: string }>({
      query: ({ id, approved, notes }) => ({
        url: `transport/bookings/${id}/approve`,
        method: "PUT",
        body: { approved, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "VehicleBooking", id }, "VehicleBooking"],
    }),

    completeVehicleBooking: builder.mutation<ApiResponse<VehicleBooking>, { 
      id: string; 
      mileageEnd: number; 
      fuelUsed?: number; 
      notes?: string 
    }>({
      query: ({ id, mileageEnd, fuelUsed, notes }) => ({
        url: `transport/bookings/${id}/complete`,
        method: "PUT",
        body: { mileageEnd, fuelUsed, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "VehicleBooking", id }, "VehicleBooking", "Vehicle"],
    }),

    cancelVehicleBooking: builder.mutation<ApiResponse<VehicleBooking>, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `transport/bookings/${id}/cancel`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "VehicleBooking", id }, "VehicleBooking"],
    }),

    // Maintenance Management
    getMaintenanceReports: builder.query<PaginatedResponse<MaintenanceReport>, TransportFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `transport/maintenance?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        data: response.data || [],
        total: response.total || 0,
        page: response.page || 1,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 1,
      }),
      providesTags: ["MaintenanceReport"],
    }),

    getMaintenanceReport: builder.query<MaintenanceReport, string>({
      query: (id) => `transport/maintenance/${id}`,
      transformResponse: (response: ApiResponse<MaintenanceReport>) => response.data,
      providesTags: (result, error, id) => [{ type: "MaintenanceReport", id }],
    }),

    createMaintenanceReport: builder.mutation<ApiResponse<MaintenanceReport>, CreateMaintenanceReportRequest>({
      query: (data) => ({
        url: "transport/maintenance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MaintenanceReport", "Vehicle"],
    }),

    updateMaintenanceReport: builder.mutation<ApiResponse<MaintenanceReport>, { 
      id: string; 
      data: Partial<CreateMaintenanceReportRequest> 
    }>({
      query: ({ id, data }) => ({
        url: `transport/maintenance/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "MaintenanceReport", id }, "MaintenanceReport"],
    }),

    deleteMaintenanceReport: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `transport/maintenance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "MaintenanceReport", id }, "MaintenanceReport"],
    }),

    // Analytics and Reports
    getTransportAnalytics: builder.query<TransportAnalytics, void>({
      query: () => "transport/analytics",
      transformResponse: (response: ApiResponse<TransportAnalytics>) => response.data,
      providesTags: ["TransportAnalytics"],
    }),

    getAvailableVehicles: builder.query<Vehicle[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => 
        `transport/vehicles/available?startDate=${startDate}&endDate=${endDate}`,
      transformResponse: (response: ApiResponse<Vehicle[]>) => response.data,
      providesTags: ["Vehicle"],
    }),

    getDriverSchedule: builder.query<VehicleBooking[], { driverId: string; startDate: string; endDate: string }>({
      query: ({ driverId, startDate, endDate }) => 
        `transport/drivers/${driverId}/schedule?startDate=${startDate}&endDate=${endDate}`,
      transformResponse: (response: ApiResponse<VehicleBooking[]>) => response.data,
      providesTags: ["VehicleBooking"],
    }),

    getVehicleHistory: builder.query<{
      bookings: VehicleBooking[];
      maintenance: MaintenanceReport[];
    }, string>({
      query: (vehicleId) => `transport/vehicles/${vehicleId}/history`,
      transformResponse: (response: ApiResponse<{
        bookings: VehicleBooking[];
        maintenance: MaintenanceReport[];
      }>) => response.data,
      providesTags: (result, error, vehicleId) => [
        { type: "Vehicle", id: vehicleId },
        "VehicleBooking",
        "MaintenanceReport"
      ],
    }),
  }),
});

export const {
  // Driver Management
  useGetDriversQuery,
  useGetDriverQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,

  // Vehicle Management
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useAssignVehicleToDriverMutation,

  // Vehicle Booking Management
  useGetVehicleBookingsQuery,
  useGetVehicleBookingQuery,
  useCreateVehicleBookingMutation,
  useUpdateVehicleBookingMutation,
  useApproveVehicleBookingMutation,
  useCompleteVehicleBookingMutation,
  useCancelVehicleBookingMutation,

  // Maintenance Management
  useGetMaintenanceReportsQuery,
  useGetMaintenanceReportQuery,
  useCreateMaintenanceReportMutation,
  useUpdateMaintenanceReportMutation,
  useDeleteMaintenanceReportMutation,

  // Analytics and Reports
  useGetTransportAnalyticsQuery,
  useGetAvailableVehiclesQuery,
  useGetDriverScheduleQuery,
  useGetVehicleHistoryQuery,
} = transportApi; 