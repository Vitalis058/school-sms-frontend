import React, { useActionState, useState } from "react";
import { Plus, School } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ClassCard } from "@/components/streams/ClassCard";
import { createStreamAction } from "@/actions/stream_actions";
import LoadingButton from "../LoadingButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type StreamsCardTypes = {
  selectedClass: {
    id: string;
    name: string;
  };

  streams: {
    id: string;
    name: string;
    slug: string;
    classTeacher: string;
    students: number;
  }[];

  teachers: {
    id: string;
    firstName: string;
  }[];
};

function StreamsCard({ selectedClass, streams, teachers }: StreamsCardTypes) {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const initialState = {
    message: undefined,
    errors: {},
  };

  const [streamState, streamFormAction, streamIsPending] = useActionState(
    createStreamAction,
    initialState
  );

  return (
    <div className="flex-1 rounded-lg p-2 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Grades</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>classes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>streams</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Add Stream Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Stream
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Stream</DialogTitle>
              <DialogDescription>
                Add a new stream to class {selectedClass?.name}.
              </DialogDescription>
            </DialogHeader>
            {streamState.message && (
              <p className="text-green-500 text-sm">{streamState.message}</p>
            )}

            {streamState.errors?.error && (
              <p className="text-red-500 text-sm">
                {streamState.errors.error[0]}
              </p>
            )}
            <form action={streamFormAction}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  {streamState.errors?.name && (
                    <p className="text-red-500 text-sm">
                      {streamState.errors.name[0]}
                    </p>
                  )}
                  <Label htmlFor="name" className="text-right">
                    Stream name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. 5a"
                    className="col-span-3"
                    name="name"
                  />
                </div>

                <div className="hidden">
                  <Label htmlFor="gradeId" className="text-right">
                    Grade
                  </Label>
                  <Input
                    id="gradeId"
                    placeholder="Teacher name"
                    className="col-span-3"
                    name="gradeId"
                    value={selectedClass?.id}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherId" className="text-right">
                    Teacher
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) => setSelectedTeacher(value)}
                      value={selectedTeacher}
                      name="teacherId"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.firstName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size={"icon"} asChild>
                      <Link href={"/dashboard/users/teachers/new"}>
                        <Plus />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              <LoadingButton loading={streamIsPending}>
                Create stream
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-2" />

      {streams.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-slate-400 mb-4">
            <School className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">No streams available</p>
          </div>
          <p className="text-slate-500 max-w-md mb-4">
            This class doesn&apos;t have any streams yet. Create your first
            stream to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {streams.map((item) => (
            <ClassCard
              name={item.name}
              teacher={item.classTeacher}
              studentCount={item.students}
              onEdit={() => console.log("Edit class")}
              onDelete={() => console.log("Delete class")}
              key={item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StreamsCard;
