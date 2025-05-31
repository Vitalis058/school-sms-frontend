"use client";
import DataTable from "@/components/DataTable";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetTeachersQuery } from "@/store/api/teacherApi";
import { ColumnDef } from "@tanstack/react-table";
import { Teacher } from "@/store/types";

// Define columns directly with proper typing
const teacherColumns: ColumnDef<Teacher>[] = [
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "city",
    header: "Home City",
  },
];

function TeachersData() {
  const { isError, data: teachersResponse, isLoading } = useGetTeachersQuery({});
  const teachers = teachersResponse?.data || [];

  if (isError) return <ErrorComponent />;
  if (isLoading) return <LoadingComponent />;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Teachers data</h2>

      <DataTable
        columns={teacherColumns}
        data={teachers}
        dataName="teachers"
        link="/dashboard/users/teachers/new"
      />
    </div>
  );
}

export default TeachersData;
