"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, BookOpen } from "lucide-react";

interface LibrarySettingsProps {
  settings: any;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}

export default function LibrarySettings({ settings, onUpdate, isLoading }: LibrarySettingsProps) {
  const [formData, setFormData] = useState({
    maxBooksPerStudent: 3,
    maxBooksPerTeacher: 5,
    loanDurationStudent: 14,
    loanDurationTeacher: 30,
    finePerDayStudent: 1.0,
    finePerDayTeacher: 2.0,
    autoRenewal: false,
    emailReminders: true,
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
            <BookOpen className="h-5 w-5" />
            Library Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxBooksPerStudent">Max Books Per Student</Label>
              <Input
                id="maxBooksPerStudent"
                type="number"
                value={formData.maxBooksPerStudent}
                onChange={(e) => handleInputChange("maxBooksPerStudent", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxBooksPerTeacher">Max Books Per Teacher</Label>
              <Input
                id="maxBooksPerTeacher"
                type="number"
                value={formData.maxBooksPerTeacher}
                onChange={(e) => handleInputChange("maxBooksPerTeacher", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Reminders</Label>
              <p className="text-xs text-muted-foreground">
                Send email reminders for due dates
              </p>
            </div>
            <Switch
              checked={formData.emailReminders}
              onCheckedChange={(checked) => handleInputChange("emailReminders", checked)}
            />
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
              Save Library Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 