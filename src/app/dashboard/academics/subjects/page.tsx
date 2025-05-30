"use client";

import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import SubjectDetails from "@/features/subject/components/SubjectDetailsCard";
import SubjectsCard from "@/features/subject/components/SubjectsCard";
import {
  useGetAllDepartmentsQuery,
  useGetAllSubjectsQuery,
} from "@/redux/services";
import { SubjectType } from "@/types/types";
import { useState } from "react";

function SubjectsPage() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>();

  const {
    isError: subjectsError,
    data: subjects,
    isLoading: subjectsLoading,
  } = useGetAllSubjectsQuery();
  const {
    isError: departmentsError,
    data: departments,
    isLoading: departmentsLoading,
  } = useGetAllDepartmentsQuery();

  if (subjectsLoading || departmentsLoading) return <LoadingComponent />;
  if (departmentsError || subjectsError) return <ErrorComponent />;

  return (
    <div className="flex gap-6 p-4">
      <SubjectsCard
        subjects={subjects}
        setSelectedSubject={setSelectedSubject}
        selectedSubject={selectedSubject}
        departments={departments || []}
      />

      <div className="flex-1">
        <SubjectDetails />
      </div>
    </div>
  );
}

export default SubjectsPage;
