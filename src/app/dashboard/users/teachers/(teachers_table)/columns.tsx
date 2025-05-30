import { TeacherType } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<TeacherType>();

export const teachersColumn = [
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "fullname",
    header: "Full name",
  }),

  columnHelper.accessor("gender", {
    header: "Gender",
  }),

  columnHelper.accessor("email", {
    header: "Email",
  }),

  columnHelper.accessor("phone", {
    header: "Phone Number",
  }),

  columnHelper.accessor("city", {
    header: "Home city",
  }),
];
