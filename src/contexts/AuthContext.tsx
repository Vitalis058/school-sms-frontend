"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  useGetCurrentUserQuery, 
  useLoginMutation, 
  useLogoutMutation,
  useSignupMutation,
  type SignupRequest,
  type LoginRequest 
} from "@/store/api/authApi";
import { User } from "@/store/types";

// RBAC Types
export type Role = "ADMIN" | "TEACHER" | "STUDENT" | "STAFF" | "DRIVER" | "LIBRARIAN";
export type Permission = "create" | "read" | "update" | "delete";
export type Resource = 
  | "students" 
  | "teachers" 
  | "parents" 
  | "grades" 
  | "streams" 
  | "subjects" 
  | "departments" 
  | "lessons" 
  | "timeslots" 
  | "attendance" 
  | "profile" 
  | "reports" 
  | "users"
  | "performance"
  | "analytics"
  | "transport"
  | "drivers"
  | "vehicles"
  | "bookings"
  | "maintenance"
  | "library"
  | "books"
  | "book-issues"
  | "book-returns";

// Permission definitions
const ROLE_PERMISSIONS: Record<Role, Record<Resource, Permission[]>> = {
  ADMIN: {
    students: ["create", "read", "update", "delete"],
    teachers: ["create", "read", "update", "delete"],
    parents: ["create", "read", "update", "delete"],
    grades: ["create", "read", "update", "delete"],
    streams: ["create", "read", "update", "delete"],
    subjects: ["create", "read", "update", "delete"],
    departments: ["create", "read", "update", "delete"],
    lessons: ["create", "read", "update", "delete"],
    timeslots: ["create", "read", "update", "delete"],
    attendance: ["create", "read", "update", "delete"],
    profile: ["read", "update"],
    reports: ["create", "read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
    performance: ["create", "read", "update", "delete"],
    analytics: ["create", "read", "update", "delete"],
    transport: ["create", "read", "update", "delete"],
    drivers: ["create", "read", "update", "delete"],
    vehicles: ["create", "read", "update", "delete"],
    bookings: ["create", "read", "update", "delete"],
    maintenance: ["create", "read", "update", "delete"],
    library: ["create", "read", "update", "delete"],
    books: ["create", "read", "update", "delete"],
    "book-issues": ["create", "read", "update", "delete"],
    "book-returns": ["create", "read", "update", "delete"],
  },
  TEACHER: {
    students: ["read", "update"],
    teachers: ["read"],
    parents: ["read"],
    grades: ["read"],
    streams: ["read"],
    subjects: ["read"],
    departments: ["read"],
    lessons: ["create", "read", "update", "delete"],
    timeslots: ["read"],
    attendance: ["create", "read", "update"],
    profile: ["read", "update"],
    reports: ["read"],
    users: [],
    performance: ["create", "read", "update"],
    analytics: ["read"],
    transport: ["read"],
    drivers: ["read"],
    vehicles: ["read"],
    bookings: ["create", "read"],
    maintenance: [],
    library: ["read"],
    books: ["read"],
    "book-issues": ["create", "read"],
    "book-returns": ["create", "read"],
  },
  STUDENT: {
    students: [],
    teachers: ["read"],
    parents: [],
    grades: ["read"],
    streams: ["read"],
    subjects: ["read"],
    departments: [],
    lessons: ["read"],
    timeslots: ["read"],
    attendance: ["read"],
    profile: ["read", "update"],
    reports: ["read"],
    users: [],
    performance: ["read"],
    analytics: [],
    transport: [],
    drivers: [],
    vehicles: [],
    bookings: [],
    maintenance: [],
    library: ["read"],
    books: ["read"],
    "book-issues": ["read"],
    "book-returns": ["read"],
  },
  STAFF: {
    students: ["read"],
    teachers: ["read"],
    parents: ["read"],
    grades: ["read"],
    streams: ["read"],
    subjects: ["read"],
    departments: ["read"],
    lessons: ["read"],
    timeslots: ["read"],
    attendance: ["read"],
    profile: ["read", "update"],
    reports: ["read"],
    users: [],
    performance: ["read"],
    analytics: ["read"],
    transport: ["read", "update"],
    drivers: ["read"],
    vehicles: ["read"],
    bookings: ["read", "update"],
    maintenance: ["read"],
    library: ["read"],
    books: ["read"],
    "book-issues": ["read"],
    "book-returns": ["read"],
  },
  DRIVER: {
    students: [],
    teachers: [],
    parents: [],
    grades: [],
    streams: [],
    subjects: [],
    departments: [],
    lessons: [],
    timeslots: [],
    attendance: [],
    profile: ["read", "update"],
    reports: [],
    users: [],
    performance: [],
    analytics: [],
    transport: ["read", "update"],
    drivers: ["read", "update"],
    vehicles: ["create", "read", "update", "delete"],
    bookings: ["read", "update"],
    maintenance: ["create", "read", "update"],
    library: [],
    books: [],
    "book-issues": [],
    "book-returns": [],
  },
  LIBRARIAN: {
    students: ["read"],
    teachers: ["read"],
    parents: [],
    grades: [],
    streams: [],
    subjects: [],
    departments: [],
    lessons: [],
    timeslots: [],
    attendance: [],
    profile: ["read", "update"],
    reports: ["read"],
    users: [],
    performance: [],
    analytics: [],
    transport: [],
    drivers: [],
    vehicles: [],
    bookings: [],
    maintenance: [],
    library: ["create", "read", "update", "delete"],
    books: ["create", "read", "update", "delete"],
    "book-issues": ["create", "read", "update", "delete"],
    "book-returns": ["create", "read", "update", "delete"],
  },
};

// Route permissions
const ROUTE_PERMISSIONS: Record<string, { roles: Role[]; resource?: Resource; permission?: Permission }> = {
  "/dashboard": { roles: ["ADMIN", "TEACHER", "STUDENT", "STAFF", "DRIVER", "LIBRARIAN"] },
  "/dashboard/student-management": { roles: ["ADMIN", "TEACHER", "STAFF"], resource: "students", permission: "read" },
  "/dashboard/student-management/new": { roles: ["ADMIN"], resource: "students", permission: "create" },
  "/dashboard/student-management/performance": { roles: ["ADMIN", "TEACHER", "STAFF"], resource: "performance", permission: "read" },
  "/dashboard/users/teachers": { roles: ["ADMIN", "STAFF"], resource: "teachers", permission: "read" },
  "/dashboard/users/teachers/new": { roles: ["ADMIN"], resource: "teachers", permission: "create" },
  "/dashboard/users/parents": { roles: ["ADMIN", "STAFF"], resource: "parents", permission: "read" },
  "/dashboard/users/parents/new": { roles: ["ADMIN"], resource: "parents", permission: "create" },
  "/dashboard/academics": { roles: ["ADMIN", "TEACHER", "STAFF"] },
  "/dashboard/academics/subjects": { roles: ["ADMIN", "TEACHER", "STAFF"], resource: "subjects", permission: "read" },
  "/dashboard/academics/lessons": { roles: ["ADMIN", "TEACHER"], resource: "lessons", permission: "read" },
  "/dashboard/staff-management": { roles: ["ADMIN"], resource: "users", permission: "read" },
  "/dashboard/transport": { roles: ["ADMIN", "STAFF", "DRIVER"], resource: "transport", permission: "read" },
  "/dashboard/transport/vehicles": { roles: ["ADMIN", "STAFF", "DRIVER"], resource: "vehicles", permission: "read" },
  "/dashboard/transport/drivers": { roles: ["ADMIN", "STAFF"], resource: "drivers", permission: "read" },
  "/dashboard/transport/bookings": { roles: ["ADMIN", "STAFF", "DRIVER"], resource: "bookings", permission: "read" },
  "/dashboard/transport/maintenance": { roles: ["ADMIN", "STAFF", "DRIVER"], resource: "maintenance", permission: "read" },
  "/dashboard/library": { roles: ["ADMIN", "LIBRARIAN", "TEACHER", "STUDENT", "STAFF"], resource: "library", permission: "read" },
  "/dashboard/library/books": { roles: ["ADMIN", "LIBRARIAN"], resource: "books", permission: "read" },
  "/dashboard/library/issues": { roles: ["ADMIN", "LIBRARIAN"], resource: "book-issues", permission: "read" },
  "/dashboard/library/returns": { roles: ["ADMIN", "LIBRARIAN"], resource: "book-returns", permission: "read" },
  "/dashboard/library/my-books": { roles: ["TEACHER", "STUDENT"], resource: "book-issues", permission: "read" },
};

interface AuthContextType {
  // User state
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  
  // Permission checks
  hasPermission: (resource: Resource, permission: Permission) => boolean;
  hasRole: (role: Role | Role[]) => boolean;
  canAccessRoute: (route: string) => boolean;
  
  // Utility
  getToken: () => string | null;
  setToken: (token: string | undefined) => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // RTK Query hooks
  const { data: currentUserData, isLoading: userLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !token || !isInitialized,
  });
  const [loginMutation] = useLoginMutation();
  const [signupMutation] = useSignupMutation();
  const [logoutMutation] = useLogoutMutation();

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    console.log("AuthContext: Initializing with stored token:", storedToken ? "present" : "none");
    if (storedToken) {
      setTokenState(storedToken);
    }
    setIsInitialized(true);
  }, []);

  // Handle authentication errors
  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      // Only clear token and redirect if it's a critical auth error (like /me endpoint)
      // Don't redirect for other API endpoints that might fail due to missing routes
      const errorData = error as any;
      const isAuthEndpoint = errorData?.meta?.request?.url?.includes('/auth/me');
      
      if (isAuthEndpoint) {
        console.log("AuthContext: Critical auth error, clearing token and redirecting");
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          clearToken();
          router.push("/sign-in");
        }, 0);
      } else {
        console.log("AuthContext: Non-critical 401 error, not redirecting:", errorData);
      }
    }
  }, [error, router]);

  const user = currentUserData?.data?.user || null;
  const isAuthenticated = !!user && !!token;
  const isLoading: boolean = !isInitialized || (!!token && userLoading);

  // Debug authentication state - only log when necessary
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("AuthContext state:", {
        isInitialized,
        hasToken: !!token,
        hasUser: !!user,
        isAuthenticated,
        isLoading,
      });
    }
  }, [isInitialized, isAuthenticated, isLoading]);

  // Auth actions
  const login = async (credentials: LoginRequest) => {
    try {
      console.log("AuthContext: Starting login with credentials:", { email: credentials.email });
      const result = await loginMutation(credentials).unwrap();
      console.log("AuthContext: Login API response:", { 
        success: result.success, 
        hasToken: !!result.token,
        tokenPreview: result.token ? `${result.token.substring(0, 10)}...` : "none",
        hasUser: !!result.data?.user,
        fullResponse: result
      });
      
      setToken(result.token);
      console.log("AuthContext: Token set, redirecting to dashboard");
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("AuthContext: Login error:", error);
      const message = error?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      const result = await signupMutation(data).unwrap();
      setToken(result.token);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      const message = error?.data?.message || "Signup failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
      clearToken();
      toast.success("Logged out successfully!");
      router.push("/sign-in");
    } catch (error) {
      // Even if logout fails on server, clear local state
      clearToken();
      router.push("/sign-in");
    }
  };

  // Token management
  const getToken = () => token;

  const setToken = (newToken: string | undefined) => {
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
      setTokenState(newToken);
    } else {
      clearToken();
    }
  };

  const clearToken = () => {
    localStorage.removeItem("auth_token");
    setTokenState(null);
  };

  // Permission checks
  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    if (!user) return false;
    
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    if (!rolePermissions) return false;
    
    const resourcePermissions = rolePermissions[resource];
    if (!resourcePermissions) return false;
    
    return resourcePermissions.includes(permission);
  };

  const hasRole = (role: Role | Role[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false;
    
    const routeConfig = ROUTE_PERMISSIONS[route];
    if (!routeConfig) return true; // Allow access to routes not in config
    
    // Check role
    if (!routeConfig.roles.includes(user.role)) return false;
    
    // Check specific permission if required
    if (routeConfig.resource && routeConfig.permission) {
      return hasPermission(routeConfig.resource, routeConfig.permission);
    }
    
    return true;
  };

  const value: AuthContextType = {
    // User state
    user,
    isLoading,
    isAuthenticated,
    
    // Auth actions
    login,
    signup,
    logout,
    
    // Permission checks
    hasPermission,
    hasRole,
    canAccessRoute,
    
    // Utility
    getToken,
    setToken,
    clearToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Higher-order component for route protection
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: Role[]
) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, hasRole, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push("/sign-in");
          return;
        }

        if (requiredRoles && !hasRole(requiredRoles)) {
          toast.error("You don't have permission to access this page");
          router.push("/dashboard");
          return;
        }
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
      return null;
    }

    return <Component {...props} />;
  };
};

// Hook for permission-based rendering
export const usePermissions = () => {
  const { hasPermission, hasRole, canAccessRoute, isAuthenticated } = useAuth();
  
  return {
    hasPermission,
    hasRole,
    canAccessRoute,
    isAuthenticated,
    // Convenience methods
    canCreate: (resource: Resource) => hasPermission(resource, "create"),
    canRead: (resource: Resource) => hasPermission(resource, "read"),
    canUpdate: (resource: Resource) => hasPermission(resource, "update"),
    canDelete: (resource: Resource) => hasPermission(resource, "delete"),
    isAdmin: () => hasRole("ADMIN"),
    isTeacher: () => hasRole("TEACHER"),
    isStudent: () => hasRole("STUDENT"),
    isStaff: () => hasRole("STAFF"),
    isDriver: () => hasRole("DRIVER"),
    isLibrarian: () => hasRole("LIBRARIAN"),
  };
}; 