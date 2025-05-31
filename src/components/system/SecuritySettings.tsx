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
import { Save, Shield, Lock, Eye, AlertTriangle } from "lucide-react";

interface SecuritySettingsProps {
  settings: any;
  onUpdate: (data: any) => void;
  isLoading: boolean;
}

export default function SecuritySettings({ settings, onUpdate, isLoading }: SecuritySettingsProps) {
  const [formData, setFormData] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false,
    ipWhitelisting: false,
    auditLogging: true,
    dataRetentionDays: 2555,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Password Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                min="6"
                max="32"
                value={formData.passwordMinLength}
                onChange={(e) => handleInputChange("passwordMinLength", parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Minimum number of characters required for passwords
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Uppercase Letters</Label>
                <p className="text-xs text-muted-foreground">
                  Passwords must contain at least one uppercase letter (A-Z)
                </p>
              </div>
              <Switch
                checked={formData.passwordRequireUppercase}
                onCheckedChange={(checked) => handleInputChange("passwordRequireUppercase", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Lowercase Letters</Label>
                <p className="text-xs text-muted-foreground">
                  Passwords must contain at least one lowercase letter (a-z)
                </p>
              </div>
              <Switch
                checked={formData.passwordRequireLowercase}
                onCheckedChange={(checked) => handleInputChange("passwordRequireLowercase", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Numbers</Label>
                <p className="text-xs text-muted-foreground">
                  Passwords must contain at least one number (0-9)
                </p>
              </div>
              <Switch
                checked={formData.passwordRequireNumbers}
                onCheckedChange={(checked) => handleInputChange("passwordRequireNumbers", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Special Characters</Label>
                <p className="text-xs text-muted-foreground">
                  Passwords must contain at least one special character (!@#$%^&*)
                </p>
              </div>
              <Switch
                checked={formData.passwordRequireSpecialChars}
                onCheckedChange={(checked) => handleInputChange("passwordRequireSpecialChars", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Session Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="480"
                value={formData.sessionTimeout}
                onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Automatically log out users after this period of inactivity
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                value={formData.maxLoginAttempts}
                onChange={(e) => handleInputChange("maxLoginAttempts", parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Number of failed attempts before account lockout
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                min="5"
                max="1440"
                value={formData.lockoutDuration}
                onChange={(e) => handleInputChange("lockoutDuration", parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                How long to lock accounts after max failed attempts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">
                  Require additional verification for user logins
                </p>
              </div>
              <Switch
                checked={formData.twoFactorEnabled}
                onCheckedChange={(checked) => handleInputChange("twoFactorEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>IP Whitelisting</Label>
                <p className="text-xs text-muted-foreground">
                  Restrict access to specific IP addresses
                </p>
              </div>
              <Switch
                checked={formData.ipWhitelisting}
                onCheckedChange={(checked) => handleInputChange("ipWhitelisting", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Audit Logging</Label>
                <p className="text-xs text-muted-foreground">
                  Log all user actions and system events for security monitoring
                </p>
              </div>
              <Switch
                checked={formData.auditLogging}
                onCheckedChange={(checked) => handleInputChange("auditLogging", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Data Retention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataRetentionDays">Data Retention Period (days)</Label>
            <Input
              id="dataRetentionDays"
              type="number"
              min="365"
              max="3650"
              value={formData.dataRetentionDays}
              onChange={(e) => handleInputChange("dataRetentionDays", parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              How long to keep user data and logs before automatic deletion (minimum 1 year)
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Changes to security settings will affect all users. Some changes may require users to log in again.
                  Ensure you communicate any security policy changes to your users.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
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
              Save Security Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 