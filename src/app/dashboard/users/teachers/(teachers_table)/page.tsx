"use client";
import DataTable from "@/components/DataTable";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetAllTeachersQuery } from "@/redux/services";
import { teachersColumn } from "./columns";

function TeachersData() {
  const { isError, data: teachers, isLoading } = useGetAllTeachersQuery();

  if (isError) return <ErrorComponent />;
  if (isLoading) return <LoadingComponent />;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Teachers data</h2>

      <DataTable
        columns={teachersColumn}
        data={teachers || []}
        dataName="teachers"
        link="/dashboard/users/teachers/new"
      />
    </div>
  );
}

export default TeachersData;
