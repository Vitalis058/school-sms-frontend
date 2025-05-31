"use client";

import React, { useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePermissions } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Shield,
  Crown,
  GraduationCap,
  UserCog,
  BookOpen,
  Users,
  Settings,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  Unlock,
  Eye,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  RolePermission,
} from "@/store/api/userApi";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const roleIcons = {
  ADMIN: Crown,
  TEACHER: GraduationCap,
  STAFF: UserCog,
  STUDENT: BookOpen,
};

const roleColors = {
  ADMIN: "bg-red-100 text-red-800 border-red-200",
  TEACHER: "bg-blue-100 text-blue-800 border-blue-200",
  STAFF: "bg-green-100 text-green-800 border-green-200",
  STUDENT: "bg-purple-100 text-purple-800 border-purple-200",
};

const roleDescriptions = {
  ADMIN: "Full system access with all administrative privileges",
  TEACHER: "Access to teaching tools, student management, and academic features",
  STAFF: "Administrative support with limited system access",
  STUDENT: "Basic access to personal information and academic content",
};

// Define all available resources and their descriptions
const resources = [
  {
    id: "students",
    name: "Students",
    description: "Student records, enrollment, and academic information",
    category: "Academic",
  },
  {
    id: "teachers",
    name: "Teachers",
    description: "Teacher profiles, assignments, and schedules",
    category: "Staff",
  },
  {
    id: "parents",
    name: "Parents/Guardians",
    description: "Parent information and communication",
    category: "Communication",
  },
  {
    id: "grades",
    name: "Grades",
    description: "Grade levels and academic structure",
    category: "Academic",
  },
  {
    id: "streams",
    name: "Class Streams",
    description: "Class divisions and stream management",
    category: "Academic",
  },
  {
    id: "subjects",
    name: "Subjects",
    description: "Subject curriculum and assignments",
    category: "Academic",
  },
  {
    id: "departments",
    name: "Departments",
    description: "Academic and administrative departments",
    category: "Organization",
  },
  {
    id: "lessons",
    name: "Lessons & Timetables",
    description: "Lesson planning and scheduling",
    category: "Academic",
  },
  {
    id: "timeslots",
    name: "Time Slots",
    description: "Schedule periods and timing",
    category: "Academic",
  },
  {
    id: "attendance",
    name: "Attendance",
    description: "Student and staff attendance tracking",
    category: "Monitoring",
  },
  {
    id: "performance",
    name: "Performance",
    description: "Academic performance and analytics",
    category: "Analytics",
  },
  {
    id: "reports",
    name: "Reports",
    description: "System reports and analytics",
    category: "Analytics",
  },
  {
    id: "users",
    name: "User Management",
    description: "System users and access control",
    category: "Administration",
  },
  {
    id: "profile",
    name: "Profile",
    description: "Personal profile and settings",
    category: "Personal",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "System analytics and insights",
    category: "Analytics",
  },
];

const permissions = ["create", "read", "update", "delete"] as const;
const permissionLabels = {
  create: "Create",
  read: "View",
  update: "Edit",
  delete: "Delete",
};

const permissionIcons = {
  create: Plus,
  read: Eye,
  update: Edit,
  delete: Trash2,
};

// Fix type definitions
type PermissionType = "create" | "read" | "update" | "delete";
type RoleType = "ADMIN" | "TEACHER" | "STAFF" | "STUDENT";
type ResourcePermissions = Record<PermissionType, boolean>;
type RolePermissions = Record<string, ResourcePermissions>;
type AllPermissions = Record<RoleType, RolePermissions>;

export default function RolePermissionsPage() {
  const { isAdmin } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<RoleType>("ADMIN");
  const [localPermissions, setLocalPermissions] = useState<AllPermissions>({} as AllPermissions);
  const [hasChanges, setHasChanges] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // API queries - these must be called before any conditional returns
  const { 
    data: rolePermissions, 
    isLoading: permissionsLoading, 
    error: permissionsError 
  } = useGetRolePermissionsQuery();

  // Mutations
  const [updateRolePermissions, { isLoading: isUpdating }] = useUpdateRolePermissionsMutation();

  // Initialize local permissions from API data
  React.useEffect(() => {
    if (rolePermissions && Object.keys(localPermissions).length === 0) {
      const permissionsMap: AllPermissions = {} as AllPermissions;
      
      // Initialize all roles
      const roles: RoleType[] = ["ADMIN", "TEACHER", "STAFF", "STUDENT"];
      roles.forEach(role => {
        permissionsMap[role] = {};
        
        resources.forEach((resource) => {
          permissionsMap[role][resource.id] = {
            create: false,
            read: false,
            update: false,
            delete: false,
          };
        });
      });

      // Apply permissions from API
      rolePermissions.forEach((rolePermission) => {
        const role = rolePermission.role as RoleType;
        const resource = rolePermission.resource;
        
        if (permissionsMap[role] && permissionsMap[role][resource]) {
          rolePermission.permissions.forEach((permission) => {
            if (permissions.includes(permission as PermissionType)) {
              permissionsMap[role][resource][permission as PermissionType] = true;
            }
          });
        }
      });
      
      setLocalPermissions(permissionsMap);
    }
  }, [rolePermissions, localPermissions]);

  // Check permissions after hooks are called
  if (!isAdmin()) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              Only administrators can manage role permissions.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (permissionsLoading) return <LoadingComponent message="Loading role permissions..." />;
  if (permissionsError) return <ErrorComponent message="Failed to load role permissions. Please try again." />;

  const handlePermissionChange = (role: string, resource: string, permission: string, checked: boolean) => {
    setLocalPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role as RoleType],
        [resource]: {
          ...prev[role as RoleType]?.[resource],
          [permission as PermissionType]: checked,
        },
      },
    }));
    setHasChanges(true);
  };

  const handleResourceToggle = (role: string, resource: string, allChecked: boolean) => {
    setLocalPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role as RoleType],
        [resource]: permissions.reduce((acc, permission) => ({
          ...acc,
          [permission]: allChecked,
        }), {} as ResourcePermissions),
      },
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Convert local permissions back to API format
      const permissionsToUpdate = Object.entries(localPermissions).map(([role, resourcePerms]) => {
        const resourcePermissions: Record<string, PermissionType[]> = {};
        
        Object.entries(resourcePerms).forEach(([resource, perms]) => {
          const enabledPermissions = Object.entries(perms)
            .filter(([, enabled]) => enabled)
            .map(([permission]) => permission as PermissionType);
          
          if (enabledPermissions.length > 0) {
            resourcePermissions[resource] = enabledPermissions;
          }
        });

        return {
          role: role as RoleType,
          permissions: resourcePermissions,
        };
      });

      // Update each role's permissions
      for (const roleUpdate of permissionsToUpdate) {
        await updateRolePermissions(roleUpdate).unwrap();
      }

      toast.success("Role permissions updated successfully");
      setHasChanges(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResetChanges = () => {
    // Reset to original permissions from API
    const permissionsMap: AllPermissions = {} as AllPermissions;
    
    // Initialize all roles
    const roles: RoleType[] = ["ADMIN", "TEACHER", "STAFF", "STUDENT"];
    roles.forEach(role => {
      permissionsMap[role] = {};
      
      resources.forEach((resource) => {
        permissionsMap[role][resource.id] = {
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      });
    });

    // Apply permissions from API
    rolePermissions?.forEach((rolePermission) => {
      const role = rolePermission.role as RoleType;
      const resource = rolePermission.resource;
      
      if (permissionsMap[role] && permissionsMap[role][resource]) {
        rolePermission.permissions.forEach((permission) => {
          if (permissions.includes(permission as PermissionType)) {
            permissionsMap[role][resource][permission as PermissionType] = true;
          }
        });
      }
    });
    
    setLocalPermissions(permissionsMap);
    setHasChanges(false);
    setIsResetDialogOpen(false);
    toast.success("Changes reset successfully");
  };

  const getResourcePermissions = (role: string, resource: string): ResourcePermissions => {
    return localPermissions[role as RoleType]?.[resource] || {
      create: false,
      read: false,
      update: false,
      delete: false,
    };
  };

  const isResourceFullyEnabled = (role: string, resource: string) => {
    const resourcePerms = getResourcePermissions(role, resource);
    return permissions.every(permission => resourcePerms[permission]);
  };

  const isResourcePartiallyEnabled = (role: string, resource: string) => {
    const resourcePerms = getResourcePermissions(role, resource);
    return permissions.some(permission => resourcePerms[permission]) && 
           !permissions.every(permission => resourcePerms[permission]);
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  const RoleIcon = roleIcons[selectedRole];

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role Permissions</h1>
            <p className="text-muted-foreground">
              Configure access permissions for different user roles
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsResetDialogOpen(true)}
                disabled={isUpdating}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Changes
              </Button>
              <Button 
                onClick={handleSaveChanges}
                disabled={isUpdating}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Changes Alert */}
        {hasChanges && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Unsaved Changes</AlertTitle>
            <AlertDescription>
              You have unsaved permission changes. Don't forget to save your changes before leaving this page.
            </AlertDescription>
          </Alert>
        )}

        {/* Role Tabs */}
        <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as RoleType)}>
          <TabsList className="grid w-full grid-cols-4">
            {(["ADMIN", "TEACHER", "STAFF", "STUDENT"] as const).map((role) => {
              const Icon = roleIcons[role];
              return (
                <TabsTrigger key={role} value={role} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {role}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(["ADMIN", "TEACHER", "STAFF", "STUDENT"] as const).map((role) => (
            <TabsContent key={role} value={role} className="space-y-6">
              {/* Role Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${roleColors[role]}`}>
                      {React.createElement(roleIcons[role], { className: "h-6 w-6" })}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{role} Permissions</CardTitle>
                      <p className="text-muted-foreground">{roleDescriptions[role]}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Permissions by Category */}
              <div className="space-y-6">
                {Object.entries(groupedResources).map(([category, categoryResources]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoryResources.map((resource) => {
                          const resourcePerms = getResourcePermissions(role, resource.id);
                          const isFullyEnabled = isResourceFullyEnabled(role, resource.id);
                          const isPartiallyEnabled = isResourcePartiallyEnabled(role, resource.id);

                          return (
                            <div key={resource.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={isFullyEnabled}
                                      ref={(el) => {
                                        if (el && 'indeterminate' in el) {
                                          (el as any).indeterminate = isPartiallyEnabled;
                                        }
                                      }}
                                      onCheckedChange={(checked) => 
                                        handleResourceToggle(role, resource.id, !!checked)
                                      }
                                    />
                                    <div>
                                      <h4 className="font-medium">{resource.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {resource.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {isFullyEnabled && (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Full Access
                                    </Badge>
                                  )}
                                  {isPartiallyEnabled && (
                                    <Badge variant="secondary">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Partial Access
                                    </Badge>
                                  )}
                                  {!isFullyEnabled && !isPartiallyEnabled && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                      <Lock className="h-3 w-3 mr-1" />
                                      No Access
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-4 gap-4">
                                {permissions.map((permission) => {
                                  const PermissionIcon = permissionIcons[permission];
                                  const isEnabled = resourcePerms[permission] || false;

                                  return (
                                    <div key={permission} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${role}-${resource.id}-${permission}`}
                                        checked={isEnabled}
                                        onCheckedChange={(checked) =>
                                          handlePermissionChange(role, resource.id, permission, !!checked)
                                        }
                                      />
                                      <Label
                                        htmlFor={`${role}-${resource.id}-${permission}`}
                                        className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                                      >
                                        <PermissionIcon className="h-3 w-3" />
                                        {permissionLabels[permission]}
                                      </Label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Reset Confirmation Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Changes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to reset all unsaved changes? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleResetChanges}>
                Reset Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
} 