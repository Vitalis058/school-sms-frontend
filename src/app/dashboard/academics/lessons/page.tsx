"use client";
import Lessons from "@/features/lessons/components/Lessons";
import LessonsStreamsCard from "@/features/lessons/components/LessonsGradesCard";
import { useAppSelector } from "@/store/hooks";
import { StreamsType } from "@/types/types";
import { MousePointerClick } from "lucide-react";
import React, { useState } from "react";

function Timetable() {
  const { streams } = useAppSelector((state) => state.streams);
  const [selectedStream, setSelectedStream] = useState<
    StreamsType | undefined
  >();

  //use effect to fetch the lessons when a new steam is selected

  return (
    <section className="flex gap-10 p-5">
      <LessonsStreamsCard
        setSelectedStream={setSelectedStream}
        streams={streams}
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
