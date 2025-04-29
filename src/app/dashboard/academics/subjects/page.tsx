"use client";

import React, { useState } from "react";
import SubjectsCard from "@/features/subject/components/SubjectsCard";
import SubjectDetails from "@/features/subject/components/SubjectDetailsCard";
import { SubjectType } from "@/types/types";
import { useAppSelector } from "@/store/hooks";

function SubjectsPage() {
  const { departments } = useAppSelector((state) => state.department);
  const { subjects } = useAppSelector((state) => state.subjects);

  const [selectedSubject, setSelectedSubject] = useState<SubjectType>();

  return (
    <div className="flex gap-6 p-4">
      <SubjectsCard
        subjects={subjects}
        setSelectedSubject={setSelectedSubject}
        selectedSubject={selectedSubject}
        departments={departments}
      />

      <div className="flex-1">
        <SubjectDetails />
      </div>
    </div>
  );
}

export default SubjectsPage;
