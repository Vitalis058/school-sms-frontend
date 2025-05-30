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
import AddBulkStudentForm from "@/features/student/forms/AddBulkStudentForm";
import AddSingleStudentForm from "@/features/student/forms/AddSingleStudentForm";
import { useAppSelector } from "@/redux/hooks";
import { GradesType, ParentType } from "@/types/types";

function NewStudent() {
  const { grades } = useAppSelector((state) => state.grades);
  const { parents } = useAppSelector((state) => state.parents);
  const { streams } = useAppSelector((state) => state.streams);

  const parentsData = parents?.map((item: ParentType) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const grade = grades?.map((item: GradesType) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return (
    <div>
      <Tabs defaultValue="single-registration" className="w-full p-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single-registration">
            Single Student registration
          </TabsTrigger>
          <TabsTrigger value="bulk-registration">
            Bulk student registration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single-registration">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Single Student Registration
              </CardTitle>
              <CardDescription>
                Enroll a new student here. Click save when you&apos;re done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AddSingleStudentForm
                grades={grade}
                streams={streams}
                parents={parentsData}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulk-registration">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Student Registration</CardTitle>
              <CardDescription>Will be implemented soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AddBulkStudentForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default NewStudent;
