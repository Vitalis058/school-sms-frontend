import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

function Hero() {
  return (
    <main className="to-primary/60 min-h-[87vh] bg-gradient-to-br from-white">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="mb-12 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
            <span className="text-primary font-semibold">
              <GraduationCap />
            </span>
            <span className="font-medium text-black">
              Welcome to Spence <span className="text-primary">School</span>
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Streamline Your School Operations with Spence{" "}
            <span className="text-primary">School</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Spence school simplifies school administration by offering powerful
            tools for student records, attendance, timetables, and more all in
            one easy-to-use platform.
          </p>

          <div className="z-50 flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button
              className="bg rounded-full backdrop-blur-md"
              asChild
              variant={"outline"}
            >
              <Link href="/contact-us">Get Started</Link>
            </Button>

            <Button className="rounded-full" asChild>
              <Link href="/features">
                See features <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Hero;
