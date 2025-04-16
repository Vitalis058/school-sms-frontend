import SmallTitle from "@/components/SmallTitle";
import { Globe, LineChart, Monitor, Shield, Smartphone } from "lucide-react";
import Image from "next/image";
import React from "react";
import image from "./../../../../public/whyChooseUs.png";

function WhyChooseUs() {
  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-center">
        <SmallTitle title="Why Choose us" className="mb-10 text-center" />
      </div>
      <div className="grid items-center gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="space-y-12">
            <div>
              <h3 className="text-primary mb-2 flex items-center text-xl font-bold">
                <Monitor className="text-primary mr-2 h-5 w-5" />
                Accessible Anywhere
              </h3>
              <p className="text-gray-600">
                Access EduPoa from any device, ensuring seamless school
                management on the go.
              </p>
            </div>

            <div>
              <h3 className="text-primary mb-2 flex items-center text-xl font-bold">
                <Shield className="text-primary mr-2 h-5 w-5" />
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Advanced security measures protect student data and ensure
                privacy compliance.
              </p>
            </div>

            <div>
              <h3 className="text-primary mb-2 flex items-center text-xl font-bold">
                <LineChart className="text-primary mr-2 h-5 w-5" />
                Automated Reports
              </h3>
              <p className="text-gray-600">
                Generate insightful reports for student performance, attendance,
                and financial tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:col-span-1">
          <Image
            src={image}
            alt="Students using EduPoa"
            width={300}
            height={400}
            className="rounded-lg"
          />
        </div>

        <div className="md:col-span-1">
          <div className="space-y-12">
            <div>
              <h3 className="text-primary mb-2 flex items-center text-xl font-bold">
                <code className="text-primary mr-2 inline-flex h-5 w-5 items-center justify-center">
                  &lt;/&gt;
                </code>
                Modern & Intuitive UI
              </h3>
              <p className="text-gray-600">
                A user-friendly interface designed for effortless navigation and
                usability.
              </p>
            </div>

            <div>
              <h3 className="text-primary mb-2 flex items-center text-xl font-bold">
                <Smartphone className="text-primary mr-2 h-5 w-5" />
                Mobile Friendly
              </h3>
              <p className="text-gray-600">
                EduPoa is optimized for mobile devices, allowing access from
                smartphones and tablets.
              </p>
            </div>

            <div>
              <h3 className="text-primary mb-2 flex items-center text-xl font-bold">
                <Globe className="text-primary mr-2 h-5 w-5" />
                Cross-Browser Compatibility
              </h3>
              <p className="text-gray-600">
                Works seamlessly across all modern web browsers for a consistent
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
