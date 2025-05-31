import { baseApi } from "./baseApi";
import {
  PerformanceAnalytics,
  ClassPerformanceStats,
  StudentPerformance,
  PerformanceFilter,
  PerformanceResponse,
  ClassPerformanceResponse,
} from "../types";

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get student performance analytics
    getStudentPerformance: builder.query<PerformanceResponse, { studentId: string; filters?: PerformanceFilter }>({
      query: ({ studentId, filters = {} }) => ({
        url: `/performance/student/${studentId}`,
        params: filters,
      }),
      providesTags: (result, error, { studentId }) => [
        { type: "Performance", id: studentId },
        "Performance",
      ],
    }),

    // Get class performance statistics
    getClassPerformance: builder.query<ClassPerformanceResponse, { gradeId: string; streamId?: string; filters?: PerformanceFilter }>({
      query: ({ gradeId, streamId, filters = {} }) => ({
        url: `/performance/class/${gradeId}${streamId ? `/${streamId}` : ''}`,
        params: filters,
      }),
      providesTags: (result, error, { gradeId, streamId }) => [
        { type: "Performance", id: `${gradeId}-${streamId || 'all'}` },
        "Performance",
      ],
    }),

    // Get all students performance for a class
    getClassStudentsPerformance: builder.query<PerformanceResponse, { gradeId: string; streamId?: string; filters?: PerformanceFilter }>({
      query: ({ gradeId, streamId, filters = {} }) => ({
        url: `/performance/class/${gradeId}${streamId ? `/${streamId}` : ''}/students`,
        params: filters,
      }),
      providesTags: ["Performance"],
    }),

    // Get subject performance across classes
    getSubjectPerformance: builder.query<PerformanceResponse, { subjectId: string; filters?: PerformanceFilter }>({
      query: ({ subjectId, filters = {} }) => ({
        url: `/performance/subject/${subjectId}`,
        params: filters,
      }),
      providesTags: (result, error, { subjectId }) => [
        { type: "Performance", id: `subject-${subjectId}` },
        "Performance",
      ],
    }),

    // Get performance trends
    getPerformanceTrends: builder.query<{
      success: boolean;
      data: {
        overallTrend: { period: string; average: number }[];
        subjectTrends: { subjectId: string; subject: string; trend: { period: string; average: number }[] }[];
        classComparison: { gradeId: string; streamId: string; average: number; trend: string }[];
      };
    }, { filters?: PerformanceFilter }>({
      query: ({ filters = {} }) => ({
        url: `/performance/trends`,
        params: filters,
      }),
      providesTags: ["Performance"],
    }),

    // Add new performance record
    addPerformanceRecord: builder.mutation<{ success: boolean; data: StudentPerformance }, {
      studentId: string;
      subjectId: string;
      gradeId: string;
      streamId: string;
      academicYear: string;
      term: string;
      assessmentType: 'EXAM' | 'ASSIGNMENT' | 'QUIZ' | 'PROJECT' | 'CONTINUOUS_ASSESSMENT';
      score: number;
      maxScore: number;
      percentage: number;
      grade_letter: string;
      assessmentDate: string;
      remarks?: string;
    }>({
      query: (performanceData) => ({
        url: `/performance`,
        method: "POST",
        body: performanceData,
      }),
      invalidatesTags: ["Performance"],
    }),

    // Update performance record
    updatePerformanceRecord: builder.mutation<{ success: boolean; data: StudentPerformance }, { id: string; data: Partial<StudentPerformance> }>({
      query: ({ id, data }) => ({
        url: `/performance/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Performance", id },
        "Performance",
      ],
    }),

    // Delete performance record
    deletePerformanceRecord: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/performance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Performance"],
    }),

    // Get performance summary for dashboard
    getPerformanceSummary: builder.query<{
      success: boolean;
      data: {
        totalStudents: number;
        averagePerformance: number;
        performanceTrend: 'UP' | 'DOWN' | 'STABLE';
        trendPercentage: number;
        topPerformers: { studentId: string; studentName: string; average: number }[];
        needsAttention: { studentId: string; studentName: string; average: number }[];
        subjectPerformance: { subjectId: string; subjectName: string; average: number; trend: string }[];
      };
    }, { gradeId?: string; streamId?: string }>({
      query: ({ gradeId, streamId }) => ({
        url: `/performance/summary`,
        params: { gradeId, streamId },
      }),
      providesTags: ["Performance"],
    }),
  }),
});

export const {
  useGetStudentPerformanceQuery,
  useGetClassPerformanceQuery,
  useGetClassStudentsPerformanceQuery,
  useGetSubjectPerformanceQuery,
  useGetPerformanceTrendsQuery,
  useAddPerformanceRecordMutation,
  useUpdatePerformanceRecordMutation,
  useDeletePerformanceRecordMutation,
  useGetPerformanceSummaryQuery,
} = performanceApi; 