import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

function FAQs() {
  return (
    <section className="mx-auto py-10">
      <div className="primary mb-2 font-medium">Revolutionary</div>
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">
        Frequently asked question
      </h2>
      <p className="mb-8">
        Cannot find the answer you need? Contact our customer service.
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-b">
          <AccordionTrigger className="flex justify-between py-4 text-left">
            <div className="flex items-center">
              <span className="text-primary mr-4">01.</span>
              <span className="font-medium">What services do you offer?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-12 py-4">
            Our comprehensive services include Personal Health Consultations,
            Health Monitoring Programs, Integrated Care Plans, Rehabilitation
            and Recovery services.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b">
          <AccordionTrigger className="flex justify-between py-4 text-left">
            <div className="flex items-center">
              <span className="text-primary mr-4">02.</span>
              <span className="font-medium">How do I book an appointment?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-12 py-4">
            You can book an appointment through our website, mobile app, or by
            calling our customer service line.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-b">
          <AccordionTrigger className="flex justify-between py-4 text-left">
            <div className="flex items-center">
              <span className="text-primary mr-4">03.</span>
              <span className="font-medium">
                What can I expect during my first visit?
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-12 py-4 text-gray-600">
            During your first visit, you&apos;ll undergo a comprehensive health
            assessment to determine your current health status and needs.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-b">
          <AccordionTrigger className="flex justify-between py-4 text-left">
            <div className="flex items-center">
              <span className="text-primary mr-4">04.</span>
              <span className="font-medium">
                How does the Health Monitoring Program work?
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-12 py-4">
            Our Health Monitoring Program uses digital tools and regular
            check-ups to track your health metrics and progress over time.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="border-b">
          <AccordionTrigger className="flex justify-between py-4 text-left">
            <div className="flex items-center">
              <span className="text-primary mr-4">05.</span>
              <span className="font-medium">
                What is an Integrated Care Plan?
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-12 py-4">
            An Integrated Care Plan is a personalized healthcare strategy that
            coordinates various aspects of your health needs into a cohesive
            plan.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

export default FAQs;
