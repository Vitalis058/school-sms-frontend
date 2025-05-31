"use client";

import React, { useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePermissions } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  BookOpen,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Users,
  UserPlus,
  UserMinus,
  Building,
  CheckCircle,
  XCircle,
  FlaskConical,
  MapPin,
} from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useAssignTeacherToSubjectMutation,
  useRemoveTeacherFromSubjectMutation,
  useGetDepartmentsQuery,
} from "@/store/api/academicsApi";
import { useGetTeachersQuery } from "@/store/api/teacherApi";
import { SubjectForm } from "@/components/SubjectForm";
import { TeacherAssignmentModal } from "@/components/TeacherAssignmentModal";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export default function SubjectsPage() {
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  // API queries
  const { data: subjects = [], isLoading: subjectsLoading, error: subjectsError } = useGetSubjectsQuery({
    departmentId: selectedDepartment !== "all" ? selectedDepartment : undefined,
    active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
    search: searchTerm || undefined,
  });

  const { data: departments = [], isLoading: departmentsLoading } = useGetDepartmentsQuery();
  const { data: teachersResponse, isLoading: teachersLoading } = useGetTeachersQuery({});
  const teachers = teachersResponse?.data || [];

  // Mutations
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();
  const [assignTeacher] = useAssignTeacherToSubjectMutation();
  const [removeTeacher] = useRemoveTeacherFromSubjectMutation();

  // Check permissions
  if (!canRead("subjects")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view subjects.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const isLoading = subjectsLoading || departmentsLoading || teachersLoading;

  if (isLoading) return <LoadingComponent message="Loading subjects..." />;
  if (subjectsError) return <ErrorComponent message="Failed to load subjects. Please try again." />;

  const handleCreateSubject = async (subjectData: any) => {
    try {
      // Add slug generation if not provided
      const dataWithSlug = {
        ...subjectData,
        slug: subjectData.slug || subjectData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      };
      
      const result = await createSubject(dataWithSlug).unwrap();
      toast.success("Subject created successfully");
      setIsCreateModalOpen(false);
      
      // Optimistic updates are handled in the mutation's onQueryStarted
      // No need for manual cache invalidation
      
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const handleUpdateSubject = async (subjectData: any) => {
    if (!selectedSubject) return false;
    
    try {
      await updateSubject({
        id: selectedSubject.id,
        data: subjectData,
      }).unwrap();
      toast.success("Subject updated successfully");
      setIsEditModalOpen(false);
      setSelectedSubject(null);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    
    try {
      await deleteSubject(subjectId).unwrap();
      toast.success("Subject deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAssignTeacher = async (teacherId: string) => {
    if (!selectedSubject) return;
    
    await assignTeacher({
      subjectId: selectedSubject.id,
      teacherId,
    }).unwrap();
  };

  const handleRemoveTeacher = async (teacherId: string) => {
    if (!selectedSubject) return;
    
    await removeTeacher({
      subjectId: selectedSubject.id,
      teacherId,
    }).unwrap();
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsTeacherModalOpen(false);
    setSelectedSubject(null);
  };

  const filteredSubjects = subjects.filter((subject: any) => {
    const matchesSearch = !searchTerm || 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.shortname.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || subject.departmentId === selectedDepartment;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && subject.active) ||
      (statusFilter === "inactive" && !subject.active);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <SidebarInset>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
            <p className="text-muted-foreground">
              Manage academic subjects and teacher assignments.
            </p>
          </div>
          {canCreate("subjects") && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Subject</DialogTitle>
                </DialogHeader>
                <SubjectForm 
                  onSubmit={handleCreateSubject}
                  onCancel={() => setIsCreateModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((department: any) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDepartment("all");
                    setStatusFilter("all");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subjects ({filteredSubjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectsLoading ? (
              <div className="text-center py-8">Loading subjects...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No subjects found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{subject.name}</div>
                            <div className="text-sm text-muted-foreground">{subject.shortname}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{subject.subjectCode}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {subject.Department?.name || "No Department"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{subject._count?.teachers || 0} teachers</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedSubject(subject);
                                setIsTeacherModalOpen(true);
                              }}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {subject.optional && (
                              <Badge variant="secondary" className="text-xs">
                                Optional
                              </Badge>
                            )}
                            {subject.labRequired && (
                              <Badge variant="outline" className="text-xs">
                                <FlaskConical className="h-3 w-3 mr-1" />
                                Lab
                              </Badge>
                            )}
                            {subject.fieldtrips && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                Field Trips
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {subject.active ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSubject(subject);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSubject(subject);
                                  setIsTeacherModalOpen(true);
                                }}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Manage Teachers
                              </DropdownMenuItem>
                              {canUpdate("subjects") && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedSubject(subject);
                                    setIsEditModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete("subjects") && (
                                <DropdownMenuItem
                                  onClick={() => handleDeleteSubject(subject.id)}
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
            )}
          </CardContent>
        </Card>

        {/* Edit Subject Modal */}
        {selectedSubject && (
          <Dialog open={isEditModalOpen} onOpenChange={(open) => {
            if (!open) {
              setIsEditModalOpen(false);
              setSelectedSubject(null);
            }
          }}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Subject</DialogTitle>
              </DialogHeader>
              <SubjectForm 
                onSubmit={handleUpdateSubject}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedSubject(null);
                }}
                initialData={selectedSubject}
                isEditing
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Teacher Assignment Modal */}
        {selectedSubject && (
          <TeacherAssignmentModal
            isOpen={isTeacherModalOpen}
            onClose={() => {
              setIsTeacherModalOpen(false);
            }}
            subject={selectedSubject}
            teachers={teachers}
            onAssignTeacher={handleAssignTeacher}
            onRemoveTeacher={handleRemoveTeacher}
          />
        )}

        {/* View Details Modal */}
        {selectedSubject && (
          <Dialog open={isViewModalOpen} onOpenChange={(open) => {
            if (!open) {
              setIsViewModalOpen(false);
            }
          }}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Subject Details - {selectedSubject.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Subject Name</label>
                        <p className="text-lg font-semibold">{selectedSubject.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Subject Code</label>
                        <p className="text-lg font-semibold">{selectedSubject.subjectCode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Short Name</label>
                        <p className="text-lg font-semibold">{selectedSubject.shortname}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                        <p className="text-lg font-semibold">{selectedSubject.Department?.name || "No Department"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status and Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status & Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div className="mt-1">
                          {selectedSubject.active ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Properties</label>
                        <div className="mt-1 flex gap-2 flex-wrap">
                          {selectedSubject.optional && (
                            <Badge variant="outline">Optional</Badge>
                          )}
                          {selectedSubject.labRequired && (
                            <Badge variant="outline">
                              <FlaskConical className="h-3 w-3 mr-1" />
                              Lab Required
                            </Badge>
                          )}
                          {selectedSubject.fieldtrips && (
                            <Badge variant="outline">
                              <MapPin className="h-3 w-3 mr-1" />
                              Field Trips
                            </Badge>
                          )}
                          {!selectedSubject.optional && !selectedSubject.labRequired && !selectedSubject.fieldtrips && (
                            <span className="text-muted-foreground text-sm">No special properties</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assigned Teachers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Assigned Teachers ({selectedSubject.teachers?.length || 0})</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsViewModalOpen(false);
                          setIsTeacherModalOpen(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Manage Teachers
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedSubject.teachers?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubject.teachers.map((teacher: any) => (
                          <div key={teacher.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No teachers assigned to this subject yet.</p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            setIsViewModalOpen(false);
                            setIsTeacherModalOpen(true);
                          }}
                        >
                          Assign Teachers
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{selectedSubject._count?.teachers || 0}</div>
                        <div className="text-sm text-muted-foreground">Assigned Teachers</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{selectedSubject._count?.Lesson || 0}</div>
                        <div className="text-sm text-muted-foreground">Scheduled Lessons</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {selectedSubject.active ? "Active" : "Inactive"}
                        </div>
                        <div className="text-sm text-muted-foreground">Current Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Subject
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </SidebarInset>
  );
}
