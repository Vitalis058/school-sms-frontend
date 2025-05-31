"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimeSlotSchema } from "@/utils/validation";
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
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { useEffect } from "react";
import { z } from "zod";

type TimeSlotFormData = z.infer<typeof TimeSlotSchema>;

interface TimeSlotFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; startTime: string; endTime: string }) => Promise<void>;
  isLoading: boolean;
  title: string;
  description: string;
  initialData?: {
    name: string;
    startTime: string;
    endTime: string;
  };
}

export function TimeSlotFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  title,
  description,
  initialData,
}: TimeSlotFormDialogProps) {
  const form = useForm<TimeSlotFormData>({
    resolver: zodResolver(TimeSlotSchema),
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open && initialData) {
      form.reset(initialData);
    } else if (!open) {
      form.reset({
        name: "",
        startTime: "",
        endTime: "",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = async (data: TimeSlotFormData) => {
    await onSubmit(data);
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
                  <FormLabel>Time Slot Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Period 1, Morning Break" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
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
                {initialData ? "Update Time Slot" : "Create Time Slot"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 