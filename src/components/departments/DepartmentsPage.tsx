"use client";

import React, { useState } from "react";
import DepartmentCard from "./DepartmentCard";
import { DepartmentType } from "@/types/types";
import DepartmentDetails from "./DepartmentDetails";

interface Department {
  departments: DepartmentType[];
}

function DepartmentsPage({ departments }: Department) {
  const [selectedDepartment, setSelectedDepartment] = useState<
    DepartmentType | undefined
  >();

  return (
    <div className="flex gap-6 p-4">
      <DepartmentCard
        setSelectedDepartment={setSelectedDepartment}
        departments={departments}
        selectedDepartment={selectedDepartment}
      />

      <div className="flex-1">
        <DepartmentDetails />
      </div>
    </div>
  );
}

export default DepartmentsPage;
