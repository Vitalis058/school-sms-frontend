import { subjects } from "@/utils/subjects";
import { TeacherEnrollmentType } from "@/utils/validation";
import { format } from "date-fns";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type ReviewInfoTypes = {
  form: UseFormReturn<TeacherEnrollmentType>;
};

function ReviewInfo({ form }: ReviewInfoTypes) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
      <div className="space-y-6">
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2 text-primary">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Name:</span>{" "}
              {form.getValues("firstName")} {form.getValues("lastName")}
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span>{" "}
              {form.getValues("dateOfBirth")
                ? format(form.getValues("dateOfBirth"), "PPP")
                : "Not provided"}
            </div>
            <div>
              <span className="font-medium">Gender:</span>{" "}
              {form.getValues("gender")
                ? form.getValues("gender").charAt(0).toUpperCase() +
                  form.getValues("gender").slice(1)
                : "Not provided"}
            </div>
            <div>
              <span className="font-medium">Email:</span>{" "}
              {form.getValues("email")}
            </div>
            <div>
              <span className="font-medium">Phone:</span>{" "}
              {form.getValues("phone")}
            </div>
            <div>
              <span className="font-medium">Alt. Phone:</span>{" "}
              {form.getValues("alternatePhone") || "Not provided"}
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2 text-primary">
            Address & Emergency Contact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="col-span-2">
              <span className="font-medium">Address:</span>{" "}
              {form.getValues("address")}, {form.getValues("city")},{" "}
              {form.getValues("state")} {form.getValues("zipCode")}
            </div>
            <div>
              <span className="font-medium">Emergency Contact:</span>{" "}
              {form.getValues("emergencyContactName")}
            </div>
            <div>
              <span className="font-medium">Relationship:</span>{" "}
              {form.getValues("emergencyContactRelationship")}
            </div>
            <div>
              <span className="font-medium">Contact Phone:</span>{" "}
              {form.getValues("emergencyContactPhone")}
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2 text-primary">
            Professional Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Qualification:</span>{" "}
              {form.getValues("highestQualification")}
            </div>
            <div>
              <span className="font-medium">Specialization:</span>{" "}
              {form.getValues("specialization")}
            </div>
            <div>
              <span className="font-medium">Experience:</span>{" "}
              {form.getValues("teachingExperience")}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Subjects:</span>{" "}
              {form
                .getValues("subjectsCanTeach")
                .map((id) => subjects.find((s) => s.id === id)?.label)
                .join(", ")}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Grades:</span>{" "}
              {form
                .getValues("gradesCanTeach")
                .map((g) => `Grade ${g}`)
                .join(", ")}
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2 text-primary">Employment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Position:</span>{" "}
              {form
                .getValues("position")
                ?.split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </div>
            <div>
              <span className="font-medium">Department:</span>{" "}
              {form.getValues("department")}
            </div>
            <div>
              <span className="font-medium">Employment Type:</span>{" "}
              {form
                .getValues("employmentType")
                ?.split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </div>
            <div>
              <span className="font-medium">Joining Date:</span>{" "}
              {form.getValues("joiningDate")
                ? format(form.getValues("joiningDate"), "PPP")
                : "Not provided"}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Please review all information carefully before submitting. You can go
          back to previous steps to make any corrections.
        </p>
      </div>
    </div>
  );
}

export default ReviewInfo;
