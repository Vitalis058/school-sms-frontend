"use client";

import React, { useState } from "react";
import {
  Settings,
  School,
  GraduationCap,
  BookOpen,
  Car,
  MessageSquare,
  Shield,
  Bell,
  Database,
  Wrench,
  Download,
  Upload,
  RotateCcw,
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePermissions } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useResetSettingsCategoryMutation,
  useLazyExportSettingsQuery,
  useImportSettingsMutation,
} from "@/store/api/systemApi";

// Import setting components
import GeneralSettings from "@/components/system/GeneralSettings";
import AcademicSettings from "@/components/system/AcademicSettings";
import LibrarySettings from "@/components/system/LibrarySettings";
import TransportSettings from "@/components/system/TransportSettings";
import CommunicationSettings from "@/components/system/CommunicationSettings";
import SecuritySettings from "@/components/system/SecuritySettings";
import NotificationSettings from "@/components/system/NotificationSettings";
import BackupSettings from "@/components/system/BackupSettings";
import MaintenanceSettings from "@/components/system/MaintenanceSettings";

export default function SystemSettingsPage() {
  const { isAdmin } = usePermissions();
  const [activeTab, setActiveTab] = useState("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // API hooks
  const { data: settingsResponse, isLoading, error } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();
  const [resetCategory, { isLoading: isResetting }] = useResetSettingsCategoryMutation();
  const [exportSettings] = useLazyExportSettingsQuery();
  const [importSettings, { isLoading: isImporting }] = useImportSettingsMutation();

  const settings = settingsResponse?.data;

  // Handle settings update
  const handleUpdateSettings = async (category: string, data: any) => {
    try {
      await updateSettings({ category, data }).unwrap();
      toast.success("Settings updated successfully");
      setHasUnsavedChanges(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  // Handle reset category
  const handleResetCategory = async (category: string) => {
    try {
      await resetCategory(category).unwrap();
      toast.success("Settings reset to default values");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset settings");
    }
  };

  // Handle export settings
  const handleExportSettings = async () => {
    try {
      const result = await exportSettings().unwrap();
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system-settings-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Settings exported successfully");
    } catch (error: any) {
      toast.error("Failed to export settings");
    }
  };

  // Handle import settings
  const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      await importSettings({ settings: importData.settings }).unwrap();
      toast.success("Settings imported successfully");
    } catch (error: any) {
      toast.error("Failed to import settings");
    }
  };

  if (!isAdmin()) {
    return (
      <SidebarInset>
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Access Restricted</h3>
            <p className="text-muted-foreground">
              Only administrators can access system settings.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading system settings...</p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (error) {
    return (
      <SidebarInset>
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Error Loading Settings</h3>
            <p className="text-muted-foreground">
              Failed to load system settings. Please try again.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  const settingsTabs = [
    {
      id: "general",
      label: "General",
      icon: School,
      description: "Basic school information and preferences",
    },
    {
      id: "academic",
      label: "Academic",
      icon: GraduationCap,
      description: "Academic year, grading, and schedule settings",
    },
    {
      id: "library",
      label: "Library",
      icon: BookOpen,
      description: "Library policies and book management",
    },
    {
      id: "transport",
      label: "Transport",
      icon: Car,
      description: "Vehicle and transportation settings",
    },
    {
      id: "communication",
      label: "Communication",
      icon: MessageSquare,
      description: "Email, SMS, and messaging configuration",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "Password policies and security settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Notification preferences and settings",
    },
    {
      id: "backup",
      label: "Backup",
      icon: Database,
      description: "Backup and data retention settings",
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Wrench,
      description: "System maintenance and update settings",
    },
  ];

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            <p className="text-muted-foreground">
              Configure and manage system-wide settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-settings")?.click()}
              disabled={isImporting}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="flex items-center gap-3 p-4">
              <Info className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  You have unsaved changes
                </p>
                <p className="text-sm text-yellow-700">
                  Don't forget to save your changes before leaving this page.
                </p>
              </div>
              <Button size="sm" onClick={() => setHasUnsavedChanges(false)}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Settings Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2 h-auto p-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center gap-2 p-3 h-auto"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Tab Content */}
              <div className="mt-6">
                <TabsContent value="general" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">General Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Basic school information and system preferences
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("general")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <GeneralSettings
                    settings={settings?.general}
                    onUpdate={(data) => handleUpdateSettings("general", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="academic" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Academic Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Academic year, grading system, and schedule configuration
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("academic")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <AcademicSettings
                    settings={settings?.academic}
                    onUpdate={(data) => handleUpdateSettings("academic", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="library" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Library Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Library policies, book limits, and fine configuration
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("library")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <LibrarySettings
                    settings={settings?.library}
                    onUpdate={(data) => handleUpdateSettings("library", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="transport" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Transport Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Vehicle capacity, booking policies, and driver settings
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("transport")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <TransportSettings
                    settings={settings?.transport}
                    onUpdate={(data) => handleUpdateSettings("transport", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="communication" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Communication Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Email, SMS, and messaging service configuration
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("communication")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <CommunicationSettings
                    settings={settings?.communication}
                    onUpdate={(data) => handleUpdateSettings("communication", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Security Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Password policies, session management, and security features
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("security")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <SecuritySettings
                    settings={settings?.security}
                    onUpdate={(data) => handleUpdateSettings("security", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Notification Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure email, SMS, and push notification preferences
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("notifications")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <NotificationSettings
                    settings={settings?.notifications}
                    onUpdate={(data) => handleUpdateSettings("notifications", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="backup" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Backup Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Automated backup configuration and data retention policies
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("backup")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <BackupSettings
                    settings={settings?.backup}
                    onUpdate={(data) => handleUpdateSettings("backup", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>

                <TabsContent value="maintenance" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Maintenance Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        System maintenance mode and update configuration
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCategory("maintenance")}
                      disabled={isResetting}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>
                  <MaintenanceSettings
                    settings={settings?.maintenance}
                    onUpdate={(data) => handleUpdateSettings("maintenance", data)}
                    isLoading={isUpdating}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
} 