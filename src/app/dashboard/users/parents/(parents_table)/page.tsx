"use client";
import DataTable from "@/components/DataTable";
import { useAppSelector } from "@/store/hooks";
import { parent_column } from "./ParentColumn";

function ParentsData() {
  const { parents } = useAppSelector((state) => state.parents);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Parents data</h2>

      <DataTable
        columns={parent_column}
        data={parents}
        dataName="parents"
        link="/dashboard/users/parents/new"
      />
    </div>
  );
}

export default ParentsData;
