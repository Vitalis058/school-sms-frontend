"use client";

import type React from "react";
import { useActionState, useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
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
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Camera, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ParentsEnrollmentSchema,
  ParentsEnrollmentType,
} from "@/utils/validation";
import LoadingButton from "@/components/LoadingButton";
import { createParentAction } from "@/features/parent/actions/parent_actions";

const initialState = {
  message: undefined,
  errors: {},
};

export default function ParentEnrollmentForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [isTransitionPending, startTransition] = useTransition();

  const [state, action, isPending] = useActionState(
    createParentAction,
    initialState,
  );

  useEffect(() => {
    if (state?.errors?.error) {
      setLocalError(state.errors.error[0]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocalError(null);
    }

    if (state?.message) {
      setLocalSuccess(state.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocalSuccess(null);
    }
  }, [state]);

  const form = useForm({
    resolver: zodResolver(ParentsEnrollmentSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      dateOfBirth: undefined,
      educationLevel: "",
      preferredContactMethod: "both",
      notes: "",
    },
  });

  const onSubmit = (values: ParentsEnrollmentType) => {
    startTransition(() => {
      action(values);
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (state.errors?.error) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (state.message) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Card className="border-primary mx-auto mt-5 w-full max-w-4xl border-0 sm:border">
      <CardHeader className="border-primary border-b">
        <CardTitle className="text-primary text-2xl font-bold">
          Parent/Guardian Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {localError && (
          <div className="flex items-center justify-between rounded-md bg-red-100 p-2 text-sm text-red-500 capitalize">
            <p>{localError}</p>
            <button
              className="cursor-pointer rounded-full bg-red-200 p-1 hover:bg-red-300 hover:shadow-sm"
              onClick={() => setLocalError(null)}
            >
              <X className="" size={15} />
            </button>
          </div>
        )}

        {localSuccess && (
          <div className="flex items-center justify-between rounded-md bg-green-100 p-2 text-sm text-green-500 capitalize">
            <p>{localSuccess}</p>
            <button
              className="cursor-pointer rounded-full bg-green-200 p-1 hover:bg-green-300 hover:shadow-sm"
              onClick={() => setLocalSuccess(null)}
            >
              <X className="" size={15} />
            </button>
          </div>
        )}
        <div className="mb-6 flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <h3 className="mb-4 text-lg font-semibold">Basic Details</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-primary/30 relative mb-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
              {photoPreview ? (
                <Image
                  src={photoPreview || "/placeholder.svg"}
                  alt="Parent photo"
                  className="h-full w-full object-cover"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <Camera className="text-primary h-10 w-10" />
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="text-primary cursor-pointer text-sm font-medium"
            >
              Add Photo
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Relationship to Student</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="grandparent">
                            Grandparent
                          </SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>YYYY/MM/DD</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="07XX XXX XXX" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredContactMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 Street, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Engineer, Teacher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="highSchool">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelors">
                          Bachelor&apos;s Degree
                        </SelectItem>
                        <SelectItem value="masters">
                          Master&apos;s Degree
                        </SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about the parent/guardian"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any special considerations or information that may
                    be relevant.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => {
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isPending || isTransitionPending}
                type="submit"
                className="w-full"
              >
                Save Parent Information
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
