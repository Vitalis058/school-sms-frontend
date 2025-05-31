"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  Download,
  Printer,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Eye
} from "lucide-react";
import { useGetGradesQuery, useGetStreamsByGradeQuery } from "@/store/api/academicsApi";
import { 
  useGetAttendanceReportQuery,
  useGetStudentAttendanceSummaryQuery,
  useGenerateAttendanceReportMutation
} from "../api/attendanceApi";
import { AttendanceStatus } from "../types";
import LoadingComponent from "@/components/LoadingComponent";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

export function AttendanceReports() {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState<string>("summary");
  
  const reportRef = useRef<HTMLDivElement>(null);

  // API queries
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: streams = [] } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: selectedGrade === "all",
  });

  // Get student attendance summary
  const { data: studentSummaries = [], isLoading: summaryLoading } = useGetStudentAttendanceSummaryQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    startDate,
    endDate,
  });

  // Get detailed report data
  const { data: reportData, isLoading: reportLoading } = useGetAttendanceReportQuery({
    classId: selectedStream !== "all" ? selectedStream : "",
    startDate,
    endDate,
    type: reportType,
  }, {
    skip: selectedStream === "all",
  });

  // Mutations
  const [generateReport, { isLoading: isGenerating }] = useGenerateAttendanceReportMutation();

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Attendance Report - ${new Date().toLocaleDateString()}`,
  });

  const handleGenerateReport = async (format: 'pdf' | 'excel') => {
    if (selectedStream === "all") {
      toast.error("Please select a specific class to generate report");
      return;
    }

    try {
      const result = await generateReport({
        classId: selectedStream,
        startDate,
        endDate,
        format,
      }).unwrap();

      // Open the generated report
      window.open(result.reportUrl, '_blank');
      toast.success(`${format.toUpperCase()} report generated successfully!`);
    } catch (error) {
      toast.error("Failed to generate report. Please try again.");
    }
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 85) return "text-blue-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceRateBadge = (rate: number) => {
    if (rate >= 95) return "bg-green-100 text-green-800";
    if (rate >= 85) return "bg-blue-100 text-blue-800";
    if (rate >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (gradesLoading || summaryLoading || reportLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Attendance Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="detailed">Detailed Report</SelectItem>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handlePrint}
              disabled={selectedStream === "all"}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            
            <Button 
              onClick={() => handleGenerateReport('pdf')}
              disabled={isGenerating || selectedStream === "all"}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            
            <Button 
              onClick={() => handleGenerateReport('excel')}
              disabled={isGenerating || selectedStream === "all"}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <div ref={reportRef}>
        {selectedStream !== "all" && reportData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Attendance Report - {reportData.classInfo.name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Generated on</div>
                  <div className="font-medium">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Summary Statistics */}
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.summary.totalStudents}
                  </div>
                  <div className="text-sm text-blue-600">Total Students</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.summary.attendanceRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-600">Average Attendance</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {reportData.summary.absentCount}
                  </div>
                  <div className="text-sm text-yellow-600">Total Absences</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {reportData.summary.lateCount}
                  </div>
                  <div className="text-sm text-red-600">Late Arrivals</div>
                </div>
              </div>

              {/* Student Summary Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Admission No.</TableHead>
                      <TableHead>Total Days</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Late</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.studentSummaries.map((summary) => (
                      <TableRow key={summary.studentId}>
                        <TableCell>
                          <div className="font-medium">
                            {summary.student.firstName} {summary.student.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{summary.student.admissionNumber}</TableCell>
                        <TableCell>{summary.totalDays}</TableCell>
                        <TableCell className="text-green-600">{summary.presentDays}</TableCell>
                        <TableCell className="text-red-600">{summary.absentDays}</TableCell>
                        <TableCell className="text-yellow-600">{summary.lateDays}</TableCell>
                        <TableCell>
                          <span className={getAttendanceRateColor(summary.attendanceRate)}>
                            {summary.attendanceRate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAttendanceRateBadge(summary.attendanceRate)}>
                            {summary.attendanceRate >= 95 ? "Excellent" :
                             summary.attendanceRate >= 85 ? "Good" :
                             summary.attendanceRate >= 75 ? "Fair" : "Poor"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Daily Statistics */}
              {reportData.dailyStats && reportData.dailyStats.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Daily Attendance Trends</h3>
                  <div className="grid gap-2">
                    {reportData.dailyStats.map((daily) => (
                      <div key={daily.date} className="flex items-center justify-between p-3 border rounded">
                        <div className="font-medium">
                          {new Date(daily.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-green-600">
                            Present: {daily.stats.presentCount}
                          </span>
                          <span className="text-red-600">
                            Absent: {daily.stats.absentCount}
                          </span>
                          <span className="text-yellow-600">
                            Late: {daily.stats.lateCount}
                          </span>
                          <Badge className={getAttendanceRateBadge(daily.stats.attendanceRate)}>
                            {daily.stats.attendanceRate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Student Summary View */}
      {selectedStream === "all" && studentSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance Summary</CardTitle>
            <p className="text-muted-foreground">
              Overview of attendance across selected criteria
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentSummaries.map((summary) => (
                    <TableRow key={summary.studentId}>
                      <TableCell>
                        <div className="font-medium">
                          {summary.student.firstName} {summary.student.lastName}
                        </div>
                      </TableCell>
                      <TableCell>{summary.student.admissionNumber}</TableCell>
                      <TableCell>{summary.totalDays}</TableCell>
                      <TableCell className="text-green-600">{summary.presentDays}</TableCell>
                      <TableCell className="text-red-600">{summary.absentDays}</TableCell>
                      <TableCell className="text-yellow-600">{summary.lateDays}</TableCell>
                      <TableCell>
                        <span className={getAttendanceRateColor(summary.attendanceRate)}>
                          {summary.attendanceRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStream === "all" && studentSummaries.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                Select specific criteria and date range to generate attendance reports.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 