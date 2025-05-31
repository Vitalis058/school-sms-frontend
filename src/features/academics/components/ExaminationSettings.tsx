"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Settings, 
  GraduationCap, 
  Calendar,
  Save,
  Plus,
  Trash2,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface GradingScale {
  id: string;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  description: string;
  points: number;
}

interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export function ExaminationSettings() {
  const [gradingScale, setGradingScale] = useState<GradingScale[]>([
    { id: "1", grade: "A+", minPercentage: 90, maxPercentage: 100, description: "Excellent", points: 12 },
    { id: "2", grade: "A", minPercentage: 80, maxPercentage: 89, description: "Very Good", points: 11 },
    { id: "3", grade: "B+", minPercentage: 70, maxPercentage: 79, description: "Good", points: 10 },
    { id: "4", grade: "B", minPercentage: 60, maxPercentage: 69, description: "Satisfactory", points: 9 },
    { id: "5", grade: "C+", minPercentage: 50, maxPercentage: 59, description: "Fair", points: 8 },
    { id: "6", grade: "C", minPercentage: 40, maxPercentage: 49, description: "Pass", points: 7 },
    { id: "7", grade: "D", minPercentage: 30, maxPercentage: 39, description: "Weak", points: 6 },
    { id: "8", grade: "F", minPercentage: 0, maxPercentage: 29, description: "Fail", points: 0 },
  ]);

  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([
    { id: "1", name: "Term 1", startDate: "2024-01-15", endDate: "2024-04-12", isActive: false },
    { id: "2", name: "Term 2", startDate: "2024-05-06", endDate: "2024-08-16", isActive: true },
    { id: "3", name: "Term 3", startDate: "2024-09-02", endDate: "2024-11-29", isActive: false },
  ]);

  const [examSettings, setExamSettings] = useState({
    autoCalculateGrades: true,
    allowGradeOverride: false,
    requireRemarks: true,
    enablePositionRanking: true,
    showClassAverage: true,
    enableParentNotifications: true,
    defaultMaxScore: 100,
    passMarkPercentage: 40,
  });

  const handleSaveGradingScale = () => {
    // In a real app, this would save to the backend
    toast.success("Grading scale updated successfully!");
  };

  const handleSaveTerms = () => {
    // In a real app, this would save to the backend
    toast.success("Academic terms updated successfully!");
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast.success("Examination settings updated successfully!");
  };

  const addNewGrade = () => {
    const newGrade: GradingScale = {
      id: Date.now().toString(),
      grade: "",
      minPercentage: 0,
      maxPercentage: 0,
      description: "",
      points: 0,
    };
    setGradingScale([...gradingScale, newGrade]);
  };

  const updateGrade = (id: string, field: keyof GradingScale, value: string | number) => {
    setGradingScale(gradingScale.map(grade => 
      grade.id === id ? { ...grade, [field]: value } : grade
    ));
  };

  const deleteGrade = (id: string) => {
    setGradingScale(gradingScale.filter(grade => grade.id !== id));
  };

  const addNewTerm = () => {
    const newTerm: AcademicTerm = {
      id: Date.now().toString(),
      name: "",
      startDate: "",
      endDate: "",
      isActive: false,
    };
    setAcademicTerms([...academicTerms, newTerm]);
  };

  const updateTerm = (id: string, field: keyof AcademicTerm, value: string | boolean) => {
    setAcademicTerms(academicTerms.map(term => 
      term.id === id ? { ...term, [field]: value } : term
    ));
  };

  const deleteTerm = (id: string) => {
    setAcademicTerms(academicTerms.filter(term => term.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Examination Settings</h2>
      </div>

      <Tabs defaultValue="grading" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grading">Grading Scale</TabsTrigger>
          <TabsTrigger value="terms">Academic Terms</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        {/* Grading Scale Tab */}
        <TabsContent value="grading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Grading Scale Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Configure the grading scale used for student assessments.
                  </p>
                  <Button onClick={addNewGrade} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Grade
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade</TableHead>
                        <TableHead>Min %</TableHead>
                        <TableHead>Max %</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gradingScale.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>
                            <Input
                              value={grade.grade}
                              onChange={(e) => updateGrade(grade.id, "grade", e.target.value)}
                              className="w-16"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={grade.minPercentage}
                              onChange={(e) => updateGrade(grade.id, "minPercentage", parseInt(e.target.value))}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={grade.maxPercentage}
                              onChange={(e) => updateGrade(grade.id, "maxPercentage", parseInt(e.target.value))}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={grade.description}
                              onChange={(e) => updateGrade(grade.id, "description", e.target.value)}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={grade.points}
                              onChange={(e) => updateGrade(grade.id, "points", parseInt(e.target.value))}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteGrade(grade.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Button onClick={handleSaveGradingScale}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Grading Scale
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Terms Tab */}
        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Academic Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Manage academic terms and their schedules.
                  </p>
                  <Button onClick={addNewTerm} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Term
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Term Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {academicTerms.map((term) => (
                        <TableRow key={term.id}>
                          <TableCell>
                            <Input
                              value={term.name}
                              onChange={(e) => updateTerm(term.id, "name", e.target.value)}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={term.startDate}
                              onChange={(e) => updateTerm(term.id, "startDate", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={term.endDate}
                              onChange={(e) => updateTerm(term.id, "endDate", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={term.isActive}
                              onCheckedChange={(checked) => updateTerm(term.id, "isActive", checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTerm(term.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Button onClick={handleSaveTerms}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Terms
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Examination Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="defaultMaxScore">Default Max Score</Label>
                    <Input
                      id="defaultMaxScore"
                      type="number"
                      value={examSettings.defaultMaxScore}
                      onChange={(e) => setExamSettings({
                        ...examSettings,
                        defaultMaxScore: parseInt(e.target.value)
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passMarkPercentage">Pass Mark Percentage</Label>
                    <Input
                      id="passMarkPercentage"
                      type="number"
                      value={examSettings.passMarkPercentage}
                      onChange={(e) => setExamSettings({
                        ...examSettings,
                        passMarkPercentage: parseInt(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Calculate Grades</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically calculate letter grades based on percentage scores
                      </p>
                    </div>
                    <Switch
                      checked={examSettings.autoCalculateGrades}
                      onCheckedChange={(checked) => setExamSettings({
                        ...examSettings,
                        autoCalculateGrades: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Grade Override</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow teachers to manually override calculated grades
                      </p>
                    </div>
                    <Switch
                      checked={examSettings.allowGradeOverride}
                      onCheckedChange={(checked) => setExamSettings({
                        ...examSettings,
                        allowGradeOverride: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Remarks</Label>
                      <p className="text-sm text-muted-foreground">
                        Make teacher remarks mandatory for all assessments
                      </p>
                    </div>
                    <Switch
                      checked={examSettings.requireRemarks}
                      onCheckedChange={(checked) => setExamSettings({
                        ...examSettings,
                        requireRemarks: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Position Ranking</Label>
                      <p className="text-sm text-muted-foreground">
                        Calculate and display student positions in class
                      </p>
                    </div>
                    <Switch
                      checked={examSettings.enablePositionRanking}
                      onCheckedChange={(checked) => setExamSettings({
                        ...examSettings,
                        enablePositionRanking: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Class Average</Label>
                      <p className="text-sm text-muted-foreground">
                        Display class averages on report cards
                      </p>
                    </div>
                    <Switch
                      checked={examSettings.showClassAverage}
                      onCheckedChange={(checked) => setExamSettings({
                        ...examSettings,
                        showClassAverage: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Parent Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automatic notifications to parents when results are published
                      </p>
                    </div>
                    <Switch
                      checked={examSettings.enableParentNotifications}
                      onCheckedChange={(checked) => setExamSettings({
                        ...examSettings,
                        enableParentNotifications: checked
                      })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 