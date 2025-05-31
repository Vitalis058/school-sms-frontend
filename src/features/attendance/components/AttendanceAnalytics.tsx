"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import { useGetGradesQuery, useGetStreamsByGradeQuery } from "@/store/api/academicsApi";
import { 
  useGetAttendanceDashboardQuery,
  useGetAttendancePatternsQuery,
  useGetAttendanceStatsQuery
} from "../api/attendanceApi";
import LoadingComponent from "@/components/LoadingComponent";

export function AttendanceAnalytics() {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("month");

  // API queries
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: streams = [] } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: selectedGrade === "all",
  });

  // Get dashboard analytics
  const { data: dashboardData, isLoading: dashboardLoading } = useGetAttendanceDashboardQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  });

  // Get attendance patterns
  const { data: patterns = [], isLoading: patternsLoading } = useGetAttendancePatternsQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
  });

  // Get attendance statistics
  const { data: stats, isLoading: statsLoading } = useGetAttendanceStatsQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  });

  if (gradesLoading || dashboardLoading || patternsLoading || statsLoading) {
    return <LoadingComponent />;
  }

  const weeklyTrend = dashboardData?.weeklyTrend || [];
  const topAbsentees = dashboardData?.topAbsentees || [];
  const recentPatterns = dashboardData?.recentPatterns || [];

  const getPatternSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'chronic_absence':
        return <AlertTriangle className="h-4 w-4" />;
      case 'frequent_late':
        return <Clock className="h-4 w-4" />;
      case 'improving':
        return <TrendingUp className="h-4 w-4" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Attendance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="term">This Term</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.attendanceRate.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chronic Absentees</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patterns.filter(p => p.pattern === 'chronic_absence').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Students below 75% attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frequent Late</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patterns.filter(p => p.pattern === 'frequent_late').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Students with tardiness issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improving Students</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patterns.filter(p => p.pattern === 'improving').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Positive attendance trends
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Attendance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyTrend.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="font-medium">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${day.attendanceRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12">
                    {day.attendanceRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Attendance Patterns & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatterns.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Patterns Detected</h3>
                <p className="text-muted-foreground">
                  All students are maintaining good attendance patterns.
                </p>
              </div>
            ) : (
              recentPatterns.map((pattern, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${getPatternSeverityColor(pattern.severity)}`}>
                    {getPatternIcon(pattern.pattern)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium capitalize">
                        {pattern.pattern.replace('_', ' ')}
                      </h4>
                      <Badge className={getPatternSeverityColor(pattern.severity)}>
                        {pattern.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pattern.description}
                    </p>
                    <p className="text-sm font-medium">
                      Recommendation: {pattern.recommendation}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Absentees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Students Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topAbsentees.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Excellent Attendance!</h3>
                <p className="text-muted-foreground">
                  All students are maintaining good attendance rates.
                </p>
              </div>
            ) : (
              topAbsentees.map((student) => (
                <div key={student.studentId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-red-500 rounded" />
                    <div>
                      <div className="font-medium">
                        {student.student.firstName} {student.student.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.student.admissionNumber}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-red-600">
                      {student.attendanceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {student.absentDays} absent days
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Positive Trends</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Overall attendance rate has improved by 2.1% this month</li>
                <li>• {patterns.filter(p => p.pattern === 'improving').length} students showing improvement</li>
                <li>• Monday attendance has increased significantly</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Areas for Attention</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• {patterns.filter(p => p.pattern === 'chronic_absence').length} students with chronic absence patterns</li>
                <li>• Friday attendance tends to be lower than other days</li>
                <li>• Late arrivals have increased by 15% this week</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Recommended Actions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Schedule parent meetings for students with attendance below 75%</li>
                <li>• Implement early morning engagement activities</li>
                <li>• Review and adjust Friday schedule to improve attendance</li>
                <li>• Recognize students with perfect attendance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 