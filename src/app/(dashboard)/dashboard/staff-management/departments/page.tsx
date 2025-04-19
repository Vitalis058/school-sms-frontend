import { getDepartments } from "@/api_requests/department_requests";
import DepartmentsPage from "@/components/departments/DepartmentsPage";
import React from "react";

async function page() {
  const departments = await getDepartments();

  return (
    <div>
      <DepartmentsPage departments={departments} />
    </div>
  );
}

export default page;
