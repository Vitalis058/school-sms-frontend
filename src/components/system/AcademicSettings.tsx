"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, GraduationCap, Clock, Calendar } from "lucide-react";

interface AcademicSettingsProps {
  settings: any;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}

export default function AcademicSettings({ settings, onUpdate, isLoading }: AcademicSettingsProps) {
  const [formData, setFormData] = useState({
    gradingSystem: "A-F",
    passingGrade: "D",
    maxAbsences: 10,
    termDuration: 90,
    classStartTime: "08:00",
    classEndTime: "15:30",
    breakDuration: 15,
    lunchDuration: 45,
    periodsPerDay: 8,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    holidays: [],
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gradingSystem">Grading System</Label>
              <Select
                value={formData.gradingSystem}
                onValueChange={(value) => handleInputChange("gradingSystem", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grading system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A-F">A-F Letter Grades</SelectItem>
                  <SelectItem value="1-10">1-10 Numeric Scale</SelectItem>
                  <SelectItem value="percentage">Percentage (0-100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passingGrade">Passing Grade</Label>
              <Input
                id="passingGrade"
                value={formData.passingGrade}
                onChange={(e) => handleInputChange("passingGrade", e.target.value)}
                placeholder="Enter passing grade"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxAbsences">Max Absences</Label>
              <Input
                id="maxAbsences"
                type="number"
                value={formData.maxAbsences}
                onChange={(e) => handleInputChange("maxAbsences", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="termDuration">Term Duration (days)</Label>
              <Input
                id="termDuration"
                type="number"
                value={formData.termDuration}
                onChange={(e) => handleInputChange("termDuration", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="periodsPerDay">Periods Per Day</Label>
              <Input
                id="periodsPerDay"
                type="number"
                value={formData.periodsPerDay}
                onChange={(e) => handleInputChange("periodsPerDay", parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Academic Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 