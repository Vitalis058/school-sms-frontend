"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings,
  Bell,
  Clock,
  Users,
  Save,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface AttendanceSettings {
  general: {
    schoolStartTime: string;
    schoolEndTime: string;
    lateThresholdMinutes: number;
    absenteeThresholdDays: number;
    attendanceRateThreshold: number;
    autoMarkAbsent: boolean;
    allowLateEntry: boolean;
    requireRemarks: boolean;
  };
  notifications: {
    enableParentNotifications: boolean;
    enableTeacherNotifications: boolean;
    enableAdminNotifications: boolean;
    notifyOnAbsence: boolean;
    notifyOnLate: boolean;
    notifyOnPattern: boolean;
    dailyReportTime: string;
    weeklyReportDay: string;
  };
  grading: {
    attendanceAffectsGrades: boolean;
    attendanceWeightage: number;
    minimumAttendanceForExams: number;
    attendanceBonusPoints: number;
  };
  automation: {
    autoGenerateReports: boolean;
    reportFrequency: string;
    autoSendNotifications: boolean;
    integrateBiometric: boolean;
    enableQRCodeAttendance: boolean;
  };
}

export function AttendanceSettings() {
  const [settings, setSettings] = useState<AttendanceSettings>({
    general: {
      schoolStartTime: "08:00",
      schoolEndTime: "15:30",
      lateThresholdMinutes: 15,
      absenteeThresholdDays: 3,
      attendanceRateThreshold: 75,
      autoMarkAbsent: true,
      allowLateEntry: true,
      requireRemarks: false,
    },
    notifications: {
      enableParentNotifications: true,
      enableTeacherNotifications: true,
      enableAdminNotifications: true,
      notifyOnAbsence: true,
      notifyOnLate: false,
      notifyOnPattern: true,
      dailyReportTime: "16:00",
      weeklyReportDay: "friday",
    },
    grading: {
      attendanceAffectsGrades: false,
      attendanceWeightage: 10,
      minimumAttendanceForExams: 75,
      attendanceBonusPoints: 5,
    },
    automation: {
      autoGenerateReports: true,
      reportFrequency: "weekly",
      autoSendNotifications: true,
      integrateBiometric: false,
      enableQRCodeAttendance: false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateGeneralSetting = (key: keyof AttendanceSettings['general'], value: any) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value,
      },
    }));
  };

  const updateNotificationSetting = (key: keyof AttendanceSettings['notifications'], value: any) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updateGradingSetting = (key: keyof AttendanceSettings['grading'], value: any) => {
    setSettings(prev => ({
      ...prev,
      grading: {
        ...prev.grading,
        [key]: value,
      },
    }));
  };

  const updateAutomationSetting = (key: keyof AttendanceSettings['automation'], value: any) => {
    setSettings(prev => ({
      ...prev,
      automation: {
        ...prev.automation,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Attendance Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure attendance tracking rules, notifications, and automation settings.
          </p>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schoolStartTime">School Start Time</Label>
              <Input
                id="schoolStartTime"
                type="time"
                value={settings.general.schoolStartTime}
                onChange={(e) => updateGeneralSetting('schoolStartTime', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schoolEndTime">School End Time</Label>
              <Input
                id="schoolEndTime"
                type="time"
                value={settings.general.schoolEndTime}
                onChange={(e) => updateGeneralSetting('schoolEndTime', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="lateThreshold">Late Threshold (minutes)</Label>
              <Input
                id="lateThreshold"
                type="number"
                value={settings.general.lateThresholdMinutes}
                onChange={(e) => updateGeneralSetting('lateThresholdMinutes', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="absenteeThreshold">Chronic Absence Threshold (days)</Label>
              <Input
                id="absenteeThreshold"
                type="number"
                value={settings.general.absenteeThresholdDays}
                onChange={(e) => updateGeneralSetting('absenteeThresholdDays', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attendanceRate">Minimum Attendance Rate (%)</Label>
              <Input
                id="attendanceRate"
                type="number"
                value={settings.general.attendanceRateThreshold}
                onChange={(e) => updateGeneralSetting('attendanceRateThreshold', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-mark Absent</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically mark students as absent if not marked by end of day
                </p>
              </div>
              <Switch
                checked={settings.general.autoMarkAbsent}
                onCheckedChange={(checked) => updateGeneralSetting('autoMarkAbsent', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Late Entry</Label>
                <p className="text-sm text-muted-foreground">
                  Allow students to be marked present even after late threshold
                </p>
              </div>
              <Switch
                checked={settings.general.allowLateEntry}
                onCheckedChange={(checked) => updateGeneralSetting('allowLateEntry', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Remarks</Label>
                <p className="text-sm text-muted-foreground">
                  Require teachers to add remarks for absent or late students
                </p>
              </div>
              <Switch
                checked={settings.general.requireRemarks}
                onCheckedChange={(checked) => updateGeneralSetting('requireRemarks', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Parent Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send attendance notifications to parents
                </p>
              </div>
              <Switch
                checked={settings.notifications.enableParentNotifications}
                onCheckedChange={(checked) => updateNotificationSetting('enableParentNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Teacher Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send attendance alerts to teachers
                </p>
              </div>
              <Switch
                checked={settings.notifications.enableTeacherNotifications}
                onCheckedChange={(checked) => updateNotificationSetting('enableTeacherNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Admin Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send attendance reports to administrators
                </p>
              </div>
              <Switch
                checked={settings.notifications.enableAdminNotifications}
                onCheckedChange={(checked) => updateNotificationSetting('enableAdminNotifications', checked)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between">
              <Label>Notify on Absence</Label>
              <Switch
                checked={settings.notifications.notifyOnAbsence}
                onCheckedChange={(checked) => updateNotificationSetting('notifyOnAbsence', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Notify on Late</Label>
              <Switch
                checked={settings.notifications.notifyOnLate}
                onCheckedChange={(checked) => updateNotificationSetting('notifyOnLate', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Notify on Patterns</Label>
              <Switch
                checked={settings.notifications.notifyOnPattern}
                onCheckedChange={(checked) => updateNotificationSetting('notifyOnPattern', checked)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dailyReportTime">Daily Report Time</Label>
              <Input
                id="dailyReportTime"
                type="time"
                value={settings.notifications.dailyReportTime}
                onChange={(e) => updateNotificationSetting('dailyReportTime', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weeklyReportDay">Weekly Report Day</Label>
              <Select
                value={settings.notifications.weeklyReportDay}
                onValueChange={(value) => updateNotificationSetting('weeklyReportDay', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grading Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Grading Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Attendance Affects Grades</Label>
              <p className="text-sm text-muted-foreground">
                Include attendance in overall grade calculation
              </p>
            </div>
            <Switch
              checked={settings.grading.attendanceAffectsGrades}
              onCheckedChange={(checked) => updateGradingSetting('attendanceAffectsGrades', checked)}
            />
          </div>

          {settings.grading.attendanceAffectsGrades && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="attendanceWeightage">Attendance Weightage (%)</Label>
                <Input
                  id="attendanceWeightage"
                  type="number"
                  value={settings.grading.attendanceWeightage}
                  onChange={(e) => updateGradingSetting('attendanceWeightage', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumAttendance">Minimum Attendance for Exams (%)</Label>
                <Input
                  id="minimumAttendance"
                  type="number"
                  value={settings.grading.minimumAttendanceForExams}
                  onChange={(e) => updateGradingSetting('minimumAttendanceForExams', parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonusPoints">Perfect Attendance Bonus Points</Label>
                <Input
                  id="bonusPoints"
                  type="number"
                  value={settings.grading.attendanceBonusPoints}
                  onChange={(e) => updateGradingSetting('attendanceBonusPoints', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Automation & Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-generate Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate attendance reports
                </p>
              </div>
              <Switch
                checked={settings.automation.autoGenerateReports}
                onCheckedChange={(checked) => updateAutomationSetting('autoGenerateReports', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-send Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send scheduled notifications
                </p>
              </div>
              <Switch
                checked={settings.automation.autoSendNotifications}
                onCheckedChange={(checked) => updateAutomationSetting('autoSendNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Biometric Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Integrate with biometric attendance systems
                </p>
              </div>
              <Switch
                checked={settings.automation.integrateBiometric}
                onCheckedChange={(checked) => updateAutomationSetting('integrateBiometric', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>QR Code Attendance</Label>
                <p className="text-sm text-muted-foreground">
                  Enable QR code-based attendance marking
                </p>
              </div>
              <Switch
                checked={settings.automation.enableQRCodeAttendance}
                onCheckedChange={(checked) => updateAutomationSetting('enableQRCodeAttendance', checked)}
              />
            </div>
          </div>

          {settings.automation.autoGenerateReports && (
            <div className="space-y-2">
              <Label htmlFor="reportFrequency">Report Generation Frequency</Label>
              <Select
                value={settings.automation.reportFrequency}
                onValueChange={(value) => updateAutomationSetting('reportFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="termly">Termly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Changes will be applied immediately after saving.
            </div>
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 