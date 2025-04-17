export const dynamic = "force-dynamic";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSingleStudentForm from "@/components/Forms/dashboard/students/AddSingleStudentForm";
import AddBulkStudentForm from "@/components/Forms/dashboard/students/AddBulkStudentForm";
import { getGradesData } from "@/api_requests/grades_requests";
import { GradesType, ParentType, StreamsType } from "@/types/types";
import { getAllStreams } from "@/api_requests/streams_requests";
import { getParents } from "@/api_requests/parent_requests";

async function NewStudent() {
  const data: GradesType[] = await getGradesData();
  const streams: StreamsType[] = await getAllStreams();
  const parentsData: ParentType[] = await getParents();

  const parents = parentsData.map((item: ParentType) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const grade = data.map((item: GradesType) => {
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
                parents={parents}
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
