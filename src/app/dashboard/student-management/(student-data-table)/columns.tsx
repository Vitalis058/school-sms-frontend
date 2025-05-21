import { StudentType } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<StudentType>();

export const studentColumns = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "full_name",
    header: "Full name",
  }),

  columnHelper.accessor("admissionNumber", {
    header: "Admission No",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("dateOfBirth", {
    header: "Date of Birth",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("streetAddress", {
    header: "Street",
    cell: (info) => info.getValue(),
  }),
];
