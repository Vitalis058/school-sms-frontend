import React from "react";
import { cn } from "@/lib/utils"; // Ensure you have a utility function for class merging
import { Sparkles } from "lucide-react";

function SmallTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "dark:bg-primary inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2",
        className,
      )}
    >
      <span className="text-primary font-semibold dark:text-white">
        <Sparkles />
      </span>
      <span className="text-base font-medium">{title}</span>
    </div>
  );
}

export default SmallTitle;
