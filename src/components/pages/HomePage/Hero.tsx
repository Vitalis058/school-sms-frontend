import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

function Hero() {
  return (
    <main className="from-primary to-gray-white min-h-[87vh] rounded-2xl bg-gradient-to-b dark:to-[#121212]">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="mb-12 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 opacity-80 backdrop-blur-2xl dark:border-gray-700 dark:bg-white/10">
            <span className="font-semibold text-white">
              <GraduationCap />
            </span>
            <span className="text-foreground font-medium">
              Welcome to Spence{" "}
              <span className="font-bold text-white">School</span>
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-4xl">
            Streamline Your School Operations with Spence{" "}
            <span className="text-primary">School</span>
          </h1>
          <p className="text-card-foreground mx-auto max-w-2xl text-sm md:text-lg">
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
              <Link href="/sign-in">Get Started</Link>
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
