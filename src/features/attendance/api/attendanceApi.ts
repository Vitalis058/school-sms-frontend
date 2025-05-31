import { baseApi } from '@/store/api/baseApi';
import {
  AttendanceRecord,
  AttendanceFilters,
  AttendanceStats,
  StudentAttendanceSummary,
  ClassAttendanceData,
  AttendanceReportData,
  BulkAttendanceUpdate,
  AttendanceNotification,
  AttendancePattern,
  AttendanceStatus
} from '../types';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get attendance records with filters
    getAttendanceRecords: builder.query<
      { data: AttendanceRecord[]; total: number },
      AttendanceFilters & { page?: number; limit?: number }
    >({
      query: (filters) => ({
        url: 'attendance/records',
        params: filters,
      }),
      providesTags: ['Attendance'],
    }),

    // Get attendance for a specific class and date
    getClassAttendance: builder.query<ClassAttendanceData, { classId: string; date: string }>({
      query: ({ classId, date }) => ({
        url: `attendance/class/${classId}`,
        params: { date },
      }),
      providesTags: ['Attendance'],
    }),

    // Get attendance statistics
    getAttendanceStats: builder.query<AttendanceStats, AttendanceFilters>({
      query: (filters) => ({
        url: 'attendance/stats',
        params: filters,
      }),
      providesTags: ['Attendance'],
    }),

    // Get student attendance summary
    getStudentAttendanceSummary: builder.query<
      StudentAttendanceSummary[],
      { classId?: string; gradeId?: string; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: 'attendance/student-summary',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    // Get attendance report data
    getAttendanceReport: builder.query<
      AttendanceReportData,
      { classId: string; startDate: string; endDate: string; type: string }
    >({
      query: (params) => ({
        url: 'attendance/report',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    // Get attendance patterns for students
    getAttendancePatterns: builder.query<
      AttendancePattern[],
      { classId?: string; gradeId?: string; severity?: string }
    >({
      query: (params) => ({
        url: 'attendance/patterns',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    // Get attendance notifications
    getAttendanceNotifications: builder.query<
      AttendanceNotification[],
      { parentId?: string; status?: string; limit?: number }
    >({
      query: (params) => ({
        url: 'attendance/notifications',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    // Mark single student attendance
    markAttendance: builder.mutation<
      AttendanceRecord,
      {
        studentId: string;
        classId: string;
        date: string;
        status: AttendanceStatus;
        timeIn?: string;
        timeOut?: string;
        remarks?: string;
      }
    >({
      query: (data) => ({
        url: 'attendance/mark',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Bulk update attendance for a class
    bulkUpdateAttendance: builder.mutation<
      { success: boolean; updated: number },
      BulkAttendanceUpdate
    >({
      query: (data) => ({
        url: 'attendance/bulk-update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Update attendance record
    updateAttendanceRecord: builder.mutation<
      AttendanceRecord,
      {
        id: string;
        status?: AttendanceStatus;
        timeIn?: string;
        timeOut?: string;
        remarks?: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `attendance/records/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Delete attendance record
    deleteAttendance: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `attendance/records/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Send attendance notification to parents
    sendAttendanceNotification: builder.mutation<
      { success: boolean },
      { studentIds: string[]; type: string; message?: string }
    >({
      query: (data) => ({
        url: 'attendance/notify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Generate attendance report
    generateAttendanceReport: builder.mutation<
      { reportUrl: string },
      { classId: string; startDate: string; endDate: string; format: 'pdf' | 'excel' }
    >({
      query: (data) => ({
        url: 'attendance/generate-report',
        method: 'POST',
        body: data,
      }),
    }),

    // Import attendance from file
    importAttendance: builder.mutation<
      { success: boolean; imported: number; errors: string[] },
      FormData
    >({
      query: (formData) => ({
        url: 'attendance/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Get attendance dashboard data
    getAttendanceDashboard: builder.query<
      {
        todayStats: AttendanceStats;
        weeklyTrend: { date: string; attendanceRate: number }[];
        topAbsentees: StudentAttendanceSummary[];
        recentPatterns: AttendancePattern[];
        pendingNotifications: number;
      },
      { gradeId?: string; streamId?: string }
    >({
      query: (params) => ({
        url: 'attendance/dashboard',
        params,
      }),
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceRecordsQuery,
  useGetClassAttendanceQuery,
  useGetAttendanceStatsQuery,
  useGetStudentAttendanceSummaryQuery,
  useGetAttendanceReportQuery,
  useGetAttendancePatternsQuery,
  useGetAttendanceNotificationsQuery,
  useMarkAttendanceMutation,
  useBulkUpdateAttendanceMutation,
  useUpdateAttendanceRecordMutation,
  useDeleteAttendanceMutation,
  useSendAttendanceNotificationMutation,
  useGenerateAttendanceReportMutation,
  useImportAttendanceMutation,
  useGetAttendanceDashboardQuery,
} = attendanceApi; 