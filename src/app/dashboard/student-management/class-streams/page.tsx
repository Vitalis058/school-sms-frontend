"use client";

import React, { useEffect, useState } from "react";
import GradesCard from "../../../../features/stream/components/GradesCard";
import StreamsCard from "../../../../features/stream/components/StreamsCard";
import { GradesType } from "@/types/types";
import { useAppSelector } from "@/store/hooks";
import { getGradeStreams } from "@/features/stream/api/streams_requests";

function StreamsPage() {
  const { teachers } = useAppSelector((state) => state.teachers);
  const { grades } = useAppSelector((state) => state.grades);

  const [selectedClass, setSelectedClass] = useState<GradesType | undefined>(
    undefined,
  );
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
        classes={grades}
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

export default StreamsPage;
