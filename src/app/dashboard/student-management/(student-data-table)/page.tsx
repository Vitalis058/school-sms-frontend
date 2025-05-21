"use client";

import DataTable from "@/components/DataTable";
import { getStudents } from "@/features/student/api/student_requests";
import { useQuery } from "@tanstack/react-query";
import { studentColumns } from "./columns";

export default function StudentsPage() {
  const response = useQuery({
    queryKey: ["fetching-students"],
    queryFn: async () => {
      const res = await getStudents();
      return res.data;
    },
  });

  if (response.isFetching) {
    return <div>loading</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Students List</h2>
      <DataTable
        columns={studentColumns}
        data={response.data}
        dataName="students"
        link="/dashboard/student-management/new"
      />
    </div>
  );
}
