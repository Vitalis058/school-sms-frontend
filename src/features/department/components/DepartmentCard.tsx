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
import { DepartmentType } from "@/types/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createDepartment } from "../actions/department_actions";

const initialState = {
  message: undefined,
  errors: {},
};

type DepartmentCardTypes = {
  setSelectedDepartment: Dispatch<SetStateAction<DepartmentType | undefined>>;

  departments?: DepartmentType[];

  selectedDepartment?: DepartmentType;
};

function DepartmentCard({
  setSelectedDepartment,
  departments,
  selectedDepartment,
}: DepartmentCardTypes) {
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);

  //creating the department
  const [departmentState, departmentFormAction, departmentIsPending] =
    useActionState(createDepartment, initialState);

  return (
    <div className="w-full max-w-[300px] flex-1">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <GraduationCapIcon className="h-6 w-6 text-slate-700" />
          <p className="text-lg font-semibold">Classes</p>
        </span>

        {/* Add Class Dialog */}
        <Dialog
          open={isDepartmentModalOpen}
          onOpenChange={setIsDepartmentModalOpen}
        >
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
            {departmentState.message && (
              <p className="text-sm text-green-500">
                {departmentState.message}
              </p>
            )}
            {departmentState.errors?.error && (
              <p className="text-sm text-red-500">
                {departmentState.errors.error[0]}
              </p>
            )}
            <form action={departmentFormAction} className="space-y-4">
              {/* Name field */}
              <div className="space-y-2">
                {departmentState.errors?.name && (
                  <p className="text-sm text-red-500">
                    {departmentState.errors.name[0]}
                  </p>
                )}
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Mathematics" name="name" />
              </div>

              <div className="space-y-2">
                {departmentState.errors?.description && (
                  <p className="text-sm text-red-500">
                    {departmentState.errors.description[0]}
                  </p>
                )}
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Write here"
                  name="description"
                />
              </div>

              <LoadingButton className="w-full" loading={departmentIsPending}>
                Create Class
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {!departments ? (
        <p>No class</p>
      ) : (
        <div className="space-y-3">
          {departments.map((departmentItem) => (
            <TooltipProvider key={departmentItem.id}>
              <Card
                className={`border-muted-foreground w-full cursor-pointer py-2 transition-all duration-200 hover:shadow-md ${
                  selectedDepartment?.id === departmentItem.id
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => setSelectedDepartment(departmentItem)}
              >
                <CardContent className="px-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="line-clamp-1 text-sm font-bold capitalize">
                          {departmentItem.name}
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

export default DepartmentCard;
