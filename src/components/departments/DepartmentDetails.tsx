import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookOpen, Calendar, CalendarClock, User, Users } from "lucide-react";

function DepartmentDetails() {
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
              <BreadcrumbPage>Department name</BreadcrumbPage>
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
              <p className="text-lg font-bold md:text-xl">102</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Subjects No</p>
                <BookOpen size={15} className="text-muted-foreground" />
              </div>
              <p className="text-lg font-bold md:text-xl">23</p>
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

                <p>November 24th 2024</p>
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
