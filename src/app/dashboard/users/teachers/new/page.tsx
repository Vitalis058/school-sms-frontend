/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
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

import ErrorComponent from "@/components/ErrorComponent";
import LoadingButton from "@/components/LoadingButton";
import LoadingComponent from "@/components/LoadingComponent";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_URL } from "@/constants/apiUrl";
import AdditionalInfo from "@/features/teacher/forms/AdditionalInfo";
import AddressInfo from "@/features/teacher/forms/AddressInfo";
import CurrentEmploymentDetails from "@/features/teacher/forms/CurrentEmploymentDetails";
import PersonalInfo from "@/features/teacher/forms/personalInfo";
import PreviousEmployment from "@/features/teacher/forms/PreviousEmployment";
import ProfessionalInfo from "@/features/teacher/forms/ProfessionalInfo";
import ReviewInfo from "@/features/teacher/forms/ReviewInfo";
import {
  useGetDepartmentsQuery,
  useGetSubjectsQuery,
} from "@/store/api/academicsApi";
import {
  useCreateTeacherMutation,
} from "@/store/api/teacherApi";
import {
  TeacherEnrollmentSchema,
  TeacherEnrollmentType,
} from "@/utils/validation";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Save, 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define the steps of the form with icons and descriptions
const steps = [
  { 
    id: "personal", 
    title: "Personal Information", 
    icon: User,
    description: "Basic personal details and contact information"
  },
  { 
    id: "address", 
    title: "Address & Emergency Contact", 
    icon: MapPin,
    description: "Residential address and emergency contact details"
  },
  { 
    id: "professional", 
    title: "Professional Information", 
    icon: GraduationCap,
    description: "Educational qualifications and teaching expertise"
  },
  { 
    id: "employment", 
    title: "Current Employment", 
    icon: Briefcase,
    description: "Employment type, position, and department details"
  },
  { 
    id: "previous", 
    title: "Previous Employment", 
    icon: Clock,
    description: "Work history and previous teaching experience"
  },
  { 
    id: "additional", 
    title: "Additional Information", 
    icon: FileText,
    description: "Certifications, skills, and additional notes"
  },
  { 
    id: "review", 
    title: "Review & Submit", 
    icon: CheckCircle,
    description: "Review all information before submission"
  },
];

