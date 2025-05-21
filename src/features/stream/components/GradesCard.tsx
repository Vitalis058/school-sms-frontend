"use client";

import { GraduationCapIcon, Pen, Plus, Trash2Icon, Users } from "lucide-react";
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
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import LoadingButton from "../../../components/LoadingButton";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { GradesType } from "@/types/types";
import { createGradeAction } from "@/features/grade/actions/grade_actions";

const initialState = {
  message: undefined,
  errors: {},
};

type GradesCardTypes = {
  setSelectedClass: Dispatch<
    SetStateAction<
      | {
          students: string;
          streams: string;
          id: string;
          name: string;
        }
      | undefined
    >
  >;

  classes?: GradesType[];

  selectedClass?: {
    students: string;
    streams: string;
    id: string;
    name: string;
  };
};

function GradesCard({
  setSelectedClass,
  classes,
  selectedClass,
}: GradesCardTypes) {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [gradeState, gradeFormAction, gradeIsPending] = useActionState(
    createGradeAction,
    initialState,
  );

  return (
    <div className="w-full max-w-[300px] flex-1">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <GraduationCapIcon className="h-6 w-6 text-slate-700" />
          <p className="text-lg font-semibold">Classes</p>
        </span>

        {/* Add Class Dialog */}
        <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add new class</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
              <DialogDescription>
                Enter the details for the new class.
              </DialogDescription>
            </DialogHeader>
            {gradeState.message && (
              <p className="text-sm text-green-500">{gradeState?.message}</p>
            )}
            {gradeState.errors?.error && (
              <p className="text-sm text-red-500">
                {gradeState.errors.error[0]}
              </p>
            )}
            <form action={gradeFormAction} className="space-y-2">
              <div className="space-y-2">
                {gradeState.errors?.name && (
                  <p className="text-sm text-red-500">
                    {gradeState.errors.name[0]}
                  </p>
                )}
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="grade 5"
                  className=""
                  name="name"
                />
              </div>

              <LoadingButton
                loading={gradeIsPending}
                type="submit"
                className="w-full"
              >
                Create Class
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {!classes ? (
        <p>No grade</p>
      ) : (
        <div className="space-y-3">
          {classes.map((classItem) => (
            <TooltipProvider key={classItem.id}>
              <Card
                className={`border-muted-foreground w-full cursor-pointer py-2 transition-all duration-200 hover:shadow-md ${
                  selectedClass?.id === classItem.id
                    ? "bg-muted border-primary"
                    : ""
                }`}
                onClick={() => setSelectedClass(classItem)}
              >
                <CardContent className="px-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="line-clamp-1 text-sm font-bold">
                          {classItem.name}
                        </h3>
                        <span className="text-xs font-normal">
                          {classItem.streams} Streams
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-baseline gap-1.5">
                        <Users size={16} />
                        <span className="text-xs">
                          {classItem.students} students
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-slate-100"
                            onClick={(e) => e.stopPropagation()}
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
                            onClick={(e) => e.stopPropagation()}
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

export default GradesCard;
