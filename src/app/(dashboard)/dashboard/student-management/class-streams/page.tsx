export const dynamic = "force-dynamic";

import { getGradesData } from "@/api_requests/grades_requests";
import { getTeachers } from "@/api_requests/teachers_requests";
import StreamPage from "@/components/streams/StreamsPage";
import React from "react";

async function ClassStreams() {
  const data = await getGradesData();
  const teachers = await getTeachers();

  return (
    <div>
      <StreamPage grade={data} teachers={teachers.data} />
    </div>
  );
}

export default ClassStreams;
