"use client";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex items-center">
      <div className="flex h-9 items-center rounded-full border border-primary p-1 text-muted-foreground">
        <button
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            theme === "light"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4" />
          <span className="sr-only">Light</span>
        </button>

        <button
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            theme === "system"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
          onClick={() => setTheme("system")}
        >
          <Monitor className="h-4 w-4" />
          <span className="sr-only">System</span>
        </button>

        <button
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            theme === "dark"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground"
          )}
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4" />
          <span className="sr-only">Dark</span>
        </button>
      </div>
    </div>
  );
}
