"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Printer,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { useGetGradesQuery, useGetStreamsByGradeQuery, useGetSubjectsQuery } from "@/store/api/academicsApi";
import { useGetStudentsQuery } from "@/store/api/studentApi";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";

interface StudentResult {
  id: string;
  studentId: string;
  student: {
    firstName: string;
    lastName: string;
    admissionNumber: string;
  };
  subject: {
    name: string;
    subjectCode: string;
  };
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  term: string;
  academicYear: string;
  assessmentType: string;
}

export function StudentResultsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // API queries
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: streams = [], isLoading: streamsLoading } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: selectedGrade === "all",
  });
  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjectsQuery({});
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  });

  // Mock performance data - in real app, this would come from API
  const mockResults: StudentResult[] = [
    {
      id: "1",
      studentId: "s1",
      student: { firstName: "John", lastName: "Doe", admissionNumber: "ADM001" },
      subject: { name: "Mathematics", subjectCode: "MATH101" },
      score: 85,
      maxScore: 100,
      percentage: 85,
      grade: "A",
      term: "1",
      academicYear: "2024",
      assessmentType: "EXAM"
    },
    {
      id: "2",
      studentId: "s1",
      student: { firstName: "John", lastName: "Doe", admissionNumber: "ADM001" },
      subject: { name: "English", subjectCode: "ENG101" },
      score: 78,
      maxScore: 100,
      percentage: 78,
      grade: "B+",
      term: "1",
      academicYear: "2024",
      assessmentType: "EXAM"
    },
    {
      id: "3",
      studentId: "s2",
      student: { firstName: "Jane", lastName: "Smith", admissionNumber: "ADM002" },
      subject: { name: "Mathematics", subjectCode: "MATH101" },
      score: 92,
      maxScore: 100,
      percentage: 92,
      grade: "A+",
      term: "1",
      academicYear: "2024",
      assessmentType: "EXAM"
    },
  ];

  // Filter results
  const filteredResults = mockResults.filter((result) => {
    const matchesSearch = 
      result.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "all" || result.subject.name === selectedSubject;
    const matchesTerm = selectedTerm === "all" || result.term === selectedTerm;
    const matchesYear = result.academicYear === selectedYear;
    
    return matchesSearch && matchesSubject && matchesTerm && matchesYear;
  });

  // Group results by student
  const groupedResults = filteredResults.reduce((acc, result) => {
    const key = `${result.student.firstName} ${result.student.lastName} (${result.student.admissionNumber})`;
    if (!acc[key]) {
      acc[key] = {
        student: result.student,
        results: [],
        average: 0,
        totalScore: 0,
        totalMaxScore: 0,
      };
    }
    acc[key].results.push(result);
    acc[key].totalScore += result.score;
    acc[key].totalMaxScore += result.maxScore;
    acc[key].average = (acc[key].totalScore / acc[key].totalMaxScore) * 100;
    return acc;
  }, {} as Record<string, any>);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-800";
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C+":
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "F":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (percentage >= 60) return <Minus className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  if (gradesLoading || subjectsLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
              <label className="text-sm font-medium">Stream</label>
              <Select value={selectedStream} onValueChange={setSelectedStream}>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{Object.keys(groupedResults).length}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">
                  {Object.values(groupedResults).length > 0
                    ? Math.round(
                        Object.values(groupedResults).reduce((sum: number, student: any) => sum + student.average, 0) /
                        Object.values(groupedResults).length
                      )
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold">{filteredResults.length}</p>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {selectedTerm !== "all" ? `Term ${selectedTerm}` : "All Terms"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Results</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No results found for the selected filters.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.student.firstName} {result.student.lastName}
                      </TableCell>
                      <TableCell>{result.student.admissionNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.subject.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.subject.subjectCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {result.score}/{result.maxScore}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{result.percentage}%</span>
                          {getTrendIcon(result.percentage)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(result.grade)}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {result.assessmentType}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 