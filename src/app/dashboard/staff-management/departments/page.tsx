"use client";

import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { getDepartment } from "@/features/department/api/department_requests";
import DepartmentCard from "@/features/department/components/DepartmentCard";
import DepartmentDetails from "@/features/department/components/DepartmentDetails";
import { useGetAllDepartmentsQuery } from "@/redux/services";
import { DepartmentType } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function DepartmentsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    DepartmentType | undefined
  >();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | undefined
  >();

  useEffect(() => {
    async function fetchDepartment() {
      setIsLoading(true);
      const department = await getDepartment(selectedDepartmentId);
      setSelectedDepartment(department);
      setIsLoading(false);
    }
    fetchDepartment();
  }, [selectedDepartmentId]);

  const {
    isLoading: departmentsLoading,
    data: departments,
    isError,
  } = useGetAllDepartmentsQuery();

  if (isError) return <ErrorComponent />;
  if (departmentsLoading) return <LoadingComponent />;

  return (
    <div className="flex gap-6 p-4">
      <DepartmentCard
        setSelectedDepartmentId={setSelectedDepartmentId}
        departments={departments}
        selectedDepartmentId={selectedDepartmentId}
      />
      {isLoading ? (
        <div className="mx-auto flex h-28 items-center justify-center">
          <Loader2 size={20} className="text-primary animate-spin" />
        </div>
      ) : (
        <div className="flex-1">
          <DepartmentDetails department={selectedDepartment} />
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;
