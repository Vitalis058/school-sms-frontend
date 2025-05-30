"use client";

import ErrorComponent from "@/components/ErrorComponent";
import LoadingComponent from "@/components/LoadingComponent";
import { getGradeStreams } from "@/features/stream/api/streams_requests";
import { useGetAllGradesQuery, useGetAllTeachersQuery } from "@/redux/services";
import { GradesType } from "@/types/types";
import { Loader2, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";
import GradesCard from "../../../../features/stream/components/GradesCard";
import StreamsCard from "../../../../features/stream/components/StreamsCard";

function StreamsPage() {
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
          const streams = await getGradeStreams(selectedClass.id); // update ukitumia redux query
          setStreams(streams);
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

  const {
    isError: teachersError,
    isLoading: teachersIsLoading,
    data: teachersData,
  } = useGetAllTeachersQuery();

  const {
    isError: gradesError,
    isLoading: gradesIsLoading,
    data: gradesData,
  } = useGetAllGradesQuery();

  if (teachersError || gradesError) return <ErrorComponent />;
  if (teachersIsLoading || gradesIsLoading) return <LoadingComponent />;

  return (
    <div className="flex gap-6 p-4">
      {/* Left sidebar - Classes */}
      <GradesCard
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classes={gradesData}
      />

      {/* Right content - Streams */}
      <div className="flex-2/3 sm:flex-1">
        {selectedClass === undefined ? (
          <div className="mt-14 flex flex-col items-center">
            <p>Please click on grade to view its streams </p>
            <MousePointerClick size={30} className="text-primary" />
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-2 py-4 text-blue-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-sm font-medium">Loading streams...</p>
          </div>
        ) : (
          <StreamsCard
            selectedClass={selectedClass}
            streams={streams}
            teachers={teachersData || []}
          />
        )}
      </div>
    </div>
  );
}

export default StreamsPage;
