import { getDepartments } from "@/api_requests/department_requests";
import { getAllSubjects } from "@/api_requests/subjects_requests";
import SubjectsPage from "@/components/subjects/SubjectsPage";
import { DepartmentType, SubjectType } from "@/types/types";
import React from "react";

async function page() {
  const subjects: SubjectType[] = await getAllSubjects();
  const departments: DepartmentType[] = await getDepartments();

  return (
    <div>
      <SubjectsPage subjects={subjects} departments={departments} />
    </div>
  );
}

export default page;
