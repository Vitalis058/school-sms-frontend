import SmallTitle from "@/components/SmallTitle";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import student from "./../../../../public/studentImage.jpg";

function About() {
  return (
    <section className="py-10">
      <div className="flex items-center justify-center">
        <SmallTitle title="About Spence School" className="mb-10 text-center" />
      </div>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex-1">
          <h1 className="text-primary mb-6 text-2xl font-bold md:text-3xl">
            Transforming School Management with Innovation
          </h1>
          <p className="text-muted-foreground mb-8">
            Spence-school is an all-in-one student management system designed to
            simplify school operations. From results tracking to report
            generation, we empower educators and administrators to focus on what
            truly matters— education.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Automated Students Performance Tracking",
              "Secure Cloud-Based Storage",
              "Student & Teacher Performance Analytics",
              "Easy Integration with School Systems",
              "Parent-Teacher Communication",
              "24/7 Support & Training",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-between rounded-lg">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-300">
                Developed By
              </p>
              <p className="text-primary font-bold">Spence creations</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 h-full flex-1">
            <Image
              src={student}
              alt="EduPoa Dashboard"
              className="rounded-lg shadow-lg dark:brightness-110 dark:contrast-125"
            />
          </div>
          <div className="bg-accent text-primary-foreground animate-bounce/2 dark:bg-muted absolute right-3 bottom-5 z-20 rounded-lg p-6 shadow-lg dark:text-white">
            <div className="text-4xl font-bold">5+</div>
            <div className="text-sm">Years</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
