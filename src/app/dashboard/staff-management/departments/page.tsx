"use client";

import DepartmentCard from "@/features/department/components/DepartmentCard";
import DepartmentDetails from "@/features/department/components/DepartmentDetails";
import { useAppSelector } from "@/store/hooks";
import { DepartmentType } from "@/types/types";
import { useState } from "react";

function DepartmentsPage() {
  const { departments } = useAppSelector((state) => state.department);

  console.log(departments);

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
        <DepartmentDetails department={selectedDepartment} />
      </div>
    </div>
  );
}

export default DepartmentsPage;
