import { Button } from "@/components/ui/button";
import { Plus, School } from "lucide-react";
import { useActionState, useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StreamCard } from "@/features/stream/components/StreamCard";
import { TeacherType } from "@/types/types";
import Link from "next/link";
import LoadingButton from "../../../components/LoadingButton";
import { createStreamAction } from "../actions/stream_actions";

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

  teachers: TeacherType[];
};

function StreamsCard({ selectedClass, streams, teachers }: StreamsCardTypes) {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const initialState = {
    message: undefined,
    errors: {},
  };

  const [streamState, streamFormAction, streamIsPending] = useActionState(
    createStreamAction,
    initialState,
  );

  return (
    <div className="flex-1 rounded-lg p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Breadcrumb className="hidden sm:block">
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
              <p className="hidden sm:block">Add Stream</p>
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
              <p className="text-sm text-green-500">{streamState.message}</p>
            )}

            {streamState.errors?.error && (
              <p className="text-sm text-red-500">
                {streamState.errors.error[0]}
              </p>
            )}
            <form action={streamFormAction}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  {streamState.errors?.name && (
                    <p className="text-sm text-red-500">
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
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 text-slate-400">
            <School className="mx-auto mb-2 h-12 w-12" />
            <p className="text-lg font-medium">No streams available</p>
          </div>
          <p className="mb-4 max-w-md text-slate-500">
            This class doesn&apos;t have any streams yet. Create your first
            stream to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {streams.map((item) => (
            <StreamCard
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
