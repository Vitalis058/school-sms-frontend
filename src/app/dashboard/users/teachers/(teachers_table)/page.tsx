"use client";
import DataTable from "@/components/DataTable";
import { useAppSelector } from "@/store/hooks";
import { teachersColumn } from "./columns";

function TeachersData() {
  const { teachers } = useAppSelector((state) => state.teachers);

  console.log(teachers);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Teachers data</h2>

      <DataTable
        columns={teachersColumn}
        data={teachers}
        dataName="teachers"
        link="/dashboard/users/teachers/new"
      />
    </div>
  );
}

export default TeachersData;
