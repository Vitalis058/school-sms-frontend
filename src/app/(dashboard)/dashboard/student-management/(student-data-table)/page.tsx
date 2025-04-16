"use client";

import { getStudents } from "@/api_requests/student_requests";
import { studentColumns } from "./columns";
import StudentsDataTable from "./StudentDataTable";
import { useQuery } from "@tanstack/react-query";

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
      <h2 className="text-xl font-bold mb-4">Students List</h2>
      <StudentsDataTable columns={studentColumns} data={response.data} />
    </div>
  );
}
