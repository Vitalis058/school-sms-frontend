import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import student from "./../../../../public/studentImage.jpg";
import SmallTitle from "@/components/SmallTitle";

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
          <p className="text-accent-foreground mb-8">
            EduPoa is an all-in-one student management system designed to
            simplify school operations. From results tracking to report
            generation, we empower educators and administrators to focus on what
            truly matters— education.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
              <p className="text-gray-700">
                Automated StudentSs Performance Tracking
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
              <p className="text-gray-700">Secure Cloud-Based Storage</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
              <p className="text-gray-700">
                Student & Teacher Performance Analytics
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
              <p className="text-gray-700">
                Easy Integration with School Systems
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
              <p className="text-gray-700">Parent-Teacher Communication</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-primary h-6 w-6 flex-shrink-0" />
              <p className="text-gray-700">24/7 Support & Training</p>
            </div>
          </div>

          <div className="mt-10 flex justify-between rounded-lg border-gray-200">
            <div>
              <p className="font-medium">Developed By</p>
              <p className="text-primary font-bold">Spence creations</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10 h-full flex-1">
            <Image
              src={student}
              alt="EduPoa Dashboard"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="bg-accent animate-bounce/2 absolute bottom-5 right-3 z-20 rounded-lg p-6 shadow-lg">
            <div className="text-4xl font-bold">5+</div>
            <div className="text-sm">Years</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