export default function TeacherEnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
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
          startDate: new Date(),
          endDate: new Date(),
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
    setFormErrors([]);

    const result = await form.trigger(fieldsToValidate as any);
    
    if (result) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
      
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Collect validation errors
      const errors: string[] = [];
      fieldsToValidate.forEach(field => {
        const error = form.formState.errors[field as keyof TeacherEnrollmentType];
        if (error && typeof error.message === 'string') {
          errors.push(error.message);
        }
      });
      setFormErrors(errors);
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setFormErrors([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex - 1)) {
      setCurrentStep(stepIndex);
      setFormErrors([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
          "subjects",
          "gradesCanTeach",
        ];

      // Current Employment
      case 3:
        return ["employmentType", "joiningDate", "position", "departmentId"];

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

  // Save draft functionality
  const saveDraft = () => {
    const formData = form.getValues();
    localStorage.setItem('teacherEnrollmentDraft', JSON.stringify(formData));
    toast.success("Draft saved successfully");
  };

  // Load draft functionality
  const loadDraft = () => {
    const draft = localStorage.getItem('teacherEnrollmentDraft');
    if (draft) {
      const draftData = JSON.parse(draft);
      form.reset(draftData);
      toast.success("Draft loaded successfully");
    }
  };

  // RTK Query mutation for creating teacher
  const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();

  const onSubmit = async (data: TeacherEnrollmentType) => {
    try {
      // Transform the data to match the API expectations
      const teacherData = {
        ...data,
        // Ensure dates are properly formatted as strings
        dateOfBirth: data.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
        joiningDate: data.joiningDate.toISOString().split('T')[0], // YYYY-MM-DD format
        // Transform previous employments to match expected format
        previousEmployments: data.previousEmployments.map(emp => ({
          ...emp,
          startDate: emp.startDate.toISOString().split('T')[0],
          endDate: emp.endDate.toISOString().split('T')[0],
        })),
      };

      const result = await createTeacher(teacherData).unwrap();
      
      // Clear draft on successful submission
      localStorage.removeItem('teacherEnrollmentDraft');
      toast.success("Teacher enrolled successfully! Welcome to the team.");
      router.push("/dashboard/users/teachers");
    } catch (error: any) {
      console.error("Teacher creation error:", error);
      const errorMessage = error?.data?.message || error?.message || "Something went wrong, Please try again";
      toast.error(errorMessage);
      setFormErrors([errorMessage]);
    }
  };

  const {
    isError: subjectError,
    isLoading: subjectsLoading,
    data: subjects,
  } = useGetSubjectsQuery({});

  const {
    isError: departmentError,
    isLoading: departmentLoading,
    data: departments,
  } = useGetDepartmentsQuery();

  if (departmentError || subjectError) return <ErrorComponent />;
  if (departmentLoading || subjectsLoading) return <LoadingComponent />;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfo />;
      case 1:
        return <AddressInfo />;
      case 2:
        return <ProfessionalInfo subjects={subjects || []} />;
      case 3:
        return <CurrentEmploymentDetails departments={departments || []} />;
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">Previous Employment</h3>
                <p className="text-sm text-muted-foreground">Add your previous teaching experience</p>
              </div>
              <Button
                type="button"
                variant="outline"
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
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Employment
              </Button>
            </div>
            
            {PreviousEmploymentFields.length === 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No previous employment added. You can skip this step if this is your first teaching position.
                </AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="previousEmployments"
              render={() => (
                <FormItem>
                  <div className="space-y-4">
                    {PreviousEmploymentFields.map((field, index) => (
                      <PreviousEmployment
                        index={index}
                        removePreviousEmployment={() =>
                          removePreviousEmployment(index)
                        }
                        key={field.id}
                      />
                    ))}
                  </div>
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
            subjects={subjects || []}
            form={form}
            departments={departments || []}
          />
        );
      default:
        return null;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return "completed";
    if (stepIndex === currentStep) return "current";
    if (stepIndex < currentStep) return "completed";
    return "upcoming";
  };

  return (
    <div className="mx-auto mt-5 w-full max-w-6xl space-y-6">
      {/* Header */}
      <Card className="border-primary">
        <CardHeader className="border-primary border-b">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            Teacher Enrollment Form
          </CardTitle>
          <CardDescription>
            Complete all steps to add a new teacher to the school management system
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
              <div className="flex items-center gap-2">
                <Progress
                  value={((currentStep + 1) / steps.length) * 100}
                  className="h-2 flex-1"
                />
                <span className="text-sm font-medium">
                  {currentStep + 1}/{steps.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const status = getStepStatus(index);
                
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    disabled={index > currentStep && !completedSteps.includes(index - 1)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      status === "current"
                        ? "border-primary bg-primary/5 text-primary"
                        : status === "completed"
                        ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    } ${
                      index > currentStep && !completedSteps.includes(index - 1)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded ${
                        status === "current"
                          ? "bg-primary text-white"
                          : status === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}>
                        {status === "completed" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {step.title}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              
              {/* Draft Actions */}
              <div className="pt-4 border-t space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={saveDraft}
                  className="w-full flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={loadDraft}
                  className="w-full"
                >
                  Load Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form Content */}
        <div className="lg:col-span-3">
          <Card className="border-primary">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                    {steps[currentStep].title}
                  </CardTitle>
                  <CardDescription>
                    {steps[currentStep].description}
                  </CardDescription>
                </div>
                <Badge variant={currentStep === steps.length - 1 ? "default" : "secondary"}>
                  Step {currentStep + 1}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Error Display */}
              {formErrors.length > 0 && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Please fix the following errors:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {formErrors.map((error, index) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {renderStepContent()}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between items-center border-t pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {currentStep < steps.length - 1 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex items-center gap-2"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <LoadingButton 
                          loading={isCreating}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Submit Teacher Details
                        </LoadingButton>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
