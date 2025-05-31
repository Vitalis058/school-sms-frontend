import { baseApi } from "./baseApi";
import { 
  ApiResponse, 
  PaginatedResponse,
  FeeStructure,
  FeePayment,
  FeeRecord,
  FeeStatement,
  FeeAnalytics,
  FeeReminder,
  Scholarship,
  ScholarshipApplication,
  CreateFeeStructureRequest,
  CreateFeePaymentRequest,
  FeeFilters,
  PaymentFilters,
  CreateScholarshipRequest,
  CreateScholarshipApplicationRequest,
} from "../types";

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fee Structure Management
    getFeeStructures: builder.query<PaginatedResponse<FeeStructure>, FeeFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/fee-structures?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    getFeeStructure: builder.query<ApiResponse<FeeStructure>, string>({
      query: (id) => `finance/fee-structures/${id}`,
      providesTags: (result, error, id) => [{ type: "Fee", id }],
    }),

    createFeeStructure: builder.mutation<ApiResponse<FeeStructure>, CreateFeeStructureRequest>({
      query: (data) => ({
        url: "finance/fee-structures",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),

    updateFeeStructure: builder.mutation<ApiResponse<FeeStructure>, { id: string; data: Partial<CreateFeeStructureRequest> }>({
      query: ({ id, data }) => ({
        url: `finance/fee-structures/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Fee", id }, "Fee"],
    }),

    deleteFeeStructure: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `finance/fee-structures/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Fee", id }, "Fee"],
    }),

    // Fee Records Management
    getFeeRecords: builder.query<PaginatedResponse<FeeRecord>, FeeFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/fee-records?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    getStudentFeeRecords: builder.query<ApiResponse<FeeRecord[]>, string>({
      query: (studentId) => `finance/students/${studentId}/fee-records`,
      providesTags: (result, error, studentId) => [{ type: "Fee", id: studentId }],
    }),

    getFeeStatement: builder.query<ApiResponse<FeeStatement>, { studentId: string; academicYear?: string }>({
      query: ({ studentId, academicYear }) => {
        const params = new URLSearchParams();
        if (academicYear) params.append("academicYear", academicYear);
        return `finance/students/${studentId}/statement?${params.toString()}`;
      },
      providesTags: (result, error, { studentId }) => [{ type: "Fee", id: studentId }],
    }),

    // Payment Management
    getFeePayments: builder.query<PaginatedResponse<FeePayment>, PaymentFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/payments?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    createFeePayment: builder.mutation<ApiResponse<FeePayment>, CreateFeePaymentRequest>({
      query: (data) => ({
        url: "finance/payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          const newPayment = result.data;
          
          // Add the new payment to the payments cache
          dispatch(
            financeApi.util.updateQueryData('getFeePayments', {}, (draft) => {
              if (draft.data) {
                draft.data.unshift(newPayment); // Add to beginning of list
              }
            })
          );
          
          // Update student-specific payments if applicable
          if (arg.studentId) {
            dispatch(
              financeApi.util.updateQueryData('getFeePayments', { studentId: arg.studentId }, (draft) => {
                if (draft.data) {
                  draft.data.unshift(newPayment);
                }
              })
            );
          }
        } catch (error) {
          console.error('Failed to create payment:', error);
        }
      },
    }),

    updateFeePayment: builder.mutation<ApiResponse<FeePayment>, { id: string; data: Partial<CreateFeePaymentRequest> }>({
      query: ({ id, data }) => ({
        url: `finance/payments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Fee", id }, "Fee"],
    }),

    deleteFeePayment: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `finance/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Fee", id }, "Fee"],
    }),

    // Analytics and Reports
    getFeeAnalytics: builder.query<ApiResponse<FeeAnalytics>, { academicYear?: string; gradeId?: string; streamId?: string }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/analytics?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    getCollectionReport: builder.query<ApiResponse<any>, { startDate: string; endDate: string; gradeId?: string }>({
      query: ({ startDate, endDate, gradeId }) => {
        const params = new URLSearchParams();
        params.append("startDate", startDate);
        params.append("endDate", endDate);
        if (gradeId) params.append("gradeId", gradeId);
        return `finance/reports/collection?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    getOutstandingReport: builder.query<ApiResponse<any>, { gradeId?: string; streamId?: string }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/reports/outstanding?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    // Fee Reminders
    getFeeReminders: builder.query<PaginatedResponse<FeeReminder>, { studentId?: string; status?: string }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/reminders?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    sendFeeReminder: builder.mutation<ApiResponse<FeeReminder>, { studentId: string; feeRecordId: string; reminderType: string }>({
      query: (data) => ({
        url: "finance/reminders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),

    // Scholarship Management
    getScholarships: builder.query<PaginatedResponse<Scholarship>, { academicYear?: string; type?: string; isActive?: boolean }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/scholarships?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    createScholarship: builder.mutation<ApiResponse<Scholarship>, CreateScholarshipRequest>({
      query: (data) => ({
        url: "finance/scholarships",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),

    updateScholarship: builder.mutation<ApiResponse<Scholarship>, { id: string; data: Partial<CreateScholarshipRequest> }>({
      query: ({ id, data }) => ({
        url: `finance/scholarships/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Fee", id }, "Fee"],
    }),

    deleteScholarship: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `finance/scholarships/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Fee", id }, "Fee"],
    }),

    // Scholarship Applications
    getScholarshipApplications: builder.query<PaginatedResponse<ScholarshipApplication>, { studentId?: string; scholarshipId?: string; status?: string }>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `finance/scholarship-applications?${params.toString()}`;
      },
      providesTags: ["Fee"],
    }),

    createScholarshipApplication: builder.mutation<ApiResponse<ScholarshipApplication>, CreateScholarshipApplicationRequest>({
      query: (data) => ({
        url: "finance/scholarship-applications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),

    updateScholarshipApplication: builder.mutation<ApiResponse<ScholarshipApplication>, { id: string; status: string; approvedAmount?: number; remarks?: string }>({
      query: ({ id, ...data }) => ({
        url: `finance/scholarship-applications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Fee", id }, "Fee"],
    }),

    // Bulk Operations
    bulkCreateFeeRecords: builder.mutation<ApiResponse<FeeRecord[]>, { feeStructureId: string; studentIds: string[] }>({
      query: (data) => ({
        url: "finance/fee-records/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),

    bulkSendReminders: builder.mutation<ApiResponse<FeeReminder[]>, { studentIds: string[]; reminderType: string }>({
      query: (data) => ({
        url: "finance/reminders/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),

    // Receipt Generation
    generateReceipt: builder.mutation<ApiResponse<{ receiptUrl: string }>, string>({
      query: (paymentId) => ({
        url: `finance/payments/${paymentId}/receipt`,
        method: "POST",
      }),
    }),

    // Export Functions
    exportFeeReport: builder.mutation<ApiResponse<{ downloadUrl: string }>, { type: string; filters: any }>({
      query: (data) => ({
        url: "finance/export",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  // Fee Structure Management
  useGetFeeStructuresQuery,
  useGetFeeStructureQuery,
  useCreateFeeStructureMutation,
  useUpdateFeeStructureMutation,
  useDeleteFeeStructureMutation,

  // Fee Records Management
  useGetFeeRecordsQuery,
  useGetStudentFeeRecordsQuery,
  useGetFeeStatementQuery,

  // Payment Management
  useGetFeePaymentsQuery,
  useCreateFeePaymentMutation,
  useUpdateFeePaymentMutation,
  useDeleteFeePaymentMutation,

  // Analytics and Reports
  useGetFeeAnalyticsQuery,
  useGetCollectionReportQuery,
  useGetOutstandingReportQuery,

  // Fee Reminders
  useGetFeeRemindersQuery,
  useSendFeeReminderMutation,

  // Scholarship Management
  useGetScholarshipsQuery,
  useCreateScholarshipMutation,
  useUpdateScholarshipMutation,
  useDeleteScholarshipMutation,

  // Scholarship Applications
  useGetScholarshipApplicationsQuery,
  useCreateScholarshipApplicationMutation,
  useUpdateScholarshipApplicationMutation,

  // Bulk Operations
  useBulkCreateFeeRecordsMutation,
  useBulkSendRemindersMutation,

  // Receipt and Export
  useGenerateReceiptMutation,
  useExportFeeReportMutation,
} = financeApi; 