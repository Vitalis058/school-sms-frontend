"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Award,
  Target,
  BookOpen,
  PieChart
} from "lucide-react";

export function ExaminationAnalytics() {
  // Mock analytics data
  const performanceStats = {
    overallAverage: 78.5,
    topPerformers: 156,
    improvementNeeded: 45,
    totalStudents: 1234,
    passRate: 87.2,
    excellenceRate: 23.4,
  };

  const gradeDistribution = [
    { grade: "A+", count: 89, percentage: 7.2, color: "bg-green-500" },
    { grade: "A", count: 156, percentage: 12.6, color: "bg-green-400" },
    { grade: "B+", count: 234, percentage: 19.0, color: "bg-blue-500" },
    { grade: "B", count: 298, percentage: 24.1, color: "bg-blue-400" },
    { grade: "C+", count: 187, percentage: 15.2, color: "bg-yellow-500" },
    { grade: "C", count: 145, percentage: 11.7, color: "bg-yellow-400" },
    { grade: "D", count: 89, percentage: 7.2, color: "bg-orange-500" },
    { grade: "F", count: 36, percentage: 2.9, color: "bg-red-500" },
  ];

  const subjectPerformance = [
    { subject: "Mathematics", average: 82.3, trend: "up", students: 1234 },
    { subject: "English", average: 79.1, trend: "up", students: 1234 },
    { subject: "Science", average: 76.8, trend: "down", students: 1234 },
    { subject: "Social Studies", average: 81.2, trend: "up", students: 1234 },
    { subject: "Kiswahili", average: 74.5, trend: "down", students: 1234 },
    { subject: "Religious Education", average: 85.7, trend: "up", students: 1234 },
  ];

  const termComparison = [
    { term: "Term 1", average: 76.2, students: 1234 },
    { term: "Term 2", average: 78.5, students: 1234 },
    { term: "Term 3", average: 0, students: 0 }, // Future term
  ];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.overallAverage}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.3% from last term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.passRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +1.8% from last term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellence Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.excellenceRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.9% from last term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Support</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.improvementNeeded}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -12 from last term
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Grade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gradeDistribution.map((item) => (
              <div key={item.grade} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="font-medium">Grade {item.grade}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {item.count} students
                  </span>
                  <Badge variant="outline" className="min-w-[60px] justify-center">
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {/* Visual bar chart */}
          <div className="mt-6 space-y-2">
            {gradeDistribution.map((item) => (
              <div key={item.grade} className="flex items-center gap-2">
                <span className="w-8 text-sm font-medium">
                  {item.grade}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-500 rounded" />
                  <div>
                    <h4 className="font-medium">{subject.subject}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subject.students} students
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold">{subject.average}%</div>
                    <div className="text-sm text-muted-foreground">Average</div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {subject.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <Badge 
                      variant={subject.trend === "up" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {subject.trend === "up" ? "Improving" : "Declining"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Term Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Term-by-Term Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {termComparison.map((term) => (
              <div key={term.term} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{term.term}</h4>
                {term.students > 0 ? (
                  <>
                    <div className="text-2xl font-bold mb-1">{term.average}%</div>
                    <p className="text-sm text-muted-foreground">
                      {term.students} students
                    </p>
                  </>
                ) : (
                  <div className="text-muted-foreground">
                    <div className="text-lg">Upcoming</div>
                    <p className="text-sm">Not yet conducted</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Religious Education shows highest average (85.7%)</li>
                <li>• Mathematics performance improved by 3.2% this term</li>
                <li>• Overall pass rate increased to 87.2%</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Areas for Improvement</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Kiswahili needs attention (74.5% average)</li>
                <li>• Science performance declined by 1.8%</li>
                <li>• 45 students still need additional support</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Implement targeted support for struggling students</li>
                <li>• Review Science curriculum and teaching methods</li>
                <li>• Celebrate and maintain excellence in Religious Education</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 