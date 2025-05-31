import { baseApi } from "./baseApi";
import {
  CreateGradeRequest,
  CreateStreamRequest,
  CreateDepartmentRequest,
  CreateSubjectRequest,
  CreateLessonRequest,
  CreateTimeSlotRequest,
  LessonFilters,
  ApiResponse,
  PaginatedResponse,
} from "../types";

// Types for API responses
interface Grade {
  id: string;
  name: string;
  slug: string;
}

interface Stream {
  id: string;
  name: string;
  slug: string;
  gradeId: string;
  teacherId?: string;
  Grade?: Grade;
  Teacher?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count?: {
    students: number;
    Lesson: number;
  };
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  subjectCode: string;
  shortname: string;
  departmentId: string;
  Department?: {
    id: string;
    name: string;
    slug: string;
  };
  teachers?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  active: boolean;
  optional: boolean;
  fieldtrips: boolean;
  labRequired: boolean;
  _count?: {
    teachers: number;
    Lesson: number;
  };
}

interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Lesson {
  id: string;
  name: string;
  description?: string;
  day: string;
  teacherId: string;
  Teacher: Teacher;
  subjectId: string;
  Subject: Subject;
  streamId: string;
  Stream: Stream & { Grade: Grade };
  timeSlotId: string;
  TimeSlot: TimeSlot;
  createdAt: string;
  updatedAt: string;
}

interface TimetableData {
  timetable: {
    day: string;
    dayName: string;
    lessons: Lesson[];
  }[];
  timeSlots: TimeSlot[];
  totalLessons: number;
}

interface ConflictInfo {
  type: 'teacher' | 'stream';
  message: string;
  conflictingLesson: Lesson;
}

export const academicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Grades
    getGrades: builder.query<Grade[], void>({
      query: () => "/grades",
      transformResponse: (response: any) => response.data || response,
      providesTags: ["Grade"],
    }),
    
    getGrade: builder.query<Grade, string>({
      query: (id) => `grades/${id}`,
      providesTags: (result, error, id) => [{ type: "Grade", id }],
    }),
    
    createGrade: builder.mutation<ApiResponse<Grade>, CreateGradeRequest>({
      query: (data) => ({
        url: "grades",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Grade"],
    }),
    
    updateGrade: builder.mutation<ApiResponse<Grade>, { id: string; data: Partial<CreateGradeRequest> }>({
      query: ({ id, data }) => ({
        url: `grades/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Grade", id }, "Grade"],
    }),
    
    deleteGrade: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `grades/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Grade", id }, "Grade"],
    }),

    // Streams
    getStreams: builder.query<Stream[], void>({
      query: () => "/streams",
      transformResponse: (response: any) => response.data || response,
      providesTags: ["Stream"],
    }),
    
    getStream: builder.query<Stream, string>({
      query: (id) => `streams/${id}`,
      providesTags: (result, error, id) => [{ type: "Stream", id }],
    }),
    
    getStreamsByGrade: builder.query<Stream[], string>({
      query: (gradeId) => `/streams/grade/${gradeId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: ["Stream"],
    }),
    
    createStream: builder.mutation<ApiResponse<Stream>, CreateStreamRequest>({
      query: (data) => ({
        url: "streams",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update - add the stream immediately
        const optimisticStream = {
          id: `temp-${Date.now()}`, // Temporary ID
          name: arg.name,
          slug: arg.name.toLowerCase().replace(/\s+/g, '-'),
          gradeId: arg.gradeId,
          teacherId: arg.teacherId || undefined,
          Grade: undefined,
          Teacher: undefined,
          students: [],
          lessons: [],
        };

        // Apply optimistic updates to all relevant queries
        const patchResults: any[] = [];

        // Update all streams query
        patchResults.push(
          dispatch(
            academicsApi.util.updateQueryData('getStreams', undefined, (draft) => {
              const exists = draft.some(stream => stream.id === optimisticStream.id);
              if (!exists) {
                draft.push(optimisticStream);
                console.log(`Optimistic stream added to all streams cache. Total streams: ${draft.length}`);
              }
            })
          )
        );

        // Update grade-specific streams query
        patchResults.push(
          dispatch(
            academicsApi.util.updateQueryData('getStreamsByGrade', arg.gradeId, (draft) => {
              const exists = draft.some(stream => stream.id === optimisticStream.id);
              if (!exists) {
                draft.push(optimisticStream);
                console.log(`Optimistic stream added to grade ${arg.gradeId} streams cache. Total streams: ${draft.length}`);
              }
            })
          )
        );

        try {
          const { data: result } = await queryFulfilled;
          const newStream = result.data;
          console.log('Stream created successfully:', newStream);
          
          // Replace optimistic updates with real data
          dispatch(
            academicsApi.util.updateQueryData('getStreams', undefined, (draft) => {
              // Remove optimistic entry
              const optimisticIndex = draft.findIndex(stream => stream.id === optimisticStream.id);
              if (optimisticIndex !== -1) {
                draft.splice(optimisticIndex, 1);
                console.log(`Removed optimistic stream from all streams cache`);
              }
              
              // Add real stream if not already present
              const exists = draft.some(stream => stream.id === newStream.id);
              if (!exists) {
                draft.push(newStream);
                console.log(`Added real stream to all streams cache`);
              }
            })
          );

          dispatch(
            academicsApi.util.updateQueryData('getStreamsByGrade', arg.gradeId, (draft) => {
              // Remove optimistic entry
              const optimisticIndex = draft.findIndex(stream => stream.id === optimisticStream.id);
              if (optimisticIndex !== -1) {
                draft.splice(optimisticIndex, 1);
                console.log(`Removed optimistic stream from grade ${arg.gradeId} streams cache`);
              }
              
              // Add real stream if not already present
              const exists = draft.some(stream => stream.id === newStream.id);
              if (!exists) {
                draft.push(newStream);
                console.log(`Added real stream to grade ${arg.gradeId} streams cache`);
              }
            })
          );
        } catch (error) {
          // If the mutation fails, revert the optimistic updates
          patchResults.forEach(patchResult => patchResult.undo());
          console.error('Failed to create stream:', error);
        }
      },
      invalidatesTags: ["Stream", "Grade"],
    }),
    
    updateStream: builder.mutation<ApiResponse<Stream>, { id: string; data: Partial<CreateStreamRequest> }>({
      query: ({ id, data }) => ({
        url: `streams/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          const updatedStream = result.data;
          
          // Update all streams queries that might contain this stream
          dispatch(
            academicsApi.util.updateQueryData('getStreams', undefined, (draft) => {
              const index = draft.findIndex(stream => stream.id === id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...updatedStream };
                console.log(`Updated stream in all streams cache`);
              }
            })
          );
          
          // Update grade-specific queries
          if (data.gradeId || updatedStream.gradeId) {
            const gradeId = data.gradeId || updatedStream.gradeId;
            dispatch(
              academicsApi.util.updateQueryData('getStreamsByGrade', gradeId, (draft) => {
                const index = draft.findIndex(stream => stream.id === id);
                if (index !== -1) {
                  draft[index] = { ...draft[index], ...updatedStream };
                  console.log(`Updated stream in grade ${gradeId} streams cache`);
                }
              })
            );
          }
          
          // Update specific stream query
          dispatch(
            academicsApi.util.updateQueryData('getStream', id, (draft) => {
              Object.assign(draft, updatedStream);
              console.log(`Updated specific stream cache`);
            })
          );
        } catch (error) {
          console.error('Failed to update stream:', error);
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Stream", id }, "Stream", "Grade"],
    }),
    
    deleteStream: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `streams/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Store the stream data before deletion for potential rollback
        let deletedStream: Stream | undefined;
        
        // Optimistically remove from all possible queries
        const patchResults: any[] = [];
        
        // Remove from all streams query
        patchResults.push(
          dispatch(
            academicsApi.util.updateQueryData('getStreams', undefined, (draft) => {
              const index = draft.findIndex(stream => stream.id === id);
              if (index !== -1) {
                deletedStream = draft[index];
                draft.splice(index, 1);
                console.log(`Optimistically removed stream from all streams cache`);
              }
            })
          )
        );

        // Remove from grade-specific queries (we need to check all possible grades)
        if (deletedStream?.gradeId) {
          patchResults.push(
            dispatch(
              academicsApi.util.updateQueryData('getStreamsByGrade', deletedStream.gradeId, (draft) => {
                const index = draft.findIndex(stream => stream.id === id);
                if (index !== -1) {
                  draft.splice(index, 1);
                  console.log(`Optimistically removed stream from grade ${deletedStream?.gradeId} streams cache`);
                }
              })
            )
          );
        }

        try {
          await queryFulfilled;
          console.log('Stream deleted successfully');
        } catch (error) {
          // If the mutation fails, revert the optimistic updates
          patchResults.forEach(patchResult => patchResult.undo());
          console.error('Failed to delete stream:', error);
        }
      },
      invalidatesTags: (result, error, id) => [{ type: "Stream", id }, "Stream", "Grade", "Student"],
    }),

    // Departments
    getDepartments: builder.query<any[], void>({
      query: () => "departments",
      transformResponse: (response: any) => response.data || response,
      providesTags: ["Department"],
    }),
    
    getDepartment: builder.query<any, string>({
      query: (id) => `departments/${id}`,
      providesTags: (result, error, id) => [{ type: "Department", id }],
    }),
    
    createDepartment: builder.mutation<ApiResponse<any>, CreateDepartmentRequest>({
      query: (data) => ({
        url: "departments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Department"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          const newDepartment = result.data;
          
          // Add the new department to the cache
          dispatch(
            academicsApi.util.updateQueryData('getDepartments', undefined, (draft) => {
              draft.push(newDepartment);
            })
          );
        } catch (error) {
          console.error('Failed to create department:', error);
        }
      },
    }),
    
    updateDepartment: builder.mutation<ApiResponse<any>, { id: string; data: Partial<CreateDepartmentRequest> }>({
      query: ({ id, data }) => ({
        url: `departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Department", id }, "Department", "Subject", "Teacher"],
    }),
    
    deleteDepartment: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Department", id }, "Department", "Subject", "Teacher"],
    }),

    // Subjects
    getSubjects: builder.query<Subject[], { 
      departmentId?: string; 
      active?: boolean; 
      optional?: boolean; 
      search?: string; 
    }>({
      query: (params = {}) => ({
        url: "/subjects",
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ["Subject"],
    }),
    
    getSubjectById: builder.query<Subject, string>({
      query: (id) => `/subjects/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: "Subject", id }],
    }),
    
    getSubjectsByDepartment: builder.query<Subject[], string>({
      query: (departmentId) => `subjects?departmentId=${departmentId}`,
      providesTags: ["Subject"],
    }),
    
    createSubject: builder.mutation<Subject, {
      name: string;
      subjectCode: string;
      shortname: string;
      departmentId: string;
      active?: boolean;
      optional?: boolean;
      fieldtrips?: boolean;
      labRequired?: boolean;
    }>({
      query: (data) => ({
        url: "/subjects",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update - add the subject immediately
        const optimisticSubject = {
          id: `temp-${Date.now()}`, // Temporary ID
          name: arg.name,
          subjectCode: arg.subjectCode,
          shortname: arg.shortname,
          departmentId: arg.departmentId,
          active: arg.active ?? true,
          optional: arg.optional ?? false,
          fieldtrips: arg.fieldtrips ?? false,
          labRequired: arg.labRequired ?? false,
          slug: arg.name.toLowerCase().replace(/\s+/g, '-'),
          Department: undefined,
          teachers: [],
          _count: { teachers: 0, Lesson: 0 },
        };

        // Apply optimistic updates to all relevant queries
        const patchResults: any[] = [];

        // Get all possible query parameter combinations that might exist in cache
        const queryVariations = [
          {}, // Main query with no filters
          { departmentId: arg.departmentId }, // Department-specific
          { active: true }, // Active subjects only
          { active: false }, // Inactive subjects only
          { optional: true }, // Optional subjects
          { optional: false }, // Required subjects
          { departmentId: arg.departmentId, active: true }, // Department + active
          { departmentId: arg.departmentId, active: false }, // Department + inactive
          { departmentId: arg.departmentId, optional: true }, // Department + optional
          { departmentId: arg.departmentId, optional: false }, // Department + required
        ];

        // Apply optimistic updates to all matching queries
        queryVariations.forEach(params => {
          const shouldInclude = 
            (!params.departmentId || params.departmentId === optimisticSubject.departmentId) &&
            (params.active === undefined || params.active === optimisticSubject.active) &&
            (params.optional === undefined || params.optional === optimisticSubject.optional);

          if (shouldInclude) {
            console.log(`Adding optimistic subject to cache with params:`, params);
            patchResults.push(
              dispatch(
                academicsApi.util.updateQueryData('getSubjects', params, (draft) => {
                  // Only add if not already present
                  const exists = draft.some(subject => subject.id === optimisticSubject.id);
                  if (!exists) {
                    draft.push(optimisticSubject);
                    console.log(`Optimistic subject added to cache. Total subjects: ${draft.length}`);
                  }
                })
              )
            );
          }
        });

        try {
          const { data: newSubject } = await queryFulfilled;
          console.log('Subject created successfully:', newSubject);
          
          // Replace optimistic updates with real data
          queryVariations.forEach(params => {
            dispatch(
              academicsApi.util.updateQueryData('getSubjects', params, (draft) => {
                // Remove optimistic entry
                const optimisticIndex = draft.findIndex(subject => subject.id === optimisticSubject.id);
                if (optimisticIndex !== -1) {
                  draft.splice(optimisticIndex, 1);
                  console.log(`Removed optimistic subject from cache with params:`, params);
                }
                
                // Check if the real subject should be in this query
                const shouldInclude = 
                  (!params.departmentId || params.departmentId === newSubject.departmentId) &&
                  (params.active === undefined || params.active === newSubject.active) &&
                  (params.optional === undefined || params.optional === newSubject.optional);
                
                if (shouldInclude) {
                  // Only add if not already present
                  const exists = draft.some(subject => subject.id === newSubject.id);
                  if (!exists) {
                    draft.push(newSubject);
                    console.log(`Added real subject to cache with params:`, params);
                  }
                }
              })
            );
          });
        } catch (error) {
          // If the mutation fails, revert the optimistic updates
          patchResults.forEach(patchResult => patchResult.undo());
          console.error('Failed to create subject:', error);
        }
      },
    }),
    
    updateSubject: builder.mutation<Subject, { 
      id: string; 
      data: Partial<{
        name: string;
        subjectCode: string;
        shortname: string;
        departmentId: string;
        active: boolean;
        optional: boolean;
        fieldtrips: boolean;
        labRequired: boolean;
      }>;
    }>({
      query: ({ id, data }) => ({
        url: `/subjects/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id, data }) => {
        const tags: any[] = [
          { type: "Subject", id },
          "Subject",
        ];
        if (data.departmentId) {
          tags.push({ type: "Department", id: data.departmentId });
          tags.push("Department");
        }
        return tags;
      },
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedSubject } = await queryFulfilled;
          
          // Update all subjects queries that might contain this subject
          const queryVariations = [
            {},
            { departmentId: updatedSubject.departmentId },
            { active: true },
            { active: false },
          ];
          
          queryVariations.forEach(params => {
            dispatch(
              academicsApi.util.updateQueryData('getSubjects', params, (draft) => {
                const index = draft.findIndex(subject => subject.id === id);
                if (index !== -1) {
                  // Check if the updated subject should still be in this query
                  const shouldInclude = 
                    (!params.departmentId || params.departmentId === updatedSubject.departmentId) &&
                    (params.active === undefined || params.active === updatedSubject.active);
                  
                  if (shouldInclude) {
                    draft[index] = updatedSubject;
                  } else {
                    draft.splice(index, 1);
                  }
                }
              })
            );
          });
          
          // Update specific subject query
          dispatch(
            academicsApi.util.updateQueryData('getSubjectById', id, (draft) => {
              Object.assign(draft, updatedSubject);
            })
          );
        } catch (error) {
          console.error('Failed to update subject:', error);
        }
      },
    }),
    
    deleteSubject: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Subject", id },
        "Subject",
        "Department", // Invalidate all departments since we don't know which one it belonged to
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          
          // Remove from all possible subject queries
          const queryVariations = [
            {},
            { active: true },
            { active: false },
          ];
          
          queryVariations.forEach(params => {
            dispatch(
              academicsApi.util.updateQueryData('getSubjects', params, (draft) => {
                const index = draft.findIndex(subject => subject.id === id);
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              })
            );
          });
          
          // Also remove from department-specific queries (we don't know which department)
          // This will be handled by the invalidatesTags
        } catch (error) {
          console.error('Failed to delete subject:', error);
        }
      },
    }),

    assignTeacherToSubject: builder.mutation<{ success: boolean; message: string }, {
      subjectId: string;
      teacherId: string;
    }>({
      query: ({ subjectId, teacherId }) => ({
        url: `/subjects/${subjectId}/teachers`,
        method: "POST",
        body: { teacherId },
      }),
      invalidatesTags: (result, error, { subjectId }) => [
        { type: "Subject", id: subjectId },
        "Subject",
      ],
      async onQueryStarted({ subjectId, teacherId }, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;
          
          // Invalidate and refetch the specific subject to get updated teacher list
          dispatch(
            academicsApi.util.invalidateTags([{ type: "Subject", id: subjectId }, "Subject"])
          );
        } catch (error) {
          console.error('Failed to assign teacher:', error);
        }
      },
    }),

    removeTeacherFromSubject: builder.mutation<{ success: boolean; message: string }, {
      subjectId: string;
      teacherId: string;
    }>({
      query: ({ subjectId, teacherId }) => ({
        url: `/subjects/${subjectId}/teachers`,
        method: "DELETE",
        body: { teacherId },
      }),
      invalidatesTags: (result, error, { subjectId }) => [
        { type: "Subject", id: subjectId },
        "Subject",
      ],
      async onQueryStarted({ subjectId, teacherId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          
          // Invalidate and refetch the specific subject to get updated teacher list
          dispatch(
            academicsApi.util.invalidateTags([{ type: "Subject", id: subjectId }, "Subject"])
          );
        } catch (error) {
          console.error('Failed to remove teacher:', error);
        }
      },
    }),

    // Time Slots
    getTimeSlots: builder.query<TimeSlot[], void>({
      query: () => "/timeslots",
      transformResponse: (response: any) => response.data,
      providesTags: ["TimeSlot"],
    }),

    getTimeSlotById: builder.query<TimeSlot, string>({
      query: (id) => `/timeslots/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: "TimeSlot", id }],
    }),

    createTimeSlot: builder.mutation<TimeSlot, CreateTimeSlotRequest>({
      query: (data) => ({
        url: "/timeslots",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["TimeSlot"],
    }),

    updateTimeSlot: builder.mutation<TimeSlot, { id: string; data: Partial<CreateTimeSlotRequest> }>({
      query: ({ id, data }) => ({
        url: `/timeslots/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "TimeSlot", id },
        "TimeSlot",
      ],
    }),

    deleteTimeSlot: builder.mutation<void, string>({
      query: (id) => ({
        url: `/timeslots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "TimeSlot", id },
        "TimeSlot",
      ],
    }),

    // Lessons
    getLessons: builder.query<Lesson[], {
      streamId?: string;
      teacherId?: string;
      subjectId?: string;
      day?: string;
      view?: 'timetable';
    }>({
      query: (params = {}) => ({
        url: "/lessons",
        params,
      }),
      transformResponse: (response: any) => response.data || response,
      providesTags: ["Lesson"],
    }),
    
    getLessonById: builder.query<Lesson, string>({
      query: (id) => `/lessons/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, id) => [{ type: "Lesson", id }],
    }),
    
    getLessonsByStream: builder.query<Lesson[], string>({
      query: (streamId) => `lessons?streamId=${streamId}`,
      providesTags: ["Lesson"],
    }),
    
    getLessonsByTeacher: builder.query<Lesson[], string>({
      query: (teacherId) => `lessons?teacherId=${teacherId}`,
      providesTags: ["Lesson"],
    }),
    
    createLesson: builder.mutation<Lesson | { conflicts: ConflictInfo[] }, {
      name: string;
      description?: string;
      day: string;
      teacherId: string;
      subjectId: string;
      streamId: string;
      timeSlotId: string;
    }>({
      query: (data) => ({
        url: "/lessons",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response.conflicts) {
          return { conflicts: response.conflicts };
        }
        return response.data;
      },
      invalidatesTags: ["Lesson"],
    }),
    
    updateLesson: builder.mutation<Lesson | { conflicts: ConflictInfo[] }, {
      id: string;
      data: Partial<{
        name: string;
        description: string;
        day: string;
        teacherId: string;
        subjectId: string;
        streamId: string;
        timeSlotId: string;
      }>;
    }>({
      query: ({ id, data }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response.conflicts) {
          return { conflicts: response.conflicts };
        }
        return response.data;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Lesson", id },
        "Lesson",
      ],
    }),
    
    deleteLesson: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lesson"],
    }),

    // Timetables
    getStreamTimetable: builder.query<TimetableData, string>({
      query: (streamId) => `/lessons/timetable/stream/${streamId}`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, streamId) => [
        { type: "Lesson", id: `stream-${streamId}` },
        "Lesson",
      ],
    }),

    getTeacherTimetable: builder.query<TimetableData, string>({
      query: (teacherId) => `/lessons/timetable/teacher/${teacherId}`,
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, teacherId) => [
        { type: "Lesson", id: `teacher-${teacherId}` },
        "Lesson",
      ],
    }),

    getTimetableView: builder.query<TimetableData, {
      streamId?: string;
      teacherId?: string;
      subjectId?: string;
      day?: string;
    }>({
      query: (params = {}) => ({
        url: "/lessons",
        params: { ...params, view: 'timetable' },
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["Lesson"],
    }),
  }),
});

export const {
  // Grades
  useGetGradesQuery,
  useGetGradeQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
  
  // Streams
  useGetStreamsQuery,
  useGetStreamQuery,
  useGetStreamsByGradeQuery,
  useCreateStreamMutation,
  useUpdateStreamMutation,
  useDeleteStreamMutation,
  
  // Departments
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  
  // Subjects
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useGetSubjectsByDepartmentQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useAssignTeacherToSubjectMutation,
  useRemoveTeacherFromSubjectMutation,
  
  // Time Slots
  useGetTimeSlotsQuery,
  useGetTimeSlotByIdQuery,
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation,
  
  // Lessons
  useGetLessonsQuery,
  useGetLessonByIdQuery,
  useGetLessonsByStreamQuery,
  useGetLessonsByTeacherQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  
  // Timetables
  useGetStreamTimetableQuery,
  useGetTeacherTimetableQuery,
  useGetTimetableViewQuery,
} = academicsApi; 