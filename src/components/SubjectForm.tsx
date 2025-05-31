"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, getErrorMessage } from "@/lib/utils";
import { useGetDepartmentsQuery } from "@/store/api/academicsApi";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  subjectCode: z.string().min(1, "Subject code is required"),
  shortname: z.string().min(1, "Short name is required"),
  departmentId: z.string().min(1, "Department is required"),
  active: z.boolean(),
  optional: z.boolean(),
  fieldtrips: z.boolean(),
  labRequired: z.boolean(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  onSubmit: (data: SubjectFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function SubjectForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: SubjectFormProps) {
  const { data: departments = [], isLoading: departmentsLoading } = useGetDepartmentsQuery();

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialData?.name || "",
      subjectCode: initialData?.subjectCode || "",
      shortname: initialData?.shortname || "",
      departmentId: initialData?.departmentId || "",
      active: initialData?.active ?? true,
      optional: initialData?.optional ?? false,
      fieldtrips: initialData?.fieldtrips ?? false,
      labRequired: initialData?.labRequired ?? false,
    },
  });

  const handleSubmit = async (data: SubjectFormData) => {
    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (departmentsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
          <div className="text-sm text-muted-foreground">Please wait while we load the form data</div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Subject' : 'Add New Subject'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter subject name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subjectCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., MATH101" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Math" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department: any) => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Subject Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Subject Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Subject is currently being taught
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="optional"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Optional</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Subject is optional for students
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="labRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Lab Required</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Subject requires laboratory sessions
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fieldtrips"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Field Trips</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Subject includes field trips
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 