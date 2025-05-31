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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getErrorMessage } from "@/lib/utils";
import { useGetGradesQuery } from "@/store/api/academicsApi";

const feeStructureSchema = z.object({
  name: z.string().min(1, "Fee structure name is required"),
  description: z.string().optional(),
  amount: z.number().min(0, "Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  gradeId: z.string().min(1, "Grade is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  term: z.string().min(1, "Term is required"),
  dueDate: z.string().min(1, "Due date is required"),
  mandatory: z.boolean(),
  installmentAllowed: z.boolean(),
});

type FeeStructureFormData = z.infer<typeof feeStructureSchema>;

interface Grade {
  id: string;
  name: string;
}

interface FeeStructureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    name?: string;
    description?: string;
    amount?: number;
    category?: string;
    gradeId?: string;
    academicYear?: string;
    term?: string;
    dueDate?: string;
    mandatory?: boolean;
    installmentAllowed?: boolean;
  };
  isEditing?: boolean;
}

export function FeeStructureForm({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
}: FeeStructureFormProps) {
  const { data: grades = [], isLoading: gradesLoading } = useGetGradesQuery();

  const form = useForm<FeeStructureFormData>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      category: initialData?.category || "",
      gradeId: initialData?.gradeId || "",
      academicYear: initialData?.academicYear || new Date().getFullYear().toString(),
      term: initialData?.term || "",
      dueDate: initialData?.dueDate || "",
      mandatory: initialData?.mandatory ?? true,
      installmentAllowed: initialData?.installmentAllowed ?? false,
    },
  });

  const handleSubmit = async (data: FeeStructureFormData) => {
    try {
      // This would typically call an API to create/update the fee structure
      console.log("Fee structure data:", data);
      toast.success(isEditing ? "Fee structure updated successfully" : "Fee structure created successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (gradesLoading) {
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
          {isEditing ? 'Edit Fee Structure' : 'Create Fee Structure'}
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
                      <FormLabel>Fee Structure Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter fee structure name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TUITION">Tuition</SelectItem>
                          <SelectItem value="EXAMINATION">Examination</SelectItem>
                          <SelectItem value="LIBRARY">Library</SelectItem>
                          <SelectItem value="LABORATORY">Laboratory</SelectItem>
                          <SelectItem value="TRANSPORT">Transport</SelectItem>
                          <SelectItem value="SPORTS">Sports</SelectItem>
                          <SelectItem value="ACTIVITY">Activity</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          step="0.01"
                          placeholder="Enter amount"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades.map((grade: Grade) => (
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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2024" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Term 1</SelectItem>
                          <SelectItem value="2">Term 2</SelectItem>
                          <SelectItem value="3">Term 3</SelectItem>
                          <SelectItem value="ANNUAL">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mandatory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mandatory</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          This fee is mandatory for all students
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="installmentAllowed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow Installments</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Students can pay this fee in installments
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
                {isEditing ? 'Update Fee Structure' : 'Create Fee Structure'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 