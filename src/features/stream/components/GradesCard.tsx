"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createGradeAction } from "@/features/grade/actions/grade_actions";
import { GradesType } from "@/types/types";
import {
  Edit3,
  Ellipsis,
  GraduationCapIcon,
  Plus,
  Trash2Icon,
  Users,
} from "lucide-react";
import { Dispatch, SetStateAction, useActionState, useState } from "react";
import LoadingButton from "../../../components/LoadingButton";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { TooltipProvider } from "../../../components/ui/tooltip";

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
    <div className="w-full max-w-[300px] flex-1/3 sm:flex-1">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <GraduationCapIcon className="h-6 w-6 text-slate-700" />
          <p className="text-sm font-semibold sm:text-lg">Classes</p>
        </span>

        {/* Add Class Dialog */}
        <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-3 w-3 sm:h-5 sm:w-5" />
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
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger className="self-start outline-0">
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <button className="hover:bg-primary/20 flex w-full gap-2">
                            <Edit3 className="text-primary" />
                            <p>Edit</p>
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Trash2Icon className="text-red-500" />
                          <p>Delete</p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
