"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  DollarSign,
  Bell,
  Users,
  GraduationCap,
  MessageSquare,
  ClipboardList,
  Bus,
  BarChart2,
  BookOpen,
  CalendarDays,
  FileText,
  Shield,
} from "lucide-react";

import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { ThemeSwitch } from "../ThemeToggle";

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

export default function MainNav() {
  return (
    <nav>
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto flex h-20 max-w-[1300px] items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo height={80} width={80} />
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-4">
                      <div className="mb-4 flex items-center justify-between border-b pb-2">
                        <h4 className="text-lg font-medium">Features</h4>
                        <Link
                          href="/features"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        {features.map((feature, index) => (
                          <Link
                            key={index}
                            href={`/feature/${feature.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="group block"
                          >
                            <div className="flex items-start gap-4">
                              <div className="bg-muted group-hover:bg-muted/80 rounded-md p-2">
                                <feature.icon className="h-6 w-6 text-blue-500" />
                              </div>
                              <div>
                                <h5 className="mb-1 font-medium group-hover:text-blue-500">
                                  {feature.title}
                                </h5>
                                <p className="text-muted-foreground line-clamp-2 text-sm">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="mb-1 font-medium">Get started</h4>
                            <p className="text-muted-foreground text-sm">
                              Their food sources have decreased, and their
                              numbers
                            </p>
                          </div>
                          <Button variant="secondary">Get started</Button>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink className="bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/how-it-works" legacyBehavior passHref>
                    <NavigationMenuLink className="bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      How it works
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <Button variant="outline" className="rounded-full border-primary">
              <Link href={"/sign-in"}>Login</Link>
            </Button>
            <ThemeSwitch />
          </div>

          <MobileNav />
        </div>
      </header>
    </nav>
  );
}
