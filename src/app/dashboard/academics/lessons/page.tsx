"use client";
import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import Lessons from "@/features/lessons/components/Lessons";
import LessonsStreamsCard from "@/features/lessons/components/LessonsGradesCard";
import { useGetAllStreamsQuery } from "@/redux/services";
import { StreamsType } from "@/types/types";
import { MousePointerClick } from "lucide-react";
import { useState } from "react";

function Timetable() {
  const [selectedStream, setSelectedStream] = useState<
    StreamsType | undefined
  >();
  const { isError, data: streams, isLoading } = useGetAllStreamsQuery();

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;
  //use effect to fetch the lessons when a new steam is selected

  return (
    <section className="flex gap-10 p-5">
      <LessonsStreamsCard
        setSelectedStream={setSelectedStream}
        streams={streams || []}
        selectedStream={selectedStream}
      />

      {selectedStream ? (
        <Lessons stream={selectedStream} />
      ) : (
        <div className="mx-auto mt-12 flex flex-col items-center text-center">
          <MousePointerClick size={30} className="text-primary" />
          <p className="text-sm">Click on a class to view the lessons</p>
        </div>
      )}
    </section>
  );
}

export default Timetable;
