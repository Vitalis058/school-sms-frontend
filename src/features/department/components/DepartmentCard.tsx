"use client";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllDepartmentsQuery } from "@/redux/services";
import { DepartmentType } from "@/types/types";
import { Pen, Plus, School, Trash2Icon } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { createDepartment } from "../actions/department_actions";

const initialState = {
  message: undefined,
  errors: {},
  newDepartment: undefined,
  success: false,
};

type DepartmentCardTypes = {
  setSelectedDepartmentId: Dispatch<SetStateAction<string | undefined>>;
  departments?: DepartmentType[];
  selectedDepartmentId?: string;
};

function DepartmentCard({
  setSelectedDepartmentId: setSelectedDepartment,
  departments,
  selectedDepartmentId,
}: DepartmentCardTypes) {
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [departmentState, departmentFormAction, departmentIsPending] =
    useActionState(createDepartment, initialState);

  const { refetch } = useGetAllDepartmentsQuery();

  useEffect(() => {
    if (departmentState.success && departmentState.newDepartment) {
      refetch();
    }
  }, [departmentState.success, departmentState.newDepartment, refetch]);

  return (
    <div className="w-full max-w-[300px] flex-1">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex justify-center gap-2">
          <School className="h-6 w-6 text-gray-500" />
          <p className="font-semibold">Departments</p>
        </span>

        {/* Add Class Dialog */}
        <Dialog
          open={isDepartmentModalOpen}
          onOpenChange={setIsDepartmentModalOpen}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Add new department</span>
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Add a new department</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>
                Enter the details for the new Department.
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
                Create department
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {!departments ? (
        <p>No department</p>
      ) : (
        <div className="space-y-3">
          {departments.map((departmentItem) => (
            <TooltipProvider key={departmentItem.id}>
              <Card
                className={`border-muted-foreground w-full cursor-pointer py-2 transition-all duration-200 hover:shadow-md ${
                  selectedDepartmentId === departmentItem.id
                    ? "bg-primary/10 border-primary"
                    : ""
                }`}
                onClick={() => setSelectedDepartment(departmentItem.id)}
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
                          <p>Edit department</p>
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
                          <p>Delete department</p>
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
