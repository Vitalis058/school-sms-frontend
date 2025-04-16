import SmallTitle from "@/components/SmallTitle";
import { BarChart3, MessageCircle, Database } from "lucide-react";

export default function FeatureGrid() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center">
        <SmallTitle title="Our Features" />
      </div>
      <section className="mx-auto py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-amber-50 p-6">
            <div className="mb-4 text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Student Management
            </h3>
            <p className="text-gray-600">
              Effortlessly manage student records, admissions, and academic
              details in one centralized system.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-6">
            <div className="mb-4 text-blue-500">
              <BarChart3 className="h-12 w-12" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Grade & Report Generation
            </h3>
            <p className="text-gray-600">
              Track student performance and automatically generate progress
              reports with ease.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-6">
            <div className="mb-4 text-green-500">
              <Database className="h-12 w-12" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Fee Tracking
            </h3>
            <p className="text-gray-600">
              Monitor student fees, generate invoices, and keep financial
              records organized.
            </p>
          </div>

          <div className="rounded-lg bg-pink-50 p-6">
            <div className="mb-4 text-pink-500">
              <MessageCircle className="h-12 w-12" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Communication System
            </h3>
            <p className="text-gray-600">
              Facilitate seamless communication between administrators,
              teachers, and staff.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
