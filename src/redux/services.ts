// export default teachersSlice.reducer;
import {
  DepartmentType,
  GradesType,
  ParentType,
  StreamsType,
  StudentType,
  SubjectType,
  TeacherType,
  TimeSlotType,
} from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const schoolApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
  reducerPath: "school_api",
  tagTypes: ["Departments"],
  endpoints: (build) => ({
    getAllTeachers: build.query<TeacherType[], void>({
      query: () => "teachers",
      keepUnusedDataFor: 300,
    }),

    getAllStudents: build.query<StudentType[], void>({
      query: () => "students",
      keepUnusedDataFor: 300,
    }),

    getAllDepartments: build.query<DepartmentType[], void>({
      query: () => "departments",
      providesTags: ["Departments"],
    }),

    getAllGrades: build.query<GradesType[], void>({
      query: () => "grades",
    }),

    getAllSubjects: build.query<SubjectType[], void>({
      query: () => "subjects",
      keepUnusedDataFor: 180,
    }),

    getAllStreams: build.query<StreamsType[], void>({
      query: () => "streams",
    }),

    getAllParents: build.query<ParentType[], void>({
      query: () => "parents",
      keepUnusedDataFor: 180,
    }),

    getAllTimeSlots: build.query<TimeSlotType[], void>({
      query: () => "timeslots",
      keepUnusedDataFor: 180,
    }),
  }),
});

export const {
  useGetAllTeachersQuery,
  useGetAllDepartmentsQuery,
  useGetAllGradesQuery,
  useGetAllParentsQuery,
  useGetAllStreamsQuery,
  useGetAllStudentsQuery,
  useGetAllSubjectsQuery,
  useGetAllTimeSlotsQuery,
} = schoolApi;
