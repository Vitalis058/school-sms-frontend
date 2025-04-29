"use client";

import React, { useState } from "react";
import { DepartmentType } from "@/types/types";
import DepartmentCard from "@/features/department/components/DepartmentCard";
import DepartmentDetails from "@/features/department/components/DepartmentDetails";
import { useAppSelector } from "@/store/hooks";

function DepartmentsPage() {
  const { departments } = useAppSelector((state) => state.department);

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
