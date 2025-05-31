"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Calendar,
  Search,
  Save,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import { useGetGradesQuery, useGetStreamsByGradeQuery } from "@/store/api/academicsApi";
import { useGetStudentsQuery } from "@/store/api/studentApi";
import { 
  useGetClassAttendanceQuery,
  useBulkUpdateAttendanceMutation,
  useMarkAttendanceMutation 
} from "../api/attendanceApi";
import { AttendanceStatus } from "../types";
import LoadingComponent from "@/components/LoadingComponent";
import { toast } from "sonner";

export function AttendanceTracker() {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState<Record<string, {
    status: AttendanceStatus;
    timeIn?: string;
    timeOut?: string;
    remarks?: string;
  }>>({});

  // API queries
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: streams = [] } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: selectedGrade === "all",
  });
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  });

  // Get existing attendance for the selected class and date
  const { data: existingAttendance, isLoading: attendanceLoading } = useGetClassAttendanceQuery({
    classId: selectedStream !== "all" ? selectedStream : "",
    date: selectedDate,
  }, {
    skip: selectedStream === "all",
  });

  // Mutations
  const [bulkUpdateAttendance, { isLoading: isSaving }] = useBulkUpdateAttendanceMutation();
  const [markAttendance] = useMarkAttendanceMutation();

  const students = studentsData?.data || [];

  // Initialize attendance data when existing attendance is loaded
  React.useEffect(() => {
    if (existingAttendance?.students) {
      const initialData: Record<string, any> = {};
      existingAttendance.students.forEach((student) => {
        initialData[student.studentId] = {
          status: student.status,
          timeIn: student.timeIn,
          timeOut: student.timeOut,
          remarks: student.remarks,
        };
      });
      setAttendanceData(initialData);
    } else {
      // Initialize with default status for new attendance
      const initialData: Record<string, any> = {};
      students.forEach((student) => {
        initialData[student.id] = {
          status: AttendanceStatus.PRESENT,
          timeIn: "",
          timeOut: "",
          remarks: "",
        };
      });
      setAttendanceData(initialData);
    }
  }, [existingAttendance, students]);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        timeIn: status === AttendanceStatus.PRESENT || status === AttendanceStatus.LATE 
          ? prev[studentId]?.timeIn || new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
          : "",
      }
    }));
  };

  const handleTimeChange = (studentId: string, field: 'timeIn' | 'timeOut', value: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      }
    }));
  };

  const handleSaveAttendance = async () => {
    if (selectedStream === "all") {
      toast.error("Please select a specific class to save attendance");
      return;
    }

    try {
      const attendanceRecords = Object.entries(attendanceData).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        timeIn: data.timeIn,
        timeOut: data.timeOut,
        remarks: data.remarks,
      }));

      await bulkUpdateAttendance({
        classId: selectedStream,
        date: selectedDate,
        attendanceRecords,
      }).unwrap();

      toast.success("Attendance saved successfully!");
    } catch (error) {
      toast.error("Failed to save attendance. Please try again.");
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case AttendanceStatus.ABSENT:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case AttendanceStatus.LATE:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case AttendanceStatus.EXCUSED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case AttendanceStatus.SICK:
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case AttendanceStatus.SUSPENDED:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return <CheckCircle className="h-4 w-4" />;
      case AttendanceStatus.ABSENT:
        return <XCircle className="h-4 w-4" />;
      case AttendanceStatus.LATE:
        return <Clock className="h-4 w-4" />;
      case AttendanceStatus.EXCUSED:
        return <UserCheck className="h-4 w-4" />;
      case AttendanceStatus.SICK:
        return <AlertTriangle className="h-4 w-4" />;
      case AttendanceStatus.SUSPENDED:
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (gradesLoading || studentsLoading || attendanceLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Grade</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Class/Stream</label>
              <Select value={selectedStream} onValueChange={setSelectedStream}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {streams.map((stream) => (
                    <SelectItem key={stream.id} value={stream.id}>
                      {stream.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleSaveAttendance}
              disabled={isSaving || selectedStream === "all"}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Attendance"}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      {selectedStream !== "all" && (
        <Card>
          <CardHeader>
            <CardTitle>
              Class Attendance - {streams.find(s => s.id === selectedStream)?.name} 
              ({new Date(selectedDate).toLocaleDateString()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          No students found for the selected criteria.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => {
                      const attendance = attendanceData[student.id] || {
                        status: AttendanceStatus.PRESENT,
                        timeIn: "",
                        timeOut: "",
                        remarks: "",
                      };

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.image} />
                                <AvatarFallback>
                                  {student.firstName[0]}{student.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {student.firstName} {student.lastName}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>{student.admissionNumber}</TableCell>
                          
                          <TableCell>
                            <Select
                              value={attendance.status}
                              onValueChange={(value) => handleStatusChange(student.id, value as AttendanceStatus)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(attendance.status)}
                                    <span className="text-xs">{attendance.status}</span>
                                  </div>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(AttendanceStatus).map((status) => (
                                  <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(status)}
                                      {status}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          
                          <TableCell>
                            <Input
                              type="time"
                              value={attendance.timeIn || ""}
                              onChange={(e) => handleTimeChange(student.id, 'timeIn', e.target.value)}
                              className="w-24"
                              disabled={attendance.status === AttendanceStatus.ABSENT}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Input
                              type="time"
                              value={attendance.timeOut || ""}
                              onChange={(e) => handleTimeChange(student.id, 'timeOut', e.target.value)}
                              className="w-24"
                              disabled={attendance.status === AttendanceStatus.ABSENT}
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Input
                              placeholder="Add remarks..."
                              value={attendance.remarks || ""}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              className="w-40"
                            />
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
      )}

      {selectedStream === "all" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Class</h3>
              <p className="text-muted-foreground">
                Please select a specific grade and class to track attendance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 