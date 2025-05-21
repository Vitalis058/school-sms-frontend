import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DepartmentType } from "@/types/types";
import { format } from "date-fns";
import {
  BookOpen,
  Calendar,
  CalendarClock,
  MousePointerClick,
  User,
  Users,
} from "lucide-react";

interface DepartmentProps {
  department: DepartmentType | undefined;
}

function DepartmentDetails({ department }: DepartmentProps) {
  if (!department) {
    return (
      <div className="mt-14 flex flex-col items-center">
        <p>Please click on department to view </p>
        <MousePointerClick size={30} className="text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-lg p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Departments</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{department?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="w-full">
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Staff No</p>
                <Users size={15} className="text-muted-foreground" />
              </div>
              <p className="text-lg font-bold md:text-xl">
                {department?._count.teachers}
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Subjects No</p>
                <BookOpen size={15} className="text-muted-foreground" />
              </div>
              <p className="text-lg font-bold md:text-xl">
                {department?._count.subjects}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto flex flex-col gap-4 md:flex-row">
          <Card className="flex-1 rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>
                <h2 className="font-semibold">Department Details</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar size={17} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Created on</span>
                </span>

                {department && (
                  <p>
                    {format(new Date(department?.createdAt), "MMMM d, yyyy")}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-1">
                  <User size={17} className="text-muted-foreground" />
                  <span className="text-muted-foreground">HOD</span>
                </span>

                <p>Mr mwangi</p>
              </div>

              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="flex items-center gap-1">
                  <CalendarClock size={17} className="text-muted-foreground" />
                  <span className="text-muted-foreground">HOD since</span>
                </span>

                <p>10th january 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DepartmentDetails;
