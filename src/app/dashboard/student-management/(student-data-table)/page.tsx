"use client";
import DataTable from "@/components/DataTable";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetAllStudentsQuery } from "@/redux/services";
import { studentColumns } from "./columns";

export default function StudentsPage() {
  const { isError, data, isLoading } = useGetAllStudentsQuery();

  if (isLoading) return <LoadingComponent />;

  if (isError) return <ErrorComponent />;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Students List</h2>
      <DataTable
        columns={studentColumns}
        data={data || []}
        dataName="students"
        link="/dashboard/student-management/new"
      />
    </div>
  );
}
