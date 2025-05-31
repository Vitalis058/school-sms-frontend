"use client";

import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetGradesQuery, useGetStreamsByGradeQuery } from "@/store/api/academicsApi";
import { useGetTeachersQuery } from "@/store/api/teacherApi";
import { MousePointerClick } from "lucide-react";
import { useState } from "react";
import GradesCard from "../../../../features/stream/components/GradesCard";
import StreamsCard from "../../../../features/stream/components/StreamsCard";

function StreamsPage() {
  const [selectedClass, setSelectedClass] = useState<any>(undefined);

  const {
    isError: teachersError,
    isLoading: teachersIsLoading,
    data: teachersData,
  } = useGetTeachersQuery({});

  const {
    isError: gradesError,
    isLoading: gradesIsLoading,
    data: gradesData,
  } = useGetGradesQuery();

  const {
    data: streamsResponse,
    isLoading: streamsLoading,
    isError: streamsError,
  } = useGetStreamsByGradeQuery(selectedClass?.id || "", {
    skip: !selectedClass?.id,
  });

  // Transform grades data to match legacy component expectations
  const transformedGrades = gradesData?.map(grade => ({
    id: grade.id,
    name: grade.name,
    students: "0", 
    streams: "0"  
  })) || [];

  // Transform streams data - the backend now returns the correct structure
  const transformedStreams = streamsResponse?.map(stream => ({
    id: stream.id,
    name: stream.name,
    slug: stream.slug || stream.name.toLowerCase().replace(/\s+/g, '-'),
    classTeacher: (stream as any).classTeacher || "Not assigned",
    students: (stream as any).students || 0,
    teacherId: (stream as any).teacherId,
  })) || [];

  // Transform teachers data with type assertion to avoid complex type issues
  const transformedTeachers = teachersData?.data?.map(teacher => ({
    ...teacher,
    alternatePhone: teacher.alternatePhone || "",
    certifications: teacher.certifications || "",
    skills: teacher.skills || "",
    languages: teacher.languages || "English",
    additionalNotes: teacher.additionalNotes || "",
    Department: teacher.Department || { id: "", name: "", description: "", _count: { teachers: 0 } },
    subjectsCanTeach: [],
    department: ""
  })) as any[] || [];

  if (teachersError || gradesError || streamsError) return <ErrorComponent />;
  if (teachersIsLoading || gradesIsLoading) return <LoadingComponent />;

  return (
    <div className="flex gap-6 p-4">
      {/* Left sidebar - Classes */}
      <GradesCard
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classes={transformedGrades}
      />

      {/* Right content - Streams */}
      <div className="flex-2/3 sm:flex-1">
        {selectedClass === undefined ? (
          <div className="mt-14 flex flex-col items-center">
            <p>Please click on grade to view its streams </p>
            <MousePointerClick size={30} className="text-primary" />
          </div>
        ) : (
          <StreamsCard
            selectedClass={selectedClass}
            streams={transformedStreams}
            teachers={transformedTeachers}
          />
        )}
      </div>
    </div>
  );
}

export default StreamsPage;
