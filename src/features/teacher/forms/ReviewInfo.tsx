import { DepartmentType, SubjectType } from "@/types/types";
import { TeacherEnrollmentType } from "@/utils/validation";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";

type ReviewInfoTypes = {
  form: UseFormReturn<TeacherEnrollmentType>;
  subjects: SubjectType[];
  departments: DepartmentType[];
};

function ReviewInfo({ form, subjects, departments }: ReviewInfoTypes) {
  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold">Review Your Information</h3>
      <div className="space-y-6">
        <div className="rounded-md border p-4">
          <h4 className="text-primary mb-2 font-medium">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
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

        <div className="rounded-md border p-4">
          <h4 className="text-primary mb-2 font-medium">
            Address & Emergency Contact
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
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

        <div className="rounded-md border p-4">
          <h4 className="text-primary mb-2 font-medium">
            Professional Information
          </h4>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
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
                .getValues("subjects")
                .map((id) => subjects.find((s) => s.id === id)?.name)
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

        <div className="rounded-md border p-4">
          <h4 className="text-primary mb-2 font-medium">Employment Details</h4>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
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
              {departments.find(
                (department) =>
                  department.id === form.getValues("departmentId"),
              )?.name || "Not provided"}
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

        <p className="text-muted-foreground text-sm">
          Please review all information carefully before submitting. You can go
          back to previous steps to make any corrections.
        </p>
      </div>
    </div>
  );
}

export default ReviewInfo;
