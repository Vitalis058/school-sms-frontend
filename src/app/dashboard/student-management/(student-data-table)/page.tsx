"use client";
import DataTable from "@/components/DataTable";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetStudentsQuery } from "@/store/api/studentApi";
import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/store/types";

// Define columns directly with proper typing
const studentColumns: ColumnDef<Student>[] = [
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "admissionNumber",
    header: "Admission No",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: "streetAddress",
    header: "Address",
  },
];

export default function StudentsPage() {
  const { isError, data: studentsResponse, isLoading } = useGetStudentsQuery({});
  const students = studentsResponse?.data || [];

  if (isLoading) return <LoadingComponent />;

  if (isError) return <ErrorComponent />;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Students List</h2>
      <DataTable
        columns={studentColumns}
        data={students}
        dataName="students"
        link="/dashboard/student-management/new"
      />
    </div>
  );
}
