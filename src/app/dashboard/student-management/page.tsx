"use client";

import React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { usePermissions } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, GraduationCap, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function StudentsPage() {
  const { canRead, canCreate } = usePermissions();

  // Check permissions
  if (!canRead("students")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view student data.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">
            Manage student enrollment, information, and academic records.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View & Manage</div>
              <p className="text-xs text-muted-foreground">
                Browse all student records
              </p>
              <Link href="/dashboard/student-management/(student-data-table)">
                <Button className="w-full mt-2" variant="outline">
                  View Students
                </Button>
              </Link>
            </CardContent>
          </Card>

          {canCreate("students") && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Student</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Enroll</div>
                <p className="text-xs text-muted-foreground">
                  Add new student
                </p>
                <Link href="/dashboard/student-management/new">
                  <Button className="w-full mt-2">
                    Add Student
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Streams</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Organize</div>
              <p className="text-xs text-muted-foreground">
                Manage class streams
              </p>
              <Link href="/dashboard/student-management/class-streams">
                <Button className="w-full mt-2" variant="outline">
                  View Streams
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Analytics</div>
              <p className="text-xs text-muted-foreground">
                View performance data
              </p>
              <Link href="/dashboard/student-management/performance">
                <Button className="w-full mt-2" variant="outline">
                  View Performance
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Management Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/student-management/(student-data-table)">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    All Students
                  </Button>
                </Link>
                <Link href="/dashboard/student-management/attendance">
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Attendance
                  </Button>
                </Link>
                <Link href="/dashboard/student-management/performance">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Performance
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Link href="/dashboard/student-management/fees">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Fee Management
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Scholarships (Coming Soon)
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Financial Reports (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
} 