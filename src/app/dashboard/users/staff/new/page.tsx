"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, UserPlus, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation } from "@/store/api/authApi";
import { useGetDepartmentsQuery } from "@/store/api/academicsApi";
import { getErrorMessage } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StaffFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STAFF" | "DRIVER" | "LIBRARIAN";
  departmentId?: string;
}

export default function NewStaffPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  
  // Get departments for assignment
  const { data: departmentsData, isLoading: departmentsLoading } = useGetDepartmentsQuery();
  
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "STAFF",
    departmentId: "none",
  });
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [errors, setErrors] = useState<Partial<StaffFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<StaffFormData> = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof StaffFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare the registration data
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        departmentId: formData.departmentId === "none" ? undefined : formData.departmentId,
      };

      const result = await register(registrationData).unwrap();
      
      if (result.data?.defaultPassword) {
        setGeneratedPassword(result.data.defaultPassword);
        setShowSuccess(true);
      } else {
        toast.success("Staff account created successfully");
        router.push("/dashboard/users/staff");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success("Password copied to clipboard!");
  };

  const handleFinish = () => {
    router.push("/dashboard/users/staff");
  };

  // Check if department should be shown based on role
  const shouldShowDepartment = () => {
    return formData.role === "STAFF" || formData.role === "TEACHER" || formData.role === "LIBRARIAN";
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Full system access and management";
      case "TEACHER":
        return "Manage students, lessons, and academic content";
      case "STAFF":
        return "Administrative tasks and student records";
      case "DRIVER":
        return "Vehicle management and transport operations";
      case "LIBRARIAN":
        return "Library management and book operations";
      default:
        return "";
    }
  };

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Staff Member</h1>
            <p className="text-muted-foreground">
              Register a new staff member to the system
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Staff Registration Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="Enter username"
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "ADMIN" | "TEACHER" | "STAFF" | "DRIVER" | "LIBRARIAN") =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STAFF">
                          <div className="flex flex-col">
                            <span>Staff</span>
                            <span className="text-xs text-muted-foreground">
                              Administrative tasks and student records
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="TEACHER">
                          <div className="flex flex-col">
                            <span>Teacher</span>
                            <span className="text-xs text-muted-foreground">
                              Manage students, lessons, and academic content
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="LIBRARIAN">
                          <div className="flex flex-col">
                            <span>Librarian</span>
                            <span className="text-xs text-muted-foreground">
                              Library management and book operations
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="DRIVER">
                          <div className="flex flex-col">
                            <span>Driver</span>
                            <span className="text-xs text-muted-foreground">
                              Vehicle management and transport operations
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex flex-col">
                            <span>Administrator</span>
                            <span className="text-xs text-muted-foreground">
                              Full system access and management
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.role && (
                      <p className="text-xs text-muted-foreground">
                        {getRoleDescription(formData.role)}
                      </p>
                    )}
                  </div>

                  {/* Department Assignment */}
                  {shouldShowDepartment() && (
                    <div className="space-y-2">
                      <Label htmlFor="departmentId">Department</Label>
                      <Select
                        value={formData.departmentId}
                        onValueChange={(value) => handleInputChange("departmentId", value)}
                        disabled={departmentsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Department</SelectItem>
                          {departmentsData?.map((department) => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Assign to a department for better organization and reporting
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Staff Account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Account Created Successfully
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The staff member account has been created successfully. Here are the login credentials:
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                    {formData.email}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Temporary Password</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 p-2 bg-gray-50 rounded border text-sm font-mono">
                      {generatedPassword}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPassword}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Please share these credentials with the staff member. 
                  They should change their password after their first login for security.
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyPassword}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Password
                </Button>
                <Button onClick={handleFinish} className="flex-1">
                  Finish
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
} 