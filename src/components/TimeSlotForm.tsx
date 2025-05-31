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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeSlotSchema = z.object({
  name: z.string().min(1, "Time slot name is required"),
  startTime: z
    .string()
    .regex(timeRegex, { message: "Invalid time format (expected HH:mm)" }),
  endTime: z
    .string()
    .regex(timeRegex, { message: "Invalid time format (expected HH:mm)" }),
}).refine((data) => {
  const start = data.startTime.split(':').map(Number);
  const end = data.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  return endMinutes > startMinutes;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type TimeSlotFormData = z.infer<typeof timeSlotSchema>;

interface TimeSlotFormProps {
  onSubmit: (data: TimeSlotFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: {
    name?: string;
    startTime?: string;
    endTime?: string;
  };
  isEditing?: boolean;
}

export function TimeSlotForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: TimeSlotFormProps) {
  const form = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      name: initialData?.name || "",
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
    },
  });

  const handleSubmit = async (data: TimeSlotFormData) => {
    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {isEditing ? 'Edit Time Slot' : 'Add New Time Slot'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Period 1, Morning Break" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="time" 
                          placeholder="HH:mm"
                        />
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
                        <Input 
                          {...field} 
                          type="time" 
                          placeholder="HH:mm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time Duration Display */}
              {form.watch("startTime") && form.watch("endTime") && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Duration:</span>{" "}
                    {(() => {
                      const start = form.watch("startTime").split(':').map(Number);
                      const end = form.watch("endTime").split(':').map(Number);
                      const startMinutes = start[0] * 60 + start[1];
                      const endMinutes = end[0] * 60 + end[1];
                      const durationMinutes = endMinutes - startMinutes;
                      
                      if (durationMinutes <= 0) return "Invalid duration";
                      
                      const hours = Math.floor(durationMinutes / 60);
                      const minutes = durationMinutes % 60;
                      
                      if (hours > 0) {
                        return `${hours}h ${minutes}m`;
                      } else {
                        return `${minutes}m`;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? 'Update Time Slot' : 'Create Time Slot'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 