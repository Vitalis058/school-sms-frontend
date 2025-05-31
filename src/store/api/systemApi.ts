import { baseApi } from "./baseApi";
import { ApiResponse } from "../types";

// System Settings Types
export interface SystemSettings {
  general: {
    schoolName: string;
    schoolAddress: string;
    schoolPhone: string;
    schoolEmail: string;
    schoolWebsite: string;
    academicYear: string;
    currentTerm: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    language: string;
  };
  academic: {
    gradingSystem: string;
    passingGrade: string;
    maxAbsences: number;
    termDuration: number;
    classStartTime: string;
    classEndTime: string;
    breakDuration: number;
    lunchDuration: number;
    periodsPerDay: number;
    workingDays: string[];
    holidays: Array<{ name: string; date: string }>;
  };
  library: {
    maxBooksPerStudent: number;
    maxBooksPerTeacher: number;
    loanDurationStudent: number;
    loanDurationTeacher: number;
    maxRenewalsStudent: number;
    maxRenewalsTeacher: number;
    finePerDayStudent: number;
    finePerDayTeacher: number;
    reservationDuration: number;
    autoRenewal: boolean;
    emailReminders: boolean;
    reminderDaysBefore: number;
  };
  transport: {
    maxCapacityPerVehicle: number;
    bookingAdvanceDays: number;
    cancellationHours: number;
    fuelAlertThreshold: number;
    maintenanceAlertDays: number;
    driverMaxHours: number;
    routeOptimization: boolean;
    gpsTracking: boolean;
    parentNotifications: boolean;
  };
  communication: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushNotificationsEnabled: boolean;
    announcementRetentionDays: number;
    emailProvider: string;
    smsProvider: string;
    defaultSender: string;
    emergencyContactsOnly: boolean;
    parentPortalEnabled: boolean;
    studentPortalEnabled: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireLowercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
    ipWhitelisting: boolean;
    auditLogging: boolean;
    dataRetentionDays: number;
  };
  notifications: {
    emailNotifications: {
      newEnrollment: boolean;
      gradeUpdates: boolean;
      attendanceAlerts: boolean;
      feeReminders: boolean;
      libraryOverdue: boolean;
      transportUpdates: boolean;
      systemMaintenance: boolean;
    };
    smsNotifications: {
      emergencyAlerts: boolean;
      attendanceAlerts: boolean;
      transportUpdates: boolean;
      feeReminders: boolean;
      examSchedules: boolean;
    };
    pushNotifications: {
      announcements: boolean;
      assignments: boolean;
      grades: boolean;
      attendance: boolean;
      library: boolean;
      transport: boolean;
    };
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    backupTime: string;
    retentionDays: number;
    cloudBackup: boolean;
    cloudProvider: string;
    encryptBackups: boolean;
    backupLocation: string;
    lastBackup: string;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    allowedIPs: string[];
    scheduledMaintenance: string | null;
    systemVersion: string;
    lastUpdate: string;
    updateChannel: string;
    autoUpdates: boolean;
  };
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  uptime: number;
  memory: any;
  version: string;
  database: {
    status: string;
    responseTime: number;
  };
  services: {
    authentication: string;
    email: string;
    sms: string;
    backup: string;
    library: string;
    transport: string;
  };
  lastBackup: string;
  maintenanceMode: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  details: any;
}

export const systemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all system settings
    getSystemSettings: builder.query<ApiResponse<SystemSettings>, void>({
      query: () => "/system/settings",
      providesTags: ["SystemSettings"],
    }),

    // Get specific settings category
    getSettingsCategory: builder.query<ApiResponse<any>, string>({
      query: (category) => `/system/settings/${category}`,
      providesTags: ["SystemSettings"],
    }),

    // Update system settings
    updateSystemSettings: builder.mutation<ApiResponse<any>, { category: string; data: any }>({
      query: ({ category, data }) => ({
        url: `/system/settings/${category}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SystemSettings"],
    }),

    // Reset settings category to default
    resetSettingsCategory: builder.mutation<ApiResponse<any>, string>({
      query: (category) => ({
        url: `/system/settings/${category}/reset`,
        method: "POST",
      }),
      invalidatesTags: ["SystemSettings"],
    }),

    // Get system health
    getSystemHealth: builder.query<ApiResponse<SystemHealth>, void>({
      query: () => "/system/health",
      providesTags: ["SystemHealth"],
    }),

    // Get system logs
    getSystemLogs: builder.query<ApiResponse<SystemLog[]>, { level?: string; limit?: number }>({
      query: (params) => ({
        url: "/system/logs",
        params,
      }),
      providesTags: ["SystemLogs"],
    }),

    // Export settings
    exportSettings: builder.query<ApiResponse<any>, void>({
      query: () => "/system/export",
    }),

    // Import settings
    importSettings: builder.mutation<ApiResponse<any>, { settings: any }>({
      query: (data) => ({
        url: "/system/import",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SystemSettings"],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useGetSettingsCategoryQuery,
  useUpdateSystemSettingsMutation,
  useResetSettingsCategoryMutation,
  useGetSystemHealthQuery,
  useGetSystemLogsQuery,
  useLazyExportSettingsQuery,
  useImportSettingsMutation,
} = systemApi; 