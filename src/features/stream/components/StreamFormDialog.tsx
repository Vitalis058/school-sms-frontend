"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StreamCreationSchema, StreamCreationTYpes } from "@/utils/validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface Grade {
  id: string;
  name: string;
  slug: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface StreamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; gradeId: string; teacherId?: string }) => Promise<void>;
  grades: Grade[];
  teachers: Teacher[];
  isLoading: boolean;
  title: string;
  description: string;
  initialData?: {
    name: string;
    gradeId: string;
    teacherId?: string;
  };
}

export function StreamFormDialog({
  open,
  onOpenChange,
  onSubmit,
  grades,
  teachers,
  isLoading,
  title,
  description,
  initialData,
}: StreamFormDialogProps) {
  const form = useForm<StreamCreationTYpes>({
    resolver: zodResolver(StreamCreationSchema),
    defaultValues: {
      name: "",
      gradeId: "",
      teacherId: "none",
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open && initialData) {
      form.reset({
        ...initialData,
        teacherId: initialData.teacherId || "none",
      });
    } else if (!open) {
      form.reset({
        name: "",
        gradeId: "",
        teacherId: "none",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: StreamCreationTYpes) => {
    const submitData = {
      name: data.name,
      gradeId: data.gradeId,
      teacherId: data.teacherId === "none" || !data.teacherId ? undefined : data.teacherId,
    };
    
    await onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5A, 5B, Grade 1 Alpha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Teacher (Optional)</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No teacher assigned</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.firstName} {teacher.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="outline" asChild type="button">
                      <Link href="/dashboard/users/teachers/new">
                        <Plus className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <LoadingButton loading={isLoading} type="submit" className="flex-1">
                {initialData ? "Update Stream" : "Create Stream"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 