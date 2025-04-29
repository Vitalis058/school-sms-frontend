import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileDigit } from "lucide-react";
import { Switch } from "@/components/ui/switch";

function SubjectDetails() {
  return (
    <div className="flex-1 rounded-lg p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Subjects</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>subject name</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="w-full">
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Subject code</p>
                <FileDigit />
              </div>
              <p className="text-lg font-bold md:text-xl">HIST102</p>
              <p className="text-muted-foreground text-xs font-semibold">
                History
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Department</p>
                <Building2 />
              </div>
              <p className="text-lg font-bold md:text-xl">Humanities</p>
              <p className="text-muted-foreground text-xs font-semibold">
                Hist102
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto flex flex-col gap-4 md:flex-row">
          <Card className="flex-1 rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>
                <h2 className="font-semibold">Subject Properties</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active</span>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Optional</span>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Field Trip</span>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Lab Required</span>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetails;
