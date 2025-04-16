"use client";

import { useEffect, useState } from "react";

import GradesCard from "@/components/streams/GradesCard";
import StreamsCard from "@/components/streams/StreamsCard";
import { getGradeStreams } from "@/api_requests/streams_requests";

type GradeTypes = {
  grade: {
    students: string;
    streams: string;
    id: string;
    name: string;
  }[];

  teachers: {
    firstName: string;
    id: string;
  }[];
};

function StreamPage({ grade, teachers }: GradeTypes) {
  const [selectedClass, setSelectedClass] = useState<
    GradeTypes["grade"][0] | undefined
  >(undefined);
  const [streams, setStreams] = useState<
    {
      id: string;
      name: string;
      slug: string;
      classTeacher: string;
      students: number;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getStreamsData() {
      if (selectedClass) {
        setLoading(true);
        try {
          const streams = await getGradeStreams(selectedClass.id);
          setStreams(streams.data);
          console.log(streams, "streams");
        } catch (error) {
          console.error("Error fetching streams:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setStreams([]);
      }
    }

    getStreamsData();
  }, [selectedClass]);

  return (
    <div className="flex gap-6 p-4">
      {/* Left sidebar - Classes */}
      <GradesCard
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classes={grade}
      />

      {/* Right content - Streams */}
      <div className="flex-1">
        {selectedClass === undefined ? (
          <p className="text-gray-500">
            Please click on a class to view its streams.
          </p>
        ) : loading ? (
          <p className="text-blue-500">Loading streams...</p>
        ) : (
          <StreamsCard
            selectedClass={selectedClass}
            streams={streams}
            teachers={teachers}
          />
        )}
      </div>
    </div>
  );
}

export default StreamPage;
