import { baseApi } from "./baseApi";
import {
  Student,
  CreateStudentRequest,
  StudentFilters,
  Attendance,
  CreateAttendanceRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Student Operations
    getStudents: builder.query<PaginatedResponse<Student>, StudentFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `students?${params.toString()}`;
      },
      providesTags: ["Student"],
    }),
    
    getStudent: builder.query<Student, string>({
      query: (id) => `students/${id}`,
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),
    
    getStudentsByStream: builder.query<Student[], string>({
      query: (streamId) => `students?streamId=${streamId}`,
      providesTags: ["Student"],
    }),
    
    getStudentsByGrade: builder.query<Student[], string>({
      query: (gradeId) => `students?gradeId=${gradeId}`,
      providesTags: ["Student"],
    }),
    
    createStudent: builder.mutation<ApiResponse<Student>, CreateStudentRequest>({
      query: (data) => ({
        url: "students",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Student", "Grade", "Stream", "Parent"],
    }),
    
    updateStudent: builder.mutation<ApiResponse<Student>, { id: string; data: Partial<CreateStudentRequest> }>({
      query: ({ id, data }) => ({
        url: `students/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Student", id }, 
        "Student", 
        "Grade", 
        "Stream", 
        "Parent",
        "Attendance"
      ],
    }),
    
    deleteStudent: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Student", id }, 
        "Student", 
        "Grade", 
        "Stream", 
        "Parent",
        "Attendance"
      ],
    }),

    // Attendance Operations
    getStudentAttendance: builder.query<Attendance[], { studentId: string; startDate?: string; endDate?: string }>({
      query: ({ studentId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `students/${studentId}/attendance?${params.toString()}`;
      },
      providesTags: (result, error, { studentId }) => [{ type: "Attendance", id: studentId }],
    }),
    
    getAttendanceByDate: builder.query<Attendance[], { date: string; streamId?: string; gradeId?: string }>({
      query: ({ date, streamId, gradeId }) => {
        const params = new URLSearchParams();
        params.append("date", date);
        if (streamId) params.append("streamId", streamId);
        if (gradeId) params.append("gradeId", gradeId);
        return `attendance?${params.toString()}`;
      },
      providesTags: ["Attendance"],
    }),
    
    updateAttendance: builder.mutation<ApiResponse<Attendance>, { id: string; data: Partial<CreateAttendanceRequest> }>({
      query: ({ id, data }) => ({
        url: `attendance/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Attendance", id }, "Attendance", "Student"],
    }),
    
    bulkMarkAttendance: builder.mutation<ApiResponse<Attendance[]>, CreateAttendanceRequest[]>({
      query: (attendanceList) => ({
        url: "attendance/bulk",
        method: "POST",
        body: { attendanceList },
      }),
      invalidatesTags: ["Attendance", "Student"],
    }),

    // Student Performance
    getStudentGrades: builder.query<any[], { studentId: string; subjectId?: string; term?: string }>({
      query: ({ studentId, subjectId, term }) => {
        const params = new URLSearchParams();
        if (subjectId) params.append("subjectId", subjectId);
        if (term) params.append("term", term);
        return `students/${studentId}/grades?${params.toString()}`;
      },
      providesTags: (result, error, { studentId }) => [{ type: "Student", id: studentId }],
    }),
    
    // Student Reports
    getStudentReport: builder.query<any, { studentId: string; term: string; year: string }>({
      query: ({ studentId, term, year }) => 
        `students/${studentId}/report?term=${term}&year=${year}`,
      providesTags: (result, error, { studentId }) => [{ type: "Student", id: studentId }],
    }),
  }),
});

export const {
  // Student Operations
  useGetStudentsQuery,
  useGetStudentQuery,
  useGetStudentsByStreamQuery,
  useGetStudentsByGradeQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  
  // Attendance Operations
  useGetStudentAttendanceQuery,
  useGetAttendanceByDateQuery,
  useUpdateAttendanceMutation,
  useBulkMarkAttendanceMutation,
  
  // Performance Operations
  useGetStudentGradesQuery,
  useGetStudentReportQuery,
} = studentApi; 