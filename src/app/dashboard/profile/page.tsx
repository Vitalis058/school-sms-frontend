"use client";

import React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield, GraduationCap, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { ChangePasswordForm } from "@/components/Forms/auth/ChangePassword";
import LoadingComponent from "@/components/LoadingComponent";

const roleIcons = {
  ADMIN: Shield,
  TEACHER: GraduationCap,
  STAFF: Briefcase,
  STUDENT: User,
};

const roleColors = {
  ADMIN: "bg-red-100 text-red-800 border-red-200",
  TEACHER: "bg-blue-100 text-blue-800 border-blue-200",
  STAFF: "bg-green-100 text-green-800 border-green-200",
  STUDENT: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingComponent message="Loading profile..." />;
  }

  if (!user) {
    return null;
  }

  const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User;

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-medium">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RoleIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt ? format(new Date(user.createdAt), "MMMM dd, yyyy") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <div>
            <ChangePasswordForm />
          </div>
        </div>

        {/* Security Notice */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Security Recommendation</h3>
                <p className="text-sm text-blue-800 mt-1">
                  If you're using a default password provided by your administrator, 
                  please change it immediately for security purposes. Use a strong, 
                  unique password that you haven't used elsewhere.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
} 