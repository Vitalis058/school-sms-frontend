"use client";

import { GraduationCapIcon, Pen, Plus, Trash2Icon } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useActionState,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DepartmentType, SubjectType } from "@/types/types";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createSubjectAction } from "../actions/subject_actions";

const initialState: {
  message?: string;
  errors: Record<string, string[]>;
} = {
  message: undefined,
  errors: {
    error: [],
    name: [],
    shortname: [],
    subjectCode: [],
    department: [],
  },
};

type SubjectsCardTypes = {
  setSelectedSubject: Dispatch<SetStateAction<SubjectType | undefined>>;
  subjects?: SubjectType[];
  selectedSubject?: SubjectType;
  departments: DepartmentType[];
};

function SubjectsCard({
  setSelectedSubject, // to determine the subject to be displayed on the right
  subjects, // all the subjects
  selectedSubject, // to indicate the active selected subject
  departments,
}: SubjectsCardTypes) {
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >(undefined);

  //creating the subject
  const [subjectState, subjectFormAction, subjectIsPending] = useActionState(
    createSubjectAction,
    initialState,
  );

  return (
    <div className="w-full max-w-[300px] flex-1">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <GraduationCapIcon className="h-6 w-6 text-slate-700" />
          <p className="text-lg font-semibold">Subjects</p>
        </span>

        {/* Add Class Dialog */}
        <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add new subject</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>
                Enter the details for the new subject.
              </DialogDescription>
            </DialogHeader>
            {subjectState.message && (
              <p className="text-sm text-green-500">{subjectState.message}</p>
            )}
            {subjectState.errors?.error && (
              <p className="text-sm text-red-500">
                {subjectState.errors.error[0]}
              </p>
            )}
            <form action={subjectFormAction} className="space-y-4">
              {/* Name field */}
              <div className="md flex flex-col gap-4 md:flex-row">
                <div className="space-y-2">
                  {subjectState.errors?.name && (
                    <p className="text-sm text-red-500">
                      {subjectState.errors.name[0]}
                    </p>
                  )}
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="History" name="name" />
                </div>

                {/* Short Name field */}
                <div className="space-y-2">
                  {subjectState.errors?.shortname && (
                    <p className="text-sm text-red-500">
                      {subjectState.errors.shortname[0]}
                    </p>
                  )}
                  <Label htmlFor="shortname">Short Name</Label>
                  <Input id="shortname" placeholder="Hist" name="shortname" />
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                {/* Subject Code field */}
                <div className="space-y-2">
                  {subjectState.errors?.subjectCode && (
                    <p className="text-sm text-red-500">
                      {subjectState.errors.subjectCode[0]}
                    </p>
                  )}
                  <Label htmlFor="subjectCode">Subject Code</Label>
                  <Input
                    id="subjectCode"
                    placeholder="HIST101"
                    name="subjectCode"
                  />
                </div>

                {/* Department field */}

                <div className="space-y-2">
                  {subjectState.errors?.department && (
                    <p className="text-sm text-red-500">
                      {subjectState.errors.department[0]}
                    </p>
                  )}
                  <Label htmlFor="teacherId" className="text-right">
                    Department
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value: string) =>
                        setSelectedDepartment(value)
                      }
                      value={selectedDepartment}
                      name="department"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant={"outline"} size={"icon"} asChild>
                      <Link href={"/dashboard/users/departments"}>
                        <Plus />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Toggle switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="active" className="cursor-pointer">
                    Active
                  </Label>
                  <Switch id="active" name="active" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="optional" className="cursor-pointer">
                    Optional
                  </Label>
                  <Switch id="optional" name="optional" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="fieldtrips" className="cursor-pointer">
                    Fieldtrips
                  </Label>
                  <Switch id="fieldtrips" name="fieldtrips" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="labRequired" className="cursor-pointer">
                    Lab Required
                  </Label>
                  <Switch id="labRequired" name="labRequired" />
                </div>
              </div>

              <LoadingButton loading={subjectIsPending} className="w-full">
                Create subject
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {!subjects ? (
        <p>No grade</p>
      ) : (
        <div className="space-y-3">
          {subjects.map((classItem) => (
            <TooltipProvider key={classItem.id}>
              <Card
                className={`border-muted-foreground w-full cursor-pointer py-2 transition-all duration-200 hover:shadow-md ${
                  selectedSubject?.id === classItem.id
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => setSelectedSubject(classItem)}
              >
                <CardContent className="px-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="line-clamp-1 text-sm font-bold capitalize">
                          {classItem.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-slate-100"
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            }
                          >
                            <Pen size={16} className="text-slate-600" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit class</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-50"
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            }
                          >
                            <Trash2Icon size={16} className="text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete class</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubjectsCard;
