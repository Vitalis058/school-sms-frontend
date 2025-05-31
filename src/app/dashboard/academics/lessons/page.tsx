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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar,
  Clock,
  User,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetLessonsQuery,
  useGetLessonByIdQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetGradesQuery,
  useGetStreamsByGradeQuery,
  useGetSubjectsQuery,
  useGetTimeSlotsQuery,
  useGetStreamTimetableQuery,
  useGetTeacherTimetableQuery,
} from "@/store/api/academicsApi";
import { useGetTeachersQuery } from "@/store/api/teacherApi";
import { LessonForm } from "@/components/LessonForm";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export default function LessonsPage() {
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions();
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "timetable">("list");

  // API queries
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: streams = [], isLoading: streamsLoading } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: !selectedGrade || selectedGrade === "all",
  });
  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjectsQuery({});
  const { data: teachersResponse, isLoading: teachersLoading } = useGetTeachersQuery({});
  const { data: timeSlots = [], isLoading: timeSlotsLoading } = useGetTimeSlotsQuery();
  
  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useGetLessonsQuery({
    streamId: selectedStream !== "all" ? selectedStream : undefined,
    teacherId: selectedTeacher !== "all" ? selectedTeacher : undefined,
    subjectId: selectedSubject !== "all" ? selectedSubject : undefined,
    day: selectedDay !== "all" ? selectedDay : undefined,
  });

  // Mutations
  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();

  const teachers = teachersResponse?.data || [];

  // Check permissions
  if (!canRead("lessons")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view lessons.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const isLoading = gradesLoading || subjectsLoading || teachersLoading || timeSlotsLoading || lessonsLoading;

  if (isLoading) return <LoadingComponent message="Loading lessons..." />;
  if (lessonsError) return <ErrorComponent message="Failed to load lessons. Please try again." />;

  const handleCreateLesson = async (lessonData: any) => {
    try {
      const result = await createLesson(lessonData).unwrap();
      
      // Check for conflicts
      if ('conflicts' in result) {
        const conflictMessages = result.conflicts.map((c: any) => c.message).join(', ');
        toast.error(`Scheduling conflicts detected: ${conflictMessages}`);
        return false;
      }
      
      toast.success("Lesson created successfully");
      setIsCreateModalOpen(false);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const handleUpdateLesson = async (lessonData: any) => {
    if (!selectedLesson) return false;
    
    try {
      const result = await updateLesson({
        id: selectedLesson.id,
        data: lessonData,
      }).unwrap();
      
      // Check for conflicts
      if ('conflicts' in result) {
        const conflictMessages = result.conflicts.map((c: any) => c.message).join(', ');
        toast.error(`Scheduling conflicts detected: ${conflictMessages}`);
        return false;
      }
      
      toast.success("Lesson updated successfully");
      setIsEditModalOpen(false);
      setSelectedLesson(null);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    
    try {
      await deleteLesson(lessonId).unwrap();
      toast.success("Lesson deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleViewLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsViewModalOpen(true);
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  // Filter lessons based on search term
  const filteredLessons = lessons.filter((lesson: any) =>
    lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.Subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.Teacher?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.Teacher?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDayName = (day: string) => {
    const dayObj = DAYS_OF_WEEK.find(d => d.value === day);
    return dayObj ? dayObj.label : day;
  };

  return (
    <SidebarInset>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
            <p className="text-muted-foreground">
              Manage class schedules, lessons, and timetables.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "timetable" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("timetable")}
              >
                Timetable
              </Button>
            </div>
            {canCreate("lessons") && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                  </DialogHeader>
                  <LessonForm 
                    onSubmit={handleCreateLesson}
                    onCancel={() => setIsCreateModalOpen(false)}
                    grades={grades}
                    streams={streams}
                    subjects={subjects}
                    teachers={teachers}
                    timeSlots={timeSlots}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Grade</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
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

              <div>
                <label className="text-sm font-medium mb-2 block">Stream</label>
                <Select value={selectedStream} onValueChange={setSelectedStream} disabled={!selectedGrade || selectedGrade === "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    {streams.map((stream) => (
                      <SelectItem key={stream.id} value={stream.id}>
                        {stream.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Teacher</label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teachers</SelectItem>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Day</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {viewMode === "list" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Lessons ({filteredLessons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Day & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {searchTerm ? "No lessons found matching your search." : "No lessons found."}
                          </p>
                          {canCreate("lessons") && !searchTerm && (
                            <Button
                              variant="outline"
                              onClick={() => setIsCreateModalOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Lesson
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLessons.map((lesson: any) => (
                      <TableRow key={lesson.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lesson.name}</div>
                            {lesson.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {lesson.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{lesson.Subject?.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {lesson.Subject?.subjectCode}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{lesson.Teacher?.firstName} {lesson.Teacher?.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{lesson.Stream?.Grade?.name} - {lesson.Stream?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{getDayName(lesson.day)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {lesson.TimeSlot?.startTime} - {lesson.TimeSlot?.endTime}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewLesson(lesson)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canUpdate("lessons") && (
                                <DropdownMenuItem onClick={() => handleEditLesson(lesson)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete("lessons") && (
                                <DropdownMenuItem
                                  onClick={() => handleDeleteLesson(lesson.id)}
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timetable View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Timetable view will be implemented here.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will show a visual calendar layout of all lessons.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Lesson Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Lesson</DialogTitle>
            </DialogHeader>
            {selectedLesson && (
              <LessonForm 
                onSubmit={handleUpdateLesson}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedLesson(null);
                }}
                initialData={selectedLesson}
                isEditing
                grades={grades}
                streams={streams}
                subjects={subjects}
                teachers={teachers}
                timeSlots={timeSlots}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Lesson Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Lesson Details</DialogTitle>
            </DialogHeader>
            {selectedLesson && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Basic Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <p className="font-medium">{selectedLesson.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Description:</span>
                        <p className="font-medium">{selectedLesson.description || "No description"}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Subject:</span>
                        <p className="font-medium">{selectedLesson.Subject?.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Teacher:</span>
                        <p className="font-medium">
                          {selectedLesson.Teacher?.firstName} {selectedLesson.Teacher?.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Schedule</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Day:</span>
                        <p className="font-medium">{getDayName(selectedLesson.day)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Time:</span>
                        <p className="font-medium">
                          {selectedLesson.TimeSlot?.startTime} - {selectedLesson.TimeSlot?.endTime}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Class:</span>
                        <p className="font-medium">
                          {selectedLesson.Stream?.Grade?.name} - {selectedLesson.Stream?.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <p className="font-medium">
                          {new Date(selectedLesson.createdAt).toLocaleDateString()}
                        </p>
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
