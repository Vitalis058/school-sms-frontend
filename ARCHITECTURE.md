# Frontend Architecture Documentation

## Overview

This frontend has been completely refactored to use **RTK Query** for data fetching and state management, replacing all server actions with a more scalable and professional architecture.

## Technology Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **RTK Query** - Data fetching and caching
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Tanstack Table** - Data tables

## Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   ├── (main)/                   # Public routes
│   ├── dashboard/                # Dashboard routes
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Shared UI components
│   ├── ui/                       # shadcn/ui components
│   ├── forms/                    # Reusable form components
│   ├── tables/                   # Reusable table components
│   └── nav/                      # Navigation components
├── features/                     # Feature-based modules
│   ├── academics/                # Academic management
│   │   ├── components/           # Feature-specific components
│   │   ├── hooks/                # Feature-specific hooks
│   │   └── types/                # Feature-specific types
│   ├── students/                 # Student management
│   ├── teachers/                 # Teacher management
│   ├── parents/                  # Parent management
│   ├── communication/            # Communication features
│   ├── finance/                  # Financial management
│   └── reports/                  # Reporting features
├── store/                        # Redux store configuration
│   ├── api/                      # RTK Query API slices
│   │   ├── baseApi.ts            # Base API configuration
│   │   ├── academicsApi.ts       # Academic operations
│   │   ├── studentApi.ts         # Student operations
│   │   ├── teacherApi.ts         # Teacher operations
│   │   ├── parentApi.ts          # Parent operations
│   │   ├── authApi.ts            # Authentication
│   │   ├── communicationApi.ts   # Communication
│   │   ├── financeApi.ts         # Finance
│   │   ├── resourcesApi.ts       # Resources
│   │   └── reportsApi.ts         # Reports
│   ├── types/                    # TypeScript type definitions
│   ├── hooks.ts                  # Typed Redux hooks
│   ├── provider.tsx              # Redux provider component
│   └── index.ts                  # Store configuration
├── hooks/                        # Global custom hooks
├── utils/                        # Utility functions
├── lib/                          # Library configurations
├── types/                        # Global type definitions
└── constants/                    # Application constants
```

## Key Architecture Decisions

### 1. RTK Query for Data Fetching

**Why RTK Query?**
- Automatic caching and background refetching
- Optimistic updates
- Built-in loading and error states
- Automatic cache invalidation
- TypeScript support
- Normalized cache management

**Before (Server Actions):**
```typescript
// Server action approach
"use server";
export async function createStudent(data: StudentData) {
  const response = await fetch('/api/students', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
}
```

**After (RTK Query):**
```typescript
// RTK Query approach
export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStudent: builder.mutation<ApiResponse<Student>, CreateStudentRequest>({
      query: (data) => ({
        url: "students",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});
```

### 2. Feature-Based Architecture

Each feature is self-contained with its own:
- Components
- Hooks
- Types
- Business logic

This promotes:
- **Modularity** - Features can be developed independently
- **Maintainability** - Easy to locate and modify feature-specific code
- **Scalability** - New features can be added without affecting existing ones
- **Reusability** - Components can be shared across features

### 3. Centralized API Management

All API endpoints are defined in the `store/api/` directory:
- **baseApi.ts** - Common configuration (auth, error handling, base URL)
- **Feature-specific APIs** - Organized by domain (students, teachers, etc.)
- **Type Safety** - Full TypeScript support for requests and responses
- **Cache Management** - Automatic invalidation and refetching

### 4. Type-Safe State Management

```typescript
// Typed hooks for Redux
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Usage in components
const { data: students, isLoading, error } = useGetStudentsQuery({
  page: 1,
  pageSize: 10,
  search: "john"
});
```

## API Layer Architecture

### Base API Configuration

```typescript
// baseApi.ts
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Student", "Teacher", "Parent", ...],
  endpoints: () => ({}),
});
```

### Feature API Injection

```typescript
// studentApi.ts
export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedResponse<Student>, StudentFilters>({
      query: (filters) => `students?${buildQueryString(filters)}`,
      providesTags: ["Student"],
    }),
    // ... other endpoints
  }),
});
```

### Cache Management

RTK Query automatically handles:
- **Cache invalidation** via tags
- **Background refetching** when data becomes stale
- **Optimistic updates** for better UX
- **Deduplication** of identical requests

## Component Architecture

### Form Components

```typescript
// Example: StudentForm.tsx
export function StudentForm({ onSuccess }: StudentFormProps) {
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: grades } = useGetGradesQuery();
  
  const onSubmit = async (data: StudentFormData) => {
    try {
      await createStudent(data).unwrap();
      toast.success("Student created successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create student");
    }
  };
  
  // Form JSX...
}
```

### Data Table Components

```typescript
// Example: StudentsDataTable.tsx
export function StudentsDataTable() {
  const [filters, setFilters] = useState<StudentFilters>({});
  const { data, isLoading, error } = useGetStudentsQuery(filters);
  const [deleteStudent] = useDeleteStudentMutation();
  
  // Table configuration and JSX...
}
```

## Benefits of the New Architecture

### 1. Performance
- **Automatic caching** reduces unnecessary API calls
- **Background refetching** keeps data fresh
- **Optimistic updates** provide instant feedback
- **Request deduplication** prevents duplicate calls

### 2. Developer Experience
- **Type safety** throughout the application
- **Auto-completion** for API endpoints and data structures
- **Built-in loading states** and error handling
- **DevTools integration** for debugging

### 3. Maintainability
- **Centralized API logic** in one place
- **Feature-based organization** for easy navigation
- **Consistent patterns** across all features
- **Separation of concerns** between UI and data logic

### 4. Scalability
- **Modular architecture** allows independent feature development
- **Reusable components** reduce code duplication
- **Standardized patterns** for adding new features
- **Professional folder structure** supports team collaboration

## Migration Guide

### From Server Actions to RTK Query

1. **Remove server action files** from `features/*/actions/`
2. **Create API endpoints** in appropriate API slice
3. **Update components** to use RTK Query hooks
4. **Remove useActionState** and replace with mutation hooks
5. **Update error handling** to use RTK Query error states

### Example Migration

**Before:**
```typescript
// Component using server action
const [state, action, isPending] = useActionState(createStudentAction, initialState);

const onSubmit = (data: StudentData) => {
  action(data);
};
```

**After:**
```typescript
// Component using RTK Query
const [createStudent, { isLoading, error }] = useCreateStudentMutation();

const onSubmit = async (data: StudentData) => {
  try {
    await createStudent(data).unwrap();
    toast.success("Student created successfully");
  } catch (error) {
    toast.error("Failed to create student");
  }
};
```

## Best Practices

### 1. API Design
- Use consistent naming conventions for endpoints
- Implement proper error handling in base query
- Use tags for cache invalidation
- Type all requests and responses

### 2. Component Design
- Keep components focused on single responsibility
- Use custom hooks for complex logic
- Implement proper loading and error states
- Follow consistent patterns across features

### 3. State Management
- Use RTK Query for server state
- Keep local state minimal
- Use proper TypeScript types
- Implement optimistic updates where appropriate

### 4. Performance
- Use selective re-rendering with proper dependencies
- Implement pagination for large datasets
- Use background refetching for data freshness
- Optimize bundle size with code splitting

This architecture provides a solid foundation for a scalable, maintainable, and performant school management system frontend. 