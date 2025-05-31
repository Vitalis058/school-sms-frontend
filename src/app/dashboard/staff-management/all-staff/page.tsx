"use client";

import React, { useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePermissions } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Settings,
  Crown,
  GraduationCap,
  BookOpen,
  UserCog,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetAllStaffQuery,
  useUpdateUserRoleMutation,
  useDeleteStaffMemberMutation,
  useGetStaffAnalyticsQuery,
  useBulkUpdateStaffRolesMutation,
  useBulkDeactivateStaffMutation,
  StaffMember,
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

export default function AllStaffPage() {
  const { canRead, canCreate, canUpdate, canDelete, isAdmin } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMember | null>(null);

  // API queries
  const { 
    data: staffResponse, 
    isLoading: staffLoading, 
    error: staffError 
  } = useGetAllStaffQuery({
    search: searchTerm,
    role: roleFilter !== "all" ? roleFilter as any : undefined,
    isActive: statusFilter !== "all" ? statusFilter === "active" : undefined,
  });

  const { 
    data: analytics, 
    isLoading: analyticsLoading 
  } = useGetStaffAnalyticsQuery();

  // Mutations
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteStaffMember, { isLoading: isDeleting }] = useDeleteStaffMemberMutation();
  const [bulkUpdateRoles, { isLoading: isBulkUpdating }] = useBulkUpdateStaffRolesMutation();
  const [bulkDeactivate, { isLoading: isBulkDeactivating }] = useBulkDeactivateStaffMutation();

  // Check permissions
  if (!canRead("users") && !isAdmin()) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view staff management.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const isLoading = staffLoading || analyticsLoading;

  if (isLoading) return <LoadingComponent message="Loading staff data..." />;
  if (staffError) return <ErrorComponent message="Failed to load staff data. Please try again." />;

  const staff = staffResponse?.data || [];
  const filteredStaff = staff.filter((member) => {
    const matchesSearch = 
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.firstName && member.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.lastName && member.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && member.isActive) ||
      (statusFilter === "inactive" && !member.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await updateUserRole({ 
        userId, 
        role: newRole as "ADMIN" | "TEACHER" | "STUDENT" | "STAFF" 
      }).unwrap();
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteStaff = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    
    try {
      await deleteStaffMember(userId).unwrap();
      toast.success("Staff member deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleBulkRoleUpdate = async (role: string) => {
    if (selectedStaff.length === 0) {
      toast.error("Please select staff members first");
      return;
    }

    try {
      await bulkUpdateRoles({
        userIds: selectedStaff.map(s => s.id),
        role,
      }).unwrap();
      toast.success(`Updated ${selectedStaff.length} staff members' roles`);
      setSelectedStaff([]);
      setIsBulkActionsOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedStaff.length === 0) {
      toast.error("Please select staff members first");
      return;
    }

    if (!confirm(`Are you sure you want to deactivate ${selectedStaff.length} staff members?`)) return;

    try {
      await bulkDeactivate(selectedStaff.map(s => s.id)).unwrap();
      toast.success(`Deactivated ${selectedStaff.length} staff members`);
      setSelectedStaff([]);
      setIsBulkActionsOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleStaffSelection = (staff: StaffMember) => {
    setSelectedStaff(prev => 
      prev.find(s => s.id === staff.id)
        ? prev.filter(s => s.id !== staff.id)
        : [...prev, staff]
    );
  };

  const selectAllStaff = () => {
    setSelectedStaff(selectedStaff.length === filteredStaff.length ? [] : filteredStaff);
  };

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage staff members, roles, and permissions
            </p>
          </div>
          {canCreate("users") && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          )}
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalStaff}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.activeStaff} active members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.roleDistribution.ADMIN || 0}</div>
                <p className="text-xs text-muted-foreground">
                  System administrators
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.roleDistribution.TEACHER || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Teaching staff
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support Staff</CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.roleDistribution.STAFF || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Administrative staff
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staff Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search staff by name, email, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Administrators</SelectItem>
                  <SelectItem value="TEACHER">Teachers</SelectItem>
                  <SelectItem value="STAFF">Support Staff</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {selectedStaff.length > 0 && (
                <DropdownMenu open={isBulkActionsOpen} onOpenChange={setIsBulkActionsOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Bulk Actions ({selectedStaff.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleBulkRoleUpdate("ADMIN")}>
                      <Crown className="h-4 w-4 mr-2" />
                      Make Administrators
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleUpdate("TEACHER")}>
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Make Teachers
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleUpdate("STAFF")}>
                      <UserCog className="h-4 w-4 mr-2" />
                      Make Support Staff
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleBulkDeactivate}
                      className="text-destructive"
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Staff Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedStaff.length === filteredStaff.length && filteredStaff.length > 0}
                        onCheckedChange={selectAllStaff}
                      />
                    </TableHead>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No staff members found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((member) => {
                      const RoleIcon = roleIcons[member.role];
                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedStaff.some(s => s.id === member.id)}
                              onCheckedChange={() => toggleStaffSelection(member)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {member.image ? (
                                  <img 
                                    src={member.image} 
                                    alt={member.username}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-medium">
                                    {member.firstName?.[0] || member.username[0].toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {member.firstName && member.lastName 
                                    ? `${member.firstName} ${member.lastName}`
                                    : member.username
                                  }
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${roleColors[member.role]} flex items-center gap-1 w-fit`}
                            >
                              <RoleIcon className="h-3 w-3" />
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={member.isActive ? "default" : "secondary"}
                              className="flex items-center gap-1 w-fit"
                            >
                              {member.isActive ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertTriangle className="h-3 w-3" />
                              )}
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {member.lastLogin ? (
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-3 w-3" />
                                {new Date(member.lastLogin).toLocaleDateString()}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {new Date(member.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedStaffMember(member);
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {canUpdate("users") && (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedStaffMember(member);
                                        setIsPermissionsModalOpen(true);
                                      }}
                                    >
                                      <Shield className="h-4 w-4 mr-2" />
                                      Manage Permissions
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleRoleChange(member.id, "ADMIN")}
                                      disabled={member.role === "ADMIN"}
                                    >
                                      <Crown className="h-4 w-4 mr-2" />
                                      Make Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleRoleChange(member.id, "TEACHER")}
                                      disabled={member.role === "TEACHER"}
                                    >
                                      <GraduationCap className="h-4 w-4 mr-2" />
                                      Make Teacher
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleRoleChange(member.id, "STAFF")}
                                      disabled={member.role === "STAFF"}
                                    >
                                      <UserCog className="h-4 w-4 mr-2" />
                                      Make Staff
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {canDelete("users") && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteStaff(member.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Staff Details Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Staff Member Details</DialogTitle>
            </DialogHeader>
            {selectedStaffMember && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedStaffMember.image ? (
                      <img 
                        src={selectedStaffMember.image} 
                        alt={selectedStaffMember.username}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-medium">
                        {selectedStaffMember.firstName?.[0] || selectedStaffMember.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedStaffMember.firstName && selectedStaffMember.lastName 
                        ? `${selectedStaffMember.firstName} ${selectedStaffMember.lastName}`
                        : selectedStaffMember.username
                      }
                    </h3>
                    <p className="text-muted-foreground">{selectedStaffMember.email}</p>
                    <Badge className={`${roleColors[selectedStaffMember.role]} mt-1`}>
                      {selectedStaffMember.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="text-sm text-muted-foreground">{selectedStaffMember.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedStaffMember.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Joined</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedStaffMember.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Login</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedStaffMember.lastLogin 
                        ? new Date(selectedStaffMember.lastLogin).toLocaleDateString()
                        : "Never"
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Permissions Modal */}
        <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
            </DialogHeader>
            {selectedStaffMember && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {selectedStaffMember.firstName?.[0] || selectedStaffMember.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {selectedStaffMember.firstName && selectedStaffMember.lastName 
                        ? `${selectedStaffMember.firstName} ${selectedStaffMember.lastName}`
                        : selectedStaffMember.username
                      }
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedStaffMember.email}</p>
                  </div>
                  <Badge className={`${roleColors[selectedStaffMember.role]} ml-auto`}>
                    {selectedStaffMember.role}
                  </Badge>
                </div>
                
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Permission Management</h3>
                  <p className="text-muted-foreground">
                    Detailed permission management interface will be implemented here.
                    This will allow fine-grained control over what this user can access.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
} 