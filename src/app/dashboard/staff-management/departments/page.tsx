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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Building,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Search,
  Users,
  BookOpen,
  Filter,
} from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "@/store/api/academicsApi";
import { DepartmentForm } from "@/components/DepartmentForm";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export default function DepartmentsPage() {
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  // API queries
  const { data: departments = [], isLoading: departmentsLoading, error: departmentsError } = useGetDepartmentsQuery();
  const { data: departmentDetails, isLoading: departmentDetailsLoading } = useGetDepartmentQuery(
    selectedDepartment?.id,
    { skip: !selectedDepartment?.id }
  );

  // Mutations
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  // Check permissions
  if (!canRead("departments")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view departments.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const isLoading = departmentsLoading;

  if (isLoading) return <LoadingComponent message="Loading departments..." />;
  if (departmentsError) return <ErrorComponent message="Failed to load departments. Please try again." />;

  const handleCreateDepartment = async (departmentData: any) => {
    try {
      await createDepartment(departmentData).unwrap();
      toast.success("Department created successfully");
      setIsCreateModalOpen(false);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const handleUpdateDepartment = async (departmentData: any) => {
    if (!selectedDepartment) return false;
    
    try {
      await updateDepartment({
        id: selectedDepartment.id,
        data: departmentData,
      }).unwrap();
      toast.success("Department updated successfully");
      setIsEditModalOpen(false);
      setSelectedDepartment(null);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!confirm("Are you sure you want to delete this department? This action cannot be undone.")) return;
    
    try {
      await deleteDepartment(departmentId).unwrap();
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleViewDepartment = (department: any) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter((department: any) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarInset>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground">
              Manage academic departments and their organizational structure.
            </p>
          </div>
          {canCreate("departments") && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Department</DialogTitle>
                </DialogHeader>
                <DepartmentForm 
                  onSubmit={handleCreateDepartment}
                  onCancel={() => setIsCreateModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Departments ({filteredDepartments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Building className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm ? "No departments found matching your search." : "No departments found."}
                        </p>
                        {canCreate("departments") && !searchTerm && (
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateModalOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Department
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((department: any) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{department.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {department.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {department.description || "No description"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{department._count?.teachers || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{department._count?.subjects || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(department.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDepartment(department)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canUpdate("departments") && (
                              <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canDelete("departments") && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteDepartment(department.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Department Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            {selectedDepartment && (
              <DepartmentForm 
                onSubmit={handleUpdateDepartment}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedDepartment(null);
                }}
                initialData={selectedDepartment}
                isEditing
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Department Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Department Details</DialogTitle>
            </DialogHeader>
            {selectedDepartment && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <p className="font-medium">{selectedDepartment.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Slug:</span>
                        <p className="font-medium">{selectedDepartment.slug}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Description:</span>
                        <p className="font-medium">{selectedDepartment.description || "No description"}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Teachers:</span>
                        <Badge variant="outline">{selectedDepartment._count?.teachers || 0}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Subjects:</span>
                        <Badge variant="outline">{selectedDepartment._count?.subjects || 0}</Badge>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <p className="font-medium">{new Date(selectedDepartment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
}
