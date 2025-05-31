"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/utils";
import { usePermissions } from "@/contexts/AuthContext";
import { useGetGradesQuery, useGetStreamsByGradeQuery, useGetSubjectsQuery } from "@/store/api/academicsApi";
import { useGetStudentsQuery } from "@/store/api/studentApi";
import { useAddPerformanceRecordMutation, useUpdatePerformanceRecordMutation } from "@/store/api/performanceApi";

const performanceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  subjectId: z.string().min(1, "Subject is required"),
  gradeId: z.string().min(1, "Grade is required"),
  streamId: z.string().optional(),
  academicYear: z.string().min(1, "Academic year is required"),
  term: z.string().min(1, "Term is required"),
  assessmentType: z.string().min(1, "Assessment type is required"),
  score: z.number().min(0, "Score must be 0 or greater"),
  maxScore: z.number().min(1, "Max score must be greater than 0"),
  grade: z.string().optional(),
  remarks: z.string().optional(),
});

type PerformanceFormData = z.infer<typeof performanceSchema>;

interface StudentPerformance {
  id: string;
  studentId: string;
  subjectId: string;
  gradeId: string;
  streamId?: string;
  academicYear: string;
  term: string;
  assessmentType: string;
  score: number;
  maxScore: number;
  grade_letter?: string;
  remarks?: string;
}

interface PerformanceRecordFormProps {
  onSuccess?: () => void;
  initialData?: StudentPerformance;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function PerformanceRecordForm({ 
  onSuccess, 
  initialData, 
  isEditing = false,
  onCancel 
}: PerformanceRecordFormProps) {
  const { canCreate, canUpdate } = usePermissions();
  
  // Check permissions first
  if (isEditing && !canUpdate("performance")) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">You don&apos;t have permission to edit performance records.</p>
      </div>
    );
  }
  
  if (!isEditing && !canCreate("performance")) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">You don&apos;t have permission to create performance records.</p>
      </div>
    );
  }

  const { data: studentsResponse = { data: [] }, isLoading: studentsLoading } = useGetStudentsQuery({});
  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjectsQuery({});
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();
  const [addPerformanceRecord, { isLoading: isAdding }] = useAddPerformanceRecordMutation();
  const [updatePerformanceRecord, { isLoading: isUpdating }] = useUpdatePerformanceRecordMutation();

  const students = studentsResponse.data || [];

  const form = useForm<PerformanceFormData>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      studentId: initialData?.studentId || "",
      subjectId: initialData?.subjectId || "",
      gradeId: initialData?.gradeId || "",
      streamId: initialData?.streamId || "",
      academicYear: initialData?.academicYear || new Date().getFullYear().toString(),
      term: initialData?.term || "",
      assessmentType: initialData?.assessmentType || "",
      score: initialData?.score || 0,
      maxScore: initialData?.maxScore || 100,
      grade: initialData?.grade_letter || "",
      remarks: initialData?.remarks || "",
    },
  });

  const selectedGradeId = form.watch("gradeId");
  const { data: streams = [] } = useGetStreamsByGradeQuery(selectedGradeId, {
    skip: !selectedGradeId,
  });

  const score = form.watch("score");
  const maxScore = form.watch("maxScore");

  // Auto-calculate letter grade based on percentage
  React.useEffect(() => {
    if (score >= 0 && maxScore > 0) {
      const percentage = (score / maxScore) * 100;
      let letterGrade = "";
      
      if (percentage >= 90) letterGrade = "A+";
      else if (percentage >= 80) letterGrade = "A";
      else if (percentage >= 70) letterGrade = "B+";
      else if (percentage >= 60) letterGrade = "B";
      else if (percentage >= 50) letterGrade = "C+";
      else if (percentage >= 40) letterGrade = "C";
      else if (percentage >= 30) letterGrade = "D";
      else letterGrade = "F";
      
      form.setValue("grade", letterGrade);
    }
  }, [score, maxScore, form]);

  const onSubmit = async (data: PerformanceFormData) => {
    try {
      const percentage = (data.score / data.maxScore) * 100;
      
      const performanceData = {
        studentId: data.studentId,
        subjectId: data.subjectId,
        gradeId: data.gradeId,
        streamId: data.streamId || "",
        academicYear: data.academicYear,
        term: data.term,
        assessmentType: data.assessmentType as 'EXAM' | 'ASSIGNMENT' | 'QUIZ' | 'PROJECT' | 'CONTINUOUS_ASSESSMENT',
        score: data.score,
        maxScore: data.maxScore,
        percentage,
        grade_letter: data.grade || "",
        assessmentDate: new Date().toISOString(),
        remarks: data.remarks,
      };

      if (isEditing && initialData?.id) {
        await updatePerformanceRecord({ 
          id: initialData.id, 
          data: performanceData 
        }).unwrap();
        toast.success("Performance record updated successfully");
      } else {
        await addPerformanceRecord(performanceData).unwrap();
        toast.success("Performance record added successfully");
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const isLoading = gradesLoading || subjectsLoading || studentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
          <div className="text-sm text-muted-foreground">Please wait while we load the form data</div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Performance Record' : 'Add Performance Record'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Student and Academic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Student & Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students.map((student: { id: string; firstName: string; lastName: string; admissionNumber: string }) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.firstName} {student.lastName} ({student.admissionNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject: { id: string; name: string }) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades.map((grade: { id: string; name: string }) => (
                            <SelectItem key={grade.id} value={grade.id}>
                              {grade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!selectedGradeId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stream" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Streams</SelectItem>
                          {streams.map((stream: { id: string; name: string }) => (
                            <SelectItem key={stream.id} value={stream.id}>
                              {stream.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Assessment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Assessment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2024" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Term 1</SelectItem>
                          <SelectItem value="2">Term 2</SelectItem>
                          <SelectItem value="3">Term 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assessment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EXAM">Exam</SelectItem>
                          <SelectItem value="QUIZ">Quiz</SelectItem>
                          <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                          <SelectItem value="PROJECT">Project</SelectItem>
                          <SelectItem value="PRACTICAL">Practical</SelectItem>
                          <SelectItem value="CONTINUOUS_ASSESSMENT">Continuous Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="Enter score"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Score</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="Enter max score"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade (Auto-calculated)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Grade" readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter any remarks about the performance" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isAdding || isUpdating} 
                className="flex-1"
              >
                {isAdding || isUpdating ? 
                  `${isEditing ? 'Updating' : 'Adding'}...` : 
                  `${isEditing ? 'Update' : 'Add'} Performance Record`
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 