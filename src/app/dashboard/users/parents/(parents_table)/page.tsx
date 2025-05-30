"use client";
import DataTable from "@/components/DataTable";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetAllParentsQuery } from "@/redux/services";
import { parent_column } from "./ParentColumn";

function ParentsData() {
  const { data: parents, isLoading, isError } = useGetAllParentsQuery();

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Parents data</h2>

      <DataTable
        columns={parent_column}
        data={parents || []}
        dataName="parents"
        link="/dashboard/users/parents/new"
      />
    </div>
  );
}

export default ParentsData;
