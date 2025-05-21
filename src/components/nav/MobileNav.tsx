"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Bell,
  BookOpen,
  Bus,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  DollarSign,
  FileText,
  GraduationCap,
  Menu,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { ThemeSwitch } from "../ThemeToggle";
import { Button } from "../ui/button";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description:
      "Comprehensive student information system for managing enrollments, profiles, and academic records with ease",
    href: "/features/student-management",
  },
  {
    icon: GraduationCap,
    title: "Academic Management",
    description:
      "Streamline curriculum planning, examinations, grading, and report card generation in one unified system",
    href: "/features/academic-management",
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description:
      "Integrated messaging system with multi-channel notifications for seamless school-wide communication",
    href: "/features/communication",
  },
  {
    icon: DollarSign,
    title: "Financial Management",
    description:
      "Complete fee management system with online payments, invoicing, and comprehensive financial reporting",
    href: "/features/finance",
  },
  {
    icon: ClipboardList,
    title: "Staff Management",
    description:
      "Efficient tools for managing staff records, attendance, performance evaluation, and payroll processing",
    href: "/features/staff-management",
  },
  {
    icon: Bus,
    title: "Transport Management",
    description:
      "Real-time transport tracking, route management, and automated notifications for safe student transportation",
    href: "/features/transport",
  },
  {
    icon: BarChart2,
    title: "Analytics & Reports",
    description:
      "Powerful analytics tools for data-driven decisions with customizable reporting and insights",
    href: "/features/analytics",
  },
  {
    icon: BookOpen,
    title: "Resource Management",
    description:
      "Digital library system, inventory tracking, and facility scheduling in one integrated platform",
    href: "/features/resources",
  },
  {
    icon: CalendarDays,
    title: "Attendance System",
    description:
      "Automated attendance tracking for students and staff with instant notification capabilities",
    href: "/features/attendance",
  },
  {
    icon: FileText,
    title: "Examination Portal",
    description:
      "Complete examination management system from scheduling to result publication with secure access",
    href: "/features/examinations",
  },
  {
    icon: Bell,
    title: "Notice Board",
    description:
      "Digital notice board for announcements, events, and important updates with targeted distribution",
    href: "/features/announcements",
  },
  {
    icon: Shield,
    title: "Security & Access",
    description:
      "Role-based access control with data encryption and secure backups for complete peace of mind",
    href: "/features/security",
  },
];

function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [showFeatures, setShowFeatures] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="text-primary text-left">
            High school Management system
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col py-4">
          <SheetClose asChild>
            <Link href="/" className="hover:bg-accent px-4 py-2 font-medium">
              Home
            </Link>
          </SheetClose>
          <button
            className="hover:bg-accent flex items-center justify-between px-4 py-2 text-left font-medium"
            onClick={() => setShowFeatures(!showFeatures)}
          >
            Features
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform",
                showFeatures && "rotate-180",
              )}
            />
          </button>
          {showFeatures && (
            <div className="space-y-4 px-4 py-2">
              {features.map((feature, index) => (
                <SheetClose asChild key={index}>
                  <Link
                    href={feature.href}
                    className="flex items-start gap-4 py-2"
                  >
                    <div className="bg-muted rounded-md p-2">
                      <feature.icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h5 className="mb-1 text-sm font-medium">
                        {feature.title}
                      </h5>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </Link>
                </SheetClose>
              ))}
            </div>
          )}
          <SheetClose asChild>
            <Link
              href="/pricing"
              className="hover:bg-accent px-4 py-2 font-medium"
            >
              Pricing
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/dashboard"
              className="hover:bg-accent px-4 py-2 font-medium"
            >
              Dashboard
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/how-it-works"
              className="hover:bg-accent px-4 py-2 font-medium"
            >
              How it works
            </Link>
          </SheetClose>
        </div>
        <div className="bg-background absolute right-0 bottom-0 left-0 border-t p-4">
          <div className="grid gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-in">Log in</Link>
              </Button>
            </SheetClose>
          </div>
        </div>
        <div className="p-4">
          <ThemeSwitch />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
