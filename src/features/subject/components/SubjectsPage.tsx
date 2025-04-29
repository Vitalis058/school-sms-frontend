// "use client";

// import React, { useState } from "react";
// import SubjectsCard from "./SubjectsCard";
// import { DepartmentType, SubjectType } from "@/types/types";
// import SubjectDetails from "./SubjectDetailsCard";

// interface Subject {
//   subjects: SubjectType[];
//   departments: DepartmentType[];
// }

// function SubjectsPage({ subjects, departments }: Subject) {
//   const [selectedSubject, setSelectedSubject] = useState<SubjectType>();

//   return (
//     <div className="flex gap-6 p-4">
//       <SubjectsCard
//         subjects={subjects}
//         setSelectedSubject={setSelectedSubject}
//         selectedSubject={selectedSubject}
//         departments={departments}
//       />

//       <div className="flex-1">
//         <SubjectDetails />
//       </div>
//     </div>
//   );
// }

// export default SubjectsPage;
