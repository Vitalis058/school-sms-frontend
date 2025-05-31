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
  Printer, 
  Download, 
  Search,
  FileText,
  GraduationCap,
  Calendar,
  User,
  School
} from "lucide-react";
import { useGetGradesQuery, useGetStreamsByGradeQuery, useGetSubjectsQuery } from "@/store/api/academicsApi";
import { useGetStudentsQuery } from "@/store/api/studentApi";
import LoadingComponent from "@/components/LoadingComponent";
import { useReactToPrint } from "react-to-print";

interface StudentReportData {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    grade: string;
    stream: string;
  };
  subjects: {
    name: string;
    code: string;
    score: number;
    maxScore: number;
    percentage: number;
    grade: string;
    position: number;
    remarks: string;
  }[];
  summary: {
    totalMarks: number;
    totalMaxMarks: number;
    overallPercentage: number;
    overallGrade: string;
    position: number;
    totalStudents: number;
  };
  term: string;
  academicYear: string;
}

const ReportCardTemplate = ({ data }: { data: StudentReportData }) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:shadow-none shadow-lg">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <School className="h-12 w-12 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Greenfield Academy</h1>
            <p className="text-gray-600">Excellence in Education</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mt-4">STUDENT REPORT CARD</h2>
        <p className="text-gray-600">Academic Year {data.academicYear} - Term {data.term}</p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-semibold">Student Information</span>
          </div>
          <div className="pl-7 space-y-2">
            <p><span className="font-medium">Name:</span> {data.student.firstName} {data.student.lastName}</p>
            <p><span className="font-medium">Admission No:</span> {data.student.admissionNumber}</p>
            <p><span className="font-medium">Class:</span> {data.student.grade} {data.student.stream}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="font-semibold">Academic Period</span>
          </div>
          <div className="pl-7 space-y-2">
            <p><span className="font-medium">Term:</span> {data.term}</p>
            <p><span className="font-medium">Year:</span> {data.academicYear}</p>
            <p><span className="font-medium">Date Generated:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Academic Performance */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Academic Performance
        </h3>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Subject</th>
                <th className="px-4 py-3 text-center font-semibold">Score</th>
                <th className="px-4 py-3 text-center font-semibold">Percentage</th>
                <th className="px-4 py-3 text-center font-semibold">Grade</th>
                <th className="px-4 py-3 text-center font-semibold">Position</th>
                <th className="px-4 py-3 text-left font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {data.subjects.map((subject, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-gray-600">{subject.code}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{subject.score}/{subject.maxScore}</td>
                  <td className="px-4 py-3 text-center font-medium">{subject.percentage}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      subject.grade === 'A+' || subject.grade === 'A' ? 'bg-green-100 text-green-800' :
                      subject.grade === 'B+' || subject.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      subject.grade === 'C+' || subject.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      subject.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {subject.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{subject.position}</td>
                  <td className="px-4 py-3 text-sm">{subject.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-4">Overall Performance</h4>
          <div className="space-y-2">
            <p><span className="font-medium">Total Marks:</span> {data.summary.totalMarks}/{data.summary.totalMaxMarks}</p>
            <p><span className="font-medium">Overall Percentage:</span> {data.summary.overallPercentage}%</p>
            <p><span className="font-medium">Overall Grade:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                data.summary.overallGrade === 'A+' || data.summary.overallGrade === 'A' ? 'bg-green-100 text-green-800' :
                data.summary.overallGrade === 'B+' || data.summary.overallGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                data.summary.overallGrade === 'C+' || data.summary.overallGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                data.summary.overallGrade === 'D' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {data.summary.overallGrade}
              </span>
            </p>
            <p><span className="font-medium">Class Position:</span> {data.summary.position} out of {data.summary.totalStudents}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-4">Grading Scale</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">A+ (90-100%):</span> Excellent</p>
            <p><span className="font-medium">A (80-89%):</span> Very Good</p>
            <p><span className="font-medium">B+ (70-79%):</span> Good</p>
            <p><span className="font-medium">B (60-69%):</span> Satisfactory</p>
            <p><span className="font-medium">C+ (50-59%):</span> Fair</p>
            <p><span className="font-medium">C (40-49%):</span> Pass</p>
            <p><span className="font-medium">D (30-39%):</span> Weak</p>
            <p><span className="font-medium">F (0-29%):</span> Fail</p>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-8 pt-8 border-t">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2 mt-12">
            <p className="font-medium">Class Teacher</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2 mt-12">
            <p className="font-medium">Principal</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2 mt-12">
            <p className="font-medium">Parent/Guardian</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ReportCardGenerator() {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [searchTerm, setSearchTerm] = useState("");
  const [previewData, setPreviewData] = useState<StudentReportData | null>(null);
  
  const reportRef = useRef<HTMLDivElement>(null);

  // API queries
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const { data: streams = [] } = useGetStreamsByGradeQuery(selectedGrade, {
    skip: selectedGrade === "all",
  });
  const { data: studentsData, isLoading: studentsLoading } = useGetStudentsQuery({
    gradeId: selectedGrade !== "all" ? selectedGrade : undefined,
    streamId: selectedStream !== "all" ? selectedStream : undefined,
  });

  const students = studentsData?.data || [];

  // Mock report data generator
  const generateReportData = (studentId: string): StudentReportData => {
    const student = students.find(s => s.id === studentId);
    if (!student) throw new Error("Student not found");

    const mockSubjects = [
      { name: "Mathematics", code: "MATH101", score: 85, maxScore: 100, percentage: 85, grade: "A", position: 3, remarks: "Excellent performance" },
      { name: "English", code: "ENG101", score: 78, maxScore: 100, percentage: 78, grade: "B+", position: 5, remarks: "Good progress" },
      { name: "Science", code: "SCI101", score: 92, maxScore: 100, percentage: 92, grade: "A+", position: 1, remarks: "Outstanding work" },
      { name: "Social Studies", code: "SS101", score: 76, maxScore: 100, percentage: 76, grade: "B+", position: 7, remarks: "Satisfactory" },
      { name: "Kiswahili", code: "KIS101", score: 82, maxScore: 100, percentage: 82, grade: "A", position: 4, remarks: "Very good" },
    ];

    const totalMarks = mockSubjects.reduce((sum, subject) => sum + subject.score, 0);
    const totalMaxMarks = mockSubjects.reduce((sum, subject) => sum + subject.maxScore, 0);
    const overallPercentage = Math.round((totalMarks / totalMaxMarks) * 100);
    
    let overallGrade = "F";
    if (overallPercentage >= 90) overallGrade = "A+";
    else if (overallPercentage >= 80) overallGrade = "A";
    else if (overallPercentage >= 70) overallGrade = "B+";
    else if (overallPercentage >= 60) overallGrade = "B";
    else if (overallPercentage >= 50) overallGrade = "C+";
    else if (overallPercentage >= 40) overallGrade = "C";
    else if (overallPercentage >= 30) overallGrade = "D";

    return {
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        admissionNumber: student.admissionNumber,
        grade: student.Grade?.name || "Unknown",
        stream: student.Stream?.name || "Unknown",
      },
      subjects: mockSubjects,
      summary: {
        totalMarks,
        totalMaxMarks,
        overallPercentage,
        overallGrade,
        position: 3,
        totalStudents: 45,
      },
      term: selectedTerm,
      academicYear: selectedYear,
    };
  };

  const handleGenerateReport = () => {
    if (selectedStudent === "all") return;
    
    try {
      const reportData = generateReportData(selectedStudent);
      setPreviewData(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Report Card - ${previewData?.student.firstName} ${previewData?.student.lastName}`,
  });

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (gradesLoading || studentsLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Report Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Report Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Term 1</SelectItem>
                  <SelectItem value="2">Term 2</SelectItem>
                  <SelectItem value="3">Term 3</SelectItem>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select a student</SelectItem>
                  {filteredStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button 
              onClick={handleGenerateReport}
              disabled={selectedStudent === "all"}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
            
            {previewData && (
              <>
                <Button 
                  onClick={handlePrint}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Report
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle>Report Card Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={reportRef}>
              <ReportCardTemplate data={previewData} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate report cards for multiple students at once.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">
              Generate for Selected Grade
            </Button>
            <Button variant="outline">
              Generate for Selected Stream
            </Button>
            <Button variant="outline">
              Generate All Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 