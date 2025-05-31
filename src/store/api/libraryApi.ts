import { baseApi } from "./baseApi";
import {
  ApiResponse,
  PaginatedResponse,
  Book,
  BookIssue,
  LibraryMember,
  LibraryAnalytics,
  CreateBookRequest,
  CreateBookIssueRequest,
  ReturnBookRequest,
  RenewBookRequest,
  LibraryFilters,
  BookIssueFilters,
} from "../types";

export const libraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Books Management
    getBooks: builder.query<PaginatedResponse<Book>, LibraryFilters>({
      query: (filters) => ({
        url: "/library/books",
        params: filters,
      }),
      providesTags: ["Book"],
    }),

    getBook: builder.query<ApiResponse<Book>, string>({
      query: (id) => `/library/books/${id}`,
      providesTags: ["Book"],
    }),

    createBook: builder.mutation<ApiResponse<Book>, CreateBookRequest>({
      query: (data) => ({
        url: "/library/books",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book", "LibraryAnalytics"],
    }),

    updateBook: builder.mutation<ApiResponse<Book>, { id: string; data: Partial<CreateBookRequest> }>({
      query: ({ id, data }) => ({
        url: `/library/books/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Book", "LibraryAnalytics"],
    }),

    deleteBook: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/library/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book", "LibraryAnalytics"],
    }),

    // Book Issues Management
    getBookIssues: builder.query<PaginatedResponse<BookIssue>, BookIssueFilters>({
      query: (filters) => ({
        url: "/library/issues",
        params: filters,
      }),
      providesTags: ["BookIssue"],
    }),

    getBookIssue: builder.query<ApiResponse<BookIssue>, string>({
      query: (id) => `/library/issues/${id}`,
      providesTags: ["BookIssue"],
    }),

    issueBook: builder.mutation<ApiResponse<BookIssue>, CreateBookIssueRequest>({
      query: (data) => ({
        url: "/library/issues",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BookIssue", "Book", "LibraryMember", "LibraryAnalytics"],
    }),

    returnBook: builder.mutation<ApiResponse<BookIssue>, ReturnBookRequest>({
      query: (data) => ({
        url: "/library/returns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BookIssue", "Book", "LibraryMember", "LibraryAnalytics"],
    }),

    renewBook: builder.mutation<ApiResponse<BookIssue>, RenewBookRequest>({
      query: (data) => ({
        url: "/library/renewals",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BookIssue", "LibraryAnalytics"],
    }),

    // User's Books (for students and teachers)
    getMyBooks: builder.query<PaginatedResponse<BookIssue>, { userId: string; status?: string }>({
      query: ({ userId, status }) => ({
        url: `/library/my-books/${userId}`,
        params: { status },
      }),
      providesTags: ["BookIssue"],
    }),

    // Library Members Management
    getLibraryMembers: builder.query<PaginatedResponse<LibraryMember>, { search?: string; status?: string; page?: number; pageSize?: number }>({
      query: (filters) => ({
        url: "/library/members",
        params: filters,
      }),
      providesTags: ["LibraryMember"],
    }),

    getLibraryMember: builder.query<ApiResponse<LibraryMember>, string>({
      query: (id) => `/library/members/${id}`,
      providesTags: ["LibraryMember"],
    }),

    createLibraryMember: builder.mutation<ApiResponse<LibraryMember>, { userId: string; userType: "STUDENT" | "TEACHER"; maxBooksAllowed?: number }>({
      query: (data) => ({
        url: "/library/members",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LibraryMember", "LibraryAnalytics"],
    }),

    updateLibraryMember: builder.mutation<ApiResponse<LibraryMember>, { id: string; data: Partial<LibraryMember> }>({
      query: ({ id, data }) => ({
        url: `/library/members/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LibraryMember", "LibraryAnalytics"],
    }),

    // Library Analytics
    getLibraryAnalytics: builder.query<ApiResponse<LibraryAnalytics>, void>({
      query: () => "/library/analytics",
      providesTags: ["LibraryAnalytics"],
    }),

    // Overdue Books
    getOverdueBooks: builder.query<PaginatedResponse<BookIssue>, { page?: number; pageSize?: number }>({
      query: (filters) => ({
        url: "/library/overdue",
        params: filters,
      }),
      providesTags: ["BookIssue"],
    }),

    // Popular Books
    getPopularBooks: builder.query<ApiResponse<Book[]>, { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: "/library/popular",
        params: { limit },
      }),
      providesTags: ["Book"],
    }),

    // Search Books (for public catalog)
    searchBooks: builder.query<PaginatedResponse<Book>, { query: string; category?: string; author?: string; page?: number; pageSize?: number }>({
      query: (filters) => ({
        url: "/library/search",
        params: filters,
      }),
      providesTags: ["Book"],
    }),

    // Fine Management
    payFine: builder.mutation<ApiResponse<BookIssue>, { bookIssueId: string; amount: number; paymentMethod: string }>({
      query: (data) => ({
        url: "/library/pay-fine",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BookIssue", "LibraryMember", "LibraryAnalytics"],
    }),

    // Book Categories
    getBookCategories: builder.query<ApiResponse<string[]>, void>({
      query: () => "/library/categories",
      providesTags: ["Book"],
    }),

    // Library Reports
    getLibraryReport: builder.query<ApiResponse<any>, { startDate: string; endDate: string; type: string }>({
      query: ({ startDate, endDate, type }) => ({
        url: "/library/reports",
        params: { startDate, endDate, type },
      }),
      providesTags: ["LibraryAnalytics"],
    }),
  }),
});

export const {
  // Books Management
  useGetBooksQuery,
  useGetBookQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,

  // Book Issues Management
  useGetBookIssuesQuery,
  useGetBookIssueQuery,
  useIssueBookMutation,
  useReturnBookMutation,
  useRenewBookMutation,

  // User's Books
  useGetMyBooksQuery,

  // Library Members Management
  useGetLibraryMembersQuery,
  useGetLibraryMemberQuery,
  useCreateLibraryMemberMutation,
  useUpdateLibraryMemberMutation,

  // Library Analytics
  useGetLibraryAnalyticsQuery,

  // Overdue Books
  useGetOverdueBooksQuery,

  // Popular Books
  useGetPopularBooksQuery,

  // Search Books
  useSearchBooksQuery,

  // Fine Management
  usePayFineMutation,

  // Book Categories
  useGetBookCategoriesQuery,

  // Library Reports
  useGetLibraryReportQuery,
} = libraryApi; 