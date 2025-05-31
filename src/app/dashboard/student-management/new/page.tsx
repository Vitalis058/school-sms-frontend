"use client";
export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentForm } from "@/features/students/components/StudentForm";
import { useGetGradesQuery, useGetStreamsQuery } from "@/store/api/academicsApi";
import { useGetParentsQuery } from "@/store/api/parentApi";
import { usePermissions } from "@/contexts/AuthContext";
import { SidebarInset } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

function NewStudent() {
  const { isLoading: gradesLoading } = useGetGradesQuery();
  const { isLoading: parentsLoading } = useGetParentsQuery({});
  const { isLoading: streamsLoading } = useGetStreamsQuery();
  const { canCreate } = usePermissions();
  const router = useRouter();

  const isLoading = gradesLoading || parentsLoading || streamsLoading;

  // Check permissions
  if (!canCreate("students")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to create new students.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading...</div>
            <div className="text-sm text-muted-foreground">Please wait while we load the form data</div>
          </div>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push("/dashboard/student-management");
  };

  return (
    <SidebarInset>
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">New Student</h2>
          <p className="text-muted-foreground">
            Enroll a new student in the school management system.
          </p>
        </div>
        
        <StudentForm onSuccess={handleSuccess} />
      </div>
    </SidebarInset>
  );
}

export default NewStudent;
