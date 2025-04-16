"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/PasswordInput";
import { SearchableSelect } from "@/components/SearchableSelect";
import {
  StudentEnrollmentSchema,
  StudentEnrollmentTypes,
} from "@/utils/validation";
import { useActionState, useEffect, useState, useTransition } from "react";
import LoadingButton from "@/components/LoadingButton";
import { createStudent } from "@/actions/student_actions";
import { StreamsType } from "@/types/types";
import { X } from "lucide-react";

const initialState = {
  message: undefined,
  errors: {},
};

type GradesType = {
  grades: {
    value: string;
    label: string;
  }[];

  streams: StreamsType[];

  parents: {
    value: string;
    label: string;
  }[];
};

export default function AddSingleStudentForm({
  grades,
  streams,
  parents,
}: GradesType) {
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [filteredStreams, setFilteredStreams] = useState<
    { value: string; label: string }[]
  >([]);

  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    createStudent,
    initialState
  );
  const [isTransitionPending, startTransition] = useTransition();

  useEffect(() => {
    if (!selectedGradeId) return;
    const result = streams
      .filter((stream) => stream.gradeId === selectedGradeId)
      .map((stream) => ({ value: stream.id, label: stream.name }));
    setFilteredStreams(result);
  }, [selectedGradeId, streams]);

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

  const form = useForm<StudentEnrollmentTypes>({
    resolver: zodResolver(StudentEnrollmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      guardianId: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      admissionNumber: "",
      enrollmentDate: "",
      gradeId: "",
      streamId: "",
      message: "",
      password: "",
    },
  });

  function onSubmit(values: StudentEnrollmentTypes) {
    startTransition(() => {
      formAction(values);
    });
  }

  if (state?.errors) {
    Object.entries(state.errors).forEach(([key, value]) => {
      if (key !== "root") {
        form.setError(key as keyof StudentEnrollmentTypes, {
          message: value[0],
        });
      }
    });
  }

  if (state.errors?.error) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (state.message) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Form {...form}>
      {localError && (
        <div className="text-red-500 text-sm bg-red-100 p-2 rounded-md capitalize flex justify-between items-center">
          <p>{localError}</p>
          <button
            className="rounded-full bg-red-200 p-1 hover:bg-red-300 hover:shadow-sm cursor-pointer"
            onClick={() => setLocalError(null)}
          >
            <X className="" size={15} />
          </button>
        </div>
      )}

      {localSuccess && (
        <div className="text-green-500 text-sm bg-green-100 p-2 rounded-md capitalize flex justify-between items-center">
          <p>{localSuccess}</p>
          <button
            className="rounded-full bg-green-200 p-1 hover:bg-green-300 hover:shadow-sm cursor-pointer"
            onClick={() => setLocalSuccess(null)}
          >
            <X className="" size={15} />
          </button>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="dateOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Date of Birth <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem
                  className="w-full
                "
                >
                  <FormLabel>
                    Gender <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="guardianId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Guardian name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={parents}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Guardian"
                      href="/dashboard/users/parents/new"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Address */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Address</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              name="streetAddress"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Street Address <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      State <span className="text-destructive">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="zipCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Academic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4 text-primary">
            Academic Information
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              name="admissionNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Admission Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ADM202401" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="gradeId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={grades}
                      onChange={(value) => {
                        field.onChange(value);
                        setSelectedGradeId(value);
                      }}
                      value={field.value}
                      placeholder="Grade"
                      href="/dashboard/student-management/class-streams"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="streamId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Stream</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={filteredStreams}
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Class stream"
                      href="/dashboard/student-management/class-streams"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Password <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="enrollmentDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Enrollment Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Message */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">
            Additional Notes
          </h3>
          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any notes or special instructions here..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton
          className="w-full"
          loading={isPending || isTransitionPending}
        >
          submit
        </LoadingButton>
      </form>
    </Form>
  );
}
