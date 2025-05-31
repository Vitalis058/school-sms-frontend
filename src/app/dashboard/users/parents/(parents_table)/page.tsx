"use client";
import DataTable from "@/components/DataTable";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetParentsQuery } from "@/store/api/parentApi";
import { ColumnDef } from "@tanstack/react-table";
import { Guardian } from "@/store/types";

// Define columns directly with proper typing
const parentColumns: ColumnDef<Guardian>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
  },
  {
    accessorKey: "preferredContactMethod",
    header: "Contact Method",
  },
];

function ParentsData() {
  const { data: parentsResponse, isLoading, isError } = useGetParentsQuery({});
  const parents = parentsResponse?.data || [];

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Parents data</h2>

      <DataTable
        columns={parentColumns}
        data={parents}
        dataName="parents"
        link="/dashboard/users/parents/new"
      />
    </div>
  );
}

export default ParentsData;
