/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoadingButton from "@/components/LoadingButton";
import { Progress } from "@/components/ui/progress";
import { API_URL } from "@/constants/apiUrl";
import AdditionalInfo from "@/features/teacher/forms/AdditionalInfo";
import AddressInfo from "@/features/teacher/forms/AddressInfo";
import CurrentEmploymentDetails from "@/features/teacher/forms/CurrentEmploymentDetails";
import PersonalInfo from "@/features/teacher/forms/personalInfo";
import PreviousEmployment from "@/features/teacher/forms/PreviousEmployment";
import ProfessionalInfo from "@/features/teacher/forms/ProfessionalInfo";
import ReviewInfo from "@/features/teacher/forms/ReviewInfo";
import { useAppSelector } from "@/store/hooks";
import {
  TeacherEnrollmentSchema,
  TeacherEnrollmentType,
} from "@/utils/validation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define the steps of the form
const steps = [
  { id: "personal", title: "Personal Information" },
  { id: "address", title: "Address & Emergency Contact" },
  { id: "professional", title: "Professional Information" },
  { id: "employment", title: "Current Employment" },
  { id: "previous", title: "Previous Employment" },
  { id: "additional", title: "Additional Information" },
  { id: "review", title: "Review & Submit" },
];

export default function TeacherEnrollmentForm() {
  const { subjects } = useAppSelector((state) => state.subjects);
  const { departments } = useAppSelector((state) => state.department);

  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const form = useForm<TeacherEnrollmentType>({
    resolver: zodResolver(TeacherEnrollmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      highestQualification: "",
      specialization: "",
      teachingExperience: "",
      subjects: [],
      gradesCanTeach: [],
      employmentType: "full_time",
      position: "",
      departmentId: "",
      previousEmployments: [
        {
          institution: "",
          position: "",
          reasonForLeaving: "",
        },
      ],
      certifications: "",
      skills: "",
      languages: "",
      additionalNotes: "",
      dateOfBirth: new Date(),
      gender: "male",
      joiningDate: new Date(),
    },
    mode: "onChange",
  });
  const {
    append: appendPreviousEmployment,
    fields: PreviousEmploymentFields,
    remove: removePreviousEmployment,
  } = useFieldArray({
    control: form.control,
    name: "previousEmployments",
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);

    const result = await form.trigger(fieldsToValidate as any);
    if (result) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFieldsToValidate = (step: number): string[] => {
    switch (step) {
      // Personal Information
      case 0:
        return [
          "firstName",
          "lastName",
          "dateOfBirth",
          "gender",
          "email",
          "phone",
        ];

      // Address & Emergency Contact
      case 1:
        return [
          "address",
          "city",
          "state",
          "zipCode",
          "emergencyContactName",
          "emergencyContactPhone",
          "emergencyContactRelationship",
        ];

      // Professional Information
      case 2:
        return [
          "highestQualification",
          "specialization",
          "teachingExperience",
          "subjectsCanTeach",
          "gradesCanTeach",
        ];

      // Current Employment
      case 3:
        return ["employmentType", "joiningDate", "position", "department"];

      // Previous Employment
      case 4:
        return [];

      // Additional Information
      case 5:
        return [];
      default:
        return [];
    }
  };

  //mutation function
  const mutation = useMutation({
    mutationFn: async (data: TeacherEnrollmentType) => {
      const response = await axios.post(`${API_URL}/api/v1/teachers`, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Teacher Enrolled successfully");
      router.push("/dashboard/users/teachers");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong, Please try again");
    },
  });

  const onSubmit = async (data: TeacherEnrollmentType) => {
    mutation.mutate(data);
    console.log(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo />;
      case 1:
        return <AddressInfo />;

      case 2:
        return <ProfessionalInfo subjects={subjects} />;

      case 3:
        return <CurrentEmploymentDetails departments={departments} />;

      case 4:
        return (
          <div>
            <div className="flex items-center justify-between space-y-4">
              <h3 className="text-primary text-lg font-semibold">
                Previous Employment
              </h3>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() =>
                  appendPreviousEmployment({
                    institution: "",
                    position: "",
                    startDate: new Date(),
                    endDate: new Date(),
                    reasonForLeaving: "",
                  })
                }
                className="bg-primary flex items-center gap-1 text-white hover:shadow-md"
              >
                <Plus className="h-4 w-4" /> Add Employment
              </Button>
            </div>
            <FormField
              control={form.control}
              name="previousEmployments"
              render={() => (
                <FormItem>
                  {PreviousEmploymentFields.map((field, index) => (
                    <PreviousEmployment
                      index={index}
                      removePreviousEmployment={() =>
                        removePreviousEmployment(index)
                      }
                      key={field.id}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return <AdditionalInfo />;

      case 6:
        return (
          <ReviewInfo
            subjects={subjects}
            form={form}
            departments={departments}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-primary mx-auto mt-5 w-full max-w-4xl">
      <CardHeader className="border-primary border-b">
        <CardTitle className="text-2xl font-bold">
          Teacher Enrollment Form
        </CardTitle>
        <CardDescription>
          Enter teacher details to add them to the school management system
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-8">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-muted-foreground text-sm">
              {steps[currentStep].title}
            </span>
          </div>
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="h-2"
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {renderStepContent()}

            <div className="mt-8 flex justify-between border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <LoadingButton loading={mutation.isPending}>
                  Submit teachers details
                </LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
