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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  BookOpen,
  Award,
  AlertTriangle,
  Download,
  Filter,
} from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetClassStudentsPerformanceQuery,
  useGetPerformanceSummaryQuery,
  useGetPerformanceTrendsQuery,
} from "@/store/api/performanceApi";
import { useGetGradesQuery, useGetStreamsByGradeQuery, useGetSubjectsQuery } from "@/store/api/academicsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PerformanceRecordForm } from "@/components/PerformanceRecordForm";

// Mock data for demonstration (replace with real API data)
const mockPerformanceData = {
  classOverview: {
    totalStudents: 45,
    averageScore: 78.5,
    previousAverage: 75.2,
    trend: "UP" as const,
    trendPercentage: 4.4,
    passRate: 87,
    attendanceRate: 92,
  },
  topPerformers: [
    { id: "1", name: "Alice Johnson", average: 95.2, trend: "UP" as const, trendValue: 2.1 },
    { id: "2", name: "Bob Smith", average: 93.8, trend: "UP" as const, trendValue: 1.5 },
    { id: "3", name: "Carol Davis", average: 91.5, trend: "STABLE" as const, trendValue: 0.2 },
  ],
  needsAttention: [
    { id: "4", name: "David Wilson", average: 45.2, trend: "DOWN" as const, trendValue: -5.3 },
    { id: "5", name: "Eva Brown", average: 48.7, trend: "DOWN" as const, trendValue: -2.8 },
    { id: "6", name: "Frank Miller", average: 52.1, trend: "UP" as const, trendValue: 3.2 },
  ],
  subjectPerformance: [
    { subject: "Mathematics", average: 82.3, previous: 79.1, trend: "UP" as const, students: 45 },
    { subject: "English", average: 78.9, previous: 80.2, trend: "DOWN" as const, students: 45 },
    { subject: "Science", average: 75.6, previous: 74.8, trend: "UP" as const, students: 45 },
    { subject: "History", average: 81.2, previous: 81.0, trend: "STABLE" as const, students: 45 },
    { subject: "Geography", average: 77.4, previous: 75.9, trend: "UP" as const, students: 45 },
  ],
  trendData: [
    { month: "Jan", average: 72.5 },
    { month: "Feb", average: 74.2 },
    { month: "Mar", average: 75.8 },
    { month: "Apr", average: 77.1 },
    { month: "May", average: 78.5 },
  ],
  gradeDistribution: [
    { grade: "A", count: 12, percentage: 26.7 },
    { grade: "B", count: 18, percentage: 40.0 },
    { grade: "C", count: 10, percentage: 22.2 },
    { grade: "D", count: 4, percentage: 8.9 },
    { grade: "F", count: 1, percentage: 2.2 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TrendIcon = ({ trend, value }: { trend: 'UP' | 'DOWN' | 'STABLE'; value: number }) => {
  if (trend === 'UP') {
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  } else if (trend === 'DOWN') {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-gray-500" />;
};

const TrendBadge = ({ trend, value }: { trend: 'UP' | 'DOWN' | 'STABLE'; value: number }) => {
  const getVariant = () => {
    if (trend === 'UP') return 'default';
    if (trend === 'DOWN') return 'destructive';
    return 'secondary';
  };

  return (
    <Badge variant={getVariant()} className="flex items-center gap-1">
      <TrendIcon trend={trend} value={value} />
      {Math.abs(value).toFixed(1)}%
    </Badge>
  );
};

// Type assertions for Recharts components
const LineChartComponent = LineChart as any;
const LineComponent = Line as any;
const BarChartComponent = BarChart as any;
const BarComponent = Bar as any;
const XAxisComponent = XAxis as any;
const YAxisComponent = YAxis as any;
const CartesianGridComponent = CartesianGrid as any;
const TooltipComponent = Tooltip as any;
const PieChartComponent = PieChart as any;
const PieComponent = Pie as any;
const CellComponent = Cell as any;

export default function PerformancePage() {
  const { canRead, isAdmin, isTeacher, isStaff } = usePermissions();
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("current");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // API queries
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: streams = [], isLoading: streamsLoading } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: !selectedGrade || selectedGrade === "all",
  });
  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjectsQuery({});
  
  // Performance data queries
  const { data: performanceSummary, isLoading: summaryLoading, error: summaryError } = useGetPerformanceSummaryQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  });
  
  const { data: performanceTrends, isLoading: trendsLoading } = useGetPerformanceTrendsQuery({
    filters: {
      gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
      streamId: selectedStream !== "all" ? selectedStream : undefined,
      term: selectedTerm !== "current" ? selectedTerm : undefined,
    }
  });

  // Check permissions
  if (!canRead("performance")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view student performance data.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const isLoading = gradesLoading || streamsLoading || subjectsLoading || summaryLoading;

  if (isLoading) return <LoadingComponent message="Loading performance data..." />;
  
  if (summaryError) return <ErrorComponent message="Failed to load performance data. Please try again." />;

  // Use real data or fallback to mock data with proper type handling
  const apiData = performanceSummary?.data;
  const performanceData = {
    totalStudents: apiData?.totalStudents || mockPerformanceData.classOverview.totalStudents,
    averageScore: apiData?.averagePerformance || mockPerformanceData.classOverview.averageScore,
    previousAverage: mockPerformanceData.classOverview.previousAverage, // Not in API response
    trend: (apiData?.performanceTrend || mockPerformanceData.classOverview.trend) as 'UP' | 'DOWN' | 'STABLE',
    trendPercentage: apiData?.trendPercentage || mockPerformanceData.classOverview.trendPercentage,
    passRate: mockPerformanceData.classOverview.passRate, // Not in API response
    attendanceRate: mockPerformanceData.classOverview.attendanceRate, // Not in API response
    topPerformers: apiData?.topPerformers || mockPerformanceData.topPerformers,
    needsAttention: apiData?.needsAttention || mockPerformanceData.needsAttention,
    subjectPerformance: apiData?.subjectPerformance || mockPerformanceData.subjectPerformance,
  };

  const trendData = performanceTrends?.data?.overallTrend || mockPerformanceData.trendData;

  return (
    <SidebarInset>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Performance</h1>
            <p className="text-muted-foreground">
              Monitor and analyze student academic performance across subjects and time periods.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            {(isAdmin() || isTeacher()) && (
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    Add Performance Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Performance Record</DialogTitle>
                  </DialogHeader>
                  <PerformanceRecordForm 
                    onSuccess={() => setIsAddModalOpen(false)}
                    onCancel={() => setIsAddModalOpen(false)}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="text-sm font-medium mb-2 block">Term</label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Term</SelectItem>
                    <SelectItem value="term1">Term 1</SelectItem>
                    <SelectItem value="term2">Term 2</SelectItem>
                    <SelectItem value="term3">Term 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{performanceData.averageScore}%</div>
                <TrendBadge 
                  trend={performanceData.trend} 
                  value={performanceData.trendPercentage} 
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Previous: {performanceData.previousAverage}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.passRate}%</div>
              <p className="text-xs text-muted-foreground">Students passing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Average attendance</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Student Performance</TabsTrigger>
            <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChartComponent data={trendData}>
                      <CartesianGridComponent strokeDasharray="3 3" />
                      <XAxisComponent dataKey="month" />
                      <YAxisComponent />
                      <TooltipComponent />
                      <LineComponent 
                        type="monotone" 
                        dataKey="average" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8' }}
                      />
                    </LineChartComponent>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChartComponent>
                      <PieComponent
                        data={mockPerformanceData.gradeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ grade, percentage }: { grade: string; percentage: number }) => `${grade} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {mockPerformanceData.gradeDistribution.map((entry, index) => (
                          <CellComponent key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </PieComponent>
                      <TooltipComponent />
                    </PieChartComponent>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers and Needs Attention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.topPerformers.map((student: any, index: number) => (
                      <div key={student.id || student.studentId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{student.name || student.studentName}</p>
                            <p className="text-sm text-muted-foreground">{student.average}% average</p>
                          </div>
                        </div>
                        <TrendBadge trend={student.trend || "STABLE"} value={student.trendValue || 0} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.needsAttention.map((student: any) => (
                      <div key={student.id || student.studentId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{student.name || student.studentName}</p>
                          <p className="text-sm text-muted-foreground">{student.average}% average</p>
                        </div>
                        <TrendBadge trend={student.trend || "DOWN"} value={student.trendValue || 0} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChartComponent data={performanceData.subjectPerformance}>
                      <CartesianGridComponent strokeDasharray="3 3" />
                      <XAxisComponent dataKey="subject" />
                      <YAxisComponent />
                      <TooltipComponent />
                      <BarComponent dataKey="average" fill="#8884d8" />
                      <BarComponent dataKey="previous" fill="#82ca9d" />
                    </BarChartComponent>
                  </ResponsiveContainer>

                  <Table>
                    <TableHeader>
                      <TableRow>  
                        <TableHead>Subject</TableHead>
                        <TableHead>Current Average</TableHead>
                        <TableHead>Previous Average</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Students</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performanceData.subjectPerformance.map((subject: any) => (
                        <TableRow key={subject.subject || subject.subjectName}>
                          <TableCell className="font-medium">{subject.subject || subject.subjectName}</TableCell>
                          <TableCell>{subject.average}%</TableCell>
                          <TableCell>{subject.previous}%</TableCell>
                          <TableCell>
                            <TrendBadge 
                              trend={subject.trend} 
                              value={((subject.average - subject.previous) / subject.previous) * 100} 
                            />
                          </TableCell>
                          <TableCell>{subject.students || 45}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Individual Student Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed student performance data will be displayed here based on selected filters.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Long-term performance trends and predictive analytics will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
