import { baseApi } from "./baseApi";
import {
  Teacher,
  CreateTeacherRequest,
  TeacherFilters,
  ApiResponse,
  PaginatedResponse,
} from "../types";

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Teacher Operations
    getTeachers: builder.query<PaginatedResponse<Teacher>, TeacherFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `teachers?${params.toString()}`;
      },
      providesTags: ["Teacher"],
    }),
    
    getTeacher: builder.query<Teacher, string>({
      query: (id) => `teachers/${id}`,
      providesTags: (result, error, id) => [{ type: "Teacher", id }],
    }),
    
    getTeachersByDepartment: builder.query<Teacher[], string>({
      query: (departmentId) => `teachers?departmentId=${departmentId}`,
      providesTags: ["Teacher"],
    }),
    
    getAvailableTeachers: builder.query<Teacher[], { timeSlotId: string; day: string }>({
      query: ({ timeSlotId, day }) => 
        `teachers/available?timeSlotId=${timeSlotId}&day=${day}`,
      providesTags: ["Teacher"],
    }),
    
    createTeacher: builder.mutation<ApiResponse<Teacher>, CreateTeacherRequest>({
      query: (data) => ({
        url: "teachers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Teacher", "Department", "Subject"],
    }),
    
    updateTeacher: builder.mutation<ApiResponse<Teacher>, { id: string; data: Partial<CreateTeacherRequest> }>({
      query: ({ id, data }) => ({
        url: `teachers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Teacher", id }, 
        "Teacher", 
        "Department", 
        "Subject", 
        "Lesson",
        "Stream"
      ],
    }),
    
    deleteTeacher: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Teacher", id }, 
        "Teacher", 
        "Department", 
        "Subject", 
        "Lesson",
        "Stream"
      ],
    }),

    // Teacher Schedule
    getTeacherSchedule: builder.query<any[], { teacherId: string; week?: string }>({
      query: ({ teacherId, week }) => {
        const params = new URLSearchParams();
        if (week) params.append("week", week);
        return `teachers/${teacherId}/schedule?${params.toString()}`;
      },
      providesTags: (result, error, { teacherId }) => [{ type: "Teacher", id: teacherId }, "Lesson"],
    }),
    
    // Teacher Subjects
    assignSubjectToTeacher: builder.mutation<ApiResponse<void>, { teacherId: string; subjectId: string }>({
      query: ({ teacherId, subjectId }) => ({
        url: `teachers/${teacherId}/subjects`,
        method: "POST",
        body: { subjectId },
      }),
      invalidatesTags: (result, error, { teacherId }) => [
        { type: "Teacher", id: teacherId }, 
        "Teacher", 
        "Subject", 
        "Lesson"
      ],
    }),
    
    removeSubjectFromTeacher: builder.mutation<ApiResponse<void>, { teacherId: string; subjectId: string }>({
      query: ({ teacherId, subjectId }) => ({
        url: `teachers/${teacherId}/subjects/${subjectId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teacherId }) => [
        { type: "Teacher", id: teacherId }, 
        "Teacher", 
        "Subject", 
        "Lesson"
      ],
    }),

    // Teacher Attendance
    getTeacherAttendance: builder.query<any[], { teacherId: string; startDate?: string; endDate?: string }>({
      query: ({ teacherId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `teachers/${teacherId}/attendance?${params.toString()}`;
      },
      providesTags: (result, error, { teacherId }) => [{ type: "Teacher", id: teacherId }, "Attendance"],
    }),
    
    markTeacherAttendance: builder.mutation<ApiResponse<any>, { teacherId: string; date: string; status: string; notes?: string }>({
      query: (data) => ({
        url: "teachers/attendance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Teacher", "Attendance"],
    }),
  }),
});

export const {
  // Teacher Operations
  useGetTeachersQuery,
  useGetTeacherQuery,
  useGetTeachersByDepartmentQuery,
  useGetAvailableTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  
  // Teacher Schedule
  useGetTeacherScheduleQuery,
  
  // Teacher Subjects
  useAssignSubjectToTeacherMutation,
  useRemoveSubjectFromTeacherMutation,
  
  // Teacher Attendance
  useGetTeacherAttendanceQuery,
  useMarkTeacherAttendanceMutation,
} = teacherApi; 