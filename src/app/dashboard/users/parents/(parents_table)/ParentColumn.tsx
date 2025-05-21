import { ParentType } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<ParentType>();

export const parent_column = [
  columnHelper.accessor("name", {
    header: "Name",
  }),

  columnHelper.accessor("phone", {
    header: "Phone number",
  }),

  columnHelper.accessor("email", {
    header: "Email",
  }),

  columnHelper.accessor("relationship", {
    header: "Relationship",
  }),

  columnHelper.accessor("preferredContactMethod", {
    header: "Contact Method",
  }),
];
