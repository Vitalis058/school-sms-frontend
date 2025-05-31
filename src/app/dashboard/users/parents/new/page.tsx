"use client";

import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarIcon, 
  Camera, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Save,
  AlertCircle,
  Info,
  Users
} from "lucide-react";
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

// Define form steps
const steps = [
  {
    id: "basic",
    title: "Basic Information",
    icon: User,
    description: "Personal details and relationship information"
  },
  {
    id: "contact",
    title: "Contact Details",
    icon: Phone,
    description: "Phone, email, and address information"
  },
  {
    id: "professional",
    title: "Professional Info",
    icon: Briefcase,
    description: "Occupation and education details"
  },
  {
    id: "additional",
    title: "Additional Details",
    icon: FileText,
    description: "Preferences and additional notes"
  },
  {
    id: "review",
    title: "Review & Submit",
    icon: CheckCircle,
    description: "Review all information before submission"
  }
];

export default function ParentEnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isTransitionPending, startTransition] = useTransition();

  const [state, action, isPending] = useActionState(
    createParentAction,
    initialState,
  );

  useEffect(() => {
    if (state?.errors?.error) {
      setLocalError(state.errors.error[0]);
      setFormErrors([state.errors.error[0]]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocalError(null);
    }

    if (state?.message) {
      setLocalSuccess(state.message);
      // Clear draft on success
      localStorage.removeItem('parentEnrollmentDraft');
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
    mode: "onChange",
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
        const error = form.formState.errors[field as keyof ParentsEnrollmentType];
        if (error && typeof error.message === 'string') {
          errors.push(error.message);
        }
      });
      setFormErrors(errors);
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
      case 0: // Basic Information
        return ["name", "relationship", "dateOfBirth"];
      case 1: // Contact Details
        return ["phone", "address"];
      case 2: // Professional Info
        return []; // All optional
      case 3: // Additional Details
        return []; // All optional
      default:
        return [];
    }
  };

  // Save draft functionality
  const saveDraft = () => {
    const formData = form.getValues();
    localStorage.setItem('parentEnrollmentDraft', JSON.stringify(formData));
    if (photoFile) {
      // Note: File objects can't be stored in localStorage, so we'll just store the preview
      localStorage.setItem('parentPhotoPreview', photoPreview || '');
    }
    alert("Draft saved successfully!");
  };

  // Load draft functionality
  const loadDraft = () => {
    const draft = localStorage.getItem('parentEnrollmentDraft');
    const savedPhotoPreview = localStorage.getItem('parentPhotoPreview');
    
    if (draft) {
      const draftData = JSON.parse(draft);
      form.reset(draftData);
      alert("Draft loaded successfully!");
    }
    
    if (savedPhotoPreview) {
      setPhotoPreview(savedPhotoPreview);
    }
  };

  const onSubmit = (values: ParentsEnrollmentType) => {
    startTransition(() => {
      action(values);
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return "completed";
    if (stepIndex === currentStep) return "current";
    if (stepIndex < currentStep) return "completed";
    return "upcoming";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
  return (
          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>Full Name *</FormLabel>
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
                    <FormItem>
                      <FormLabel>Relationship to Student *</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                          <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                            <SelectItem value="grandparent">Grandparent</SelectItem>
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
                                <span>Select date of birth</span>
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
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 hover:border-primary transition-colors">
                  {photoPreview ? (
                    <>
                      <Image
                        src={photoPreview}
                        alt="Parent photo"
                        className="w-full h-full object-cover"
                        width={128}
                        height={128}
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <Camera className="h-10 w-10 text-slate-400" />
                  )}
                </div>
                <div className="text-center">
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Photo
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Contact Details
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Address *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter complete home address including street, city, and postal code"
                      className="min-h-[100px]"
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
        );

      case 2: // Professional Info
        return (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Professional information is optional but helps us better understand our school community.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Engineer, Teacher, Doctor" {...field} />
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
                    <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="primary">Primary School</SelectItem>
                          <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="highSchool">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3: // Additional Details
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about the parent/guardian, special considerations, or relevant details..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any special considerations, medical information, or other relevant details that may help us better serve your child.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Please review all information before submitting. You can go back to any step to make changes.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Name:</span> {form.watch("name") || "Not provided"}
                  </div>
                  <div>
                    <span className="font-medium">Relationship:</span> {form.watch("relationship") || "Not provided"}
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {form.watch("dateOfBirth") ? format(form.watch("dateOfBirth")!, "PPP") : "Not provided"}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Phone:</span> {form.watch("phone") || "Not provided"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {form.watch("email") || "Not provided"}
                  </div>
                  <div>
                    <span className="font-medium">Preferred Contact:</span> {form.watch("preferredContactMethod") || "Both"}
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    {form.watch("address") || "Not provided"}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Occupation:</span> {form.watch("occupation") || "Not provided"}
                  </div>
                  <div>
                    <span className="font-medium">Education Level:</span> {form.watch("educationLevel") || "Not provided"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Notes */}
            {form.watch("notes") && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {form.watch("notes")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto mt-5 w-full max-w-6xl space-y-6">
      {/* Header */}
      <Card className="border-primary">
        <CardHeader className="border-primary border-b">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Parent/Guardian Enrollment
          </CardTitle>
          <p className="text-muted-foreground">
            Complete all steps to register a new parent or guardian in the school system
          </p>
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
                  <p className="text-sm text-muted-foreground">
                    {steps[currentStep].description}
                  </p>
                </div>
                <Badge variant={currentStep === steps.length - 1 ? "default" : "secondary"}>
                  Step {currentStep + 1}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Success/Error Messages */}
              {localError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{localError}</span>
                    <button
                      className="cursor-pointer rounded-full bg-red-200 p-1 hover:bg-red-300 hover:shadow-sm"
                      onClick={() => setLocalError(null)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              {localSuccess && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="flex items-center justify-between text-green-700">
                    <span>{localSuccess}</span>
                    <button
                      className="cursor-pointer rounded-full bg-green-200 p-1 hover:bg-green-300 hover:shadow-sm"
                      onClick={() => setLocalSuccess(null)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Form Errors */}
              {formErrors.length > 0 && !localError && (
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
                loading={isPending || isTransitionPending}
                          className="flex items-center gap-2"
              >
                          <CheckCircle className="h-4 w-4" />
                Save Parent Information
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
