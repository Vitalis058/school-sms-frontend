"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Users, 
  GraduationCap, 
  BookOpen,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useGetStreamsQuery, 
  useGetGradesQuery,
  useCreateStreamMutation,
  useUpdateStreamMutation,
  useDeleteStreamMutation 
} from "@/store/api/academicsApi";
import { useGetTeachersQuery } from "@/store/api/teacherApi";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import { StreamFormDialog } from "./StreamFormDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { toast } from "sonner";

interface Stream {
  id: string;
  name: string;
  slug: string;
  gradeId: string;
  teacherId?: string;
  Grade?: {
    id: string;
    name: string;
    slug: string;
  };
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

export function StreamsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);

  // API hooks
  const { data: streams = [], isLoading: streamsLoading, error: streamsError } = useGetStreamsQuery();
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: teachersData, isLoading: teachersLoading } = useGetTeachersQuery({});
  
  const [createStream, { isLoading: isCreating }] = useCreateStreamMutation();
  const [updateStream, { isLoading: isUpdating }] = useUpdateStreamMutation();
  const [deleteStream, { isLoading: isDeleting }] = useDeleteStreamMutation();

  // Transform teachers data
  const teachers = teachersData?.data || [];

  // Filter streams based on search and grade
  const filteredStreams = streams.filter((stream) => {
    const matchesSearch = stream.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.Grade?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (stream.Teacher && `${stream.Teacher.firstName} ${stream.Teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGrade = selectedGrade === "all" || stream.gradeId === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });

  // Handle create stream
  const handleCreateStream = async (data: { name: string; gradeId: string; teacherId?: string }) => {
    try {
      await createStream(data).unwrap();
      toast.success("Stream created successfully!");
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create stream");
    }
  };

  // Handle edit stream
  const handleEditStream = async (data: { name: string; gradeId: string; teacherId?: string }) => {
    if (!selectedStream) return;
    
    try {
      await updateStream({
        id: selectedStream.id,
        data,
      }).unwrap();
      toast.success("Stream updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedStream(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update stream");
    }
  };

  // Handle delete stream
  const handleDeleteStream = async () => {
    if (!selectedStream) return;
    
    try {
      await deleteStream(selectedStream.id).unwrap();
      toast.success("Stream deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedStream(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete stream");
    }
  };

  // Handle edit click
  const handleEditClick = (stream: Stream) => {
    setSelectedStream(stream);
    setIsEditDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (stream: Stream) => {
    setSelectedStream(stream);
    setIsDeleteDialogOpen(true);
  };

  if (streamsLoading || gradesLoading || teachersLoading) {
    return <LoadingComponent />;
  }

  if (streamsError) {
    return <ErrorComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Streams Management</h1>
          <p className="text-muted-foreground">
            Manage class streams and their assignments
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Stream
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search streams, grades, or teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streams.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {grades.length} grades
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streams.filter(s => s.teacherId).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {streams.filter(s => !s.teacherId).length} unassigned
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streams.reduce((total, stream) => total + (stream._count?.students || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Streams Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStreams.map((stream) => (
          <Card key={stream.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{stream.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {stream.Grade?.name}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(stream)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(stream)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                <span>
                  {stream.Teacher 
                    ? `${stream.Teacher.firstName} ${stream.Teacher.lastName}`
                    : "No teacher assigned"
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{stream._count?.students || 0} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{stream._count?.Lesson || 0} lessons</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStreams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No streams found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || selectedGrade !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first stream"
              }
            </p>
            {!searchTerm && selectedGrade === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Stream
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <StreamFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateStream}
        grades={grades}
        teachers={teachers}
        isLoading={isCreating}
        title="Create New Stream"
        description="Add a new stream to organize students by class sections."
      />

      <StreamFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditStream}
        grades={grades}
        teachers={teachers}
        isLoading={isUpdating}
        title="Edit Stream"
        description="Update the stream details."
        initialData={selectedStream ? {
          name: selectedStream.name,
          gradeId: selectedStream.gradeId,
          teacherId: selectedStream.teacherId || "",
        } : undefined}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteStream}
        isLoading={isDeleting}
        title="Delete Stream"
        description={`Are you sure you want to delete "${selectedStream?.name}"? This action cannot be undone and will affect ${selectedStream?._count?.students || 0} students.`}
      />
    </div>
  );
} 