import { getDepartments } from "@/api_requests/department_requests";
import { getAllSubjects } from "@/api_requests/subjects_requests";
import TeacherEnrollmentForm from "@/components/Forms/dashboard/teachers/MainForm";
import { DepartmentType, SubjectType } from "@/types/types";
import React from "react";

async function page() {
  const departments: DepartmentType[] = await getDepartments();
  const subjects: SubjectType[] = await getAllSubjects();

  return (
    <div>
      <TeacherEnrollmentForm departments={departments} subjects={subjects} />
    </div>
  );
}

export default page;
