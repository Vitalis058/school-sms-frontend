import SmallTitle from "@/components/SmallTitle";
import { BarChart3, Database, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FeatureGrid() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center">
        <SmallTitle title="Our Features" />
      </div>
      <section className="mx-auto py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/student-management" className="group">
            <div className="rounded-lg bg-amber-50 p-6 dark:bg-amber-900/20 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="mb-4 text-amber-500 dark:text-amber-400">
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
              <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Student Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Effortlessly manage student records, admissions, and academic
                details in one centralized system.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/academics/examinations" className="group">
            <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="mb-4 text-blue-500 dark:text-blue-400">
                <BarChart3 className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Grade & Report Generation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track student performance and automatically generate progress
                reports with ease.
              </p>
            </div>
          </Link>

          <Link href="/dashboard/student-management/fees" className="group">
            <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/20 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="mb-4 text-green-500 dark:text-green-400">
                <Database className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Fee Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor student fees, generate invoices, and keep financial
                records organized.
              </p>
            </div>
          </Link>

          <Link href="/contact-us" className="group">
            <div className="rounded-lg bg-pink-50 p-6 dark:bg-pink-900/20 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
              <div className="mb-4 text-pink-500 dark:text-pink-400">
                <MessageCircle className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                Communication System
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Facilitate seamless communication between administrators,
                teachers, and staff.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
