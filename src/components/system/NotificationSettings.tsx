"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Bell } from "lucide-react";

interface NotificationSettingsProps {
  settings: any;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}

export default function NotificationSettings({ settings, onUpdate, isLoading }: NotificationSettingsProps) {
  const [formData, setFormData] = useState({
    emailNotifications: {
      newEnrollment: true,
      gradeUpdates: true,
      attendanceAlerts: true,
    },
    smsNotifications: {
      emergencyAlerts: true,
      attendanceAlerts: true,
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value,
      },
    }));
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
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Grade Updates</Label>
              <p className="text-xs text-muted-foreground">
                Notify when grades are updated
              </p>
            </div>
            <Switch
              checked={formData.emailNotifications.gradeUpdates}
              onCheckedChange={(checked) => handleInputChange("emailNotifications", "gradeUpdates", checked)}
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
              Save Notification Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 