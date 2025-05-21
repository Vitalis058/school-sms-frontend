"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

import {
  BarChart2,
  Bell,
  BookOpen,
  Bus,
  CalendarDays,
  ClipboardList,
  DollarSign,
  FileText,
  GraduationCap,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";
import { ThemeSwitch } from "../ThemeToggle";
import Logo from "./Logo";
import MobileNav from "./MobileNav";

const navLinkClass =
  "group inline-flex h-9 items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors dark:text-muted-foreground dark:hover:text-white";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky z-50 px-2 ${scrolled ? "top-2" : ""}`}>
      <header
        className={`sticky top-0 z-50 mx-auto w-[98%] rounded-full px-5 sm:w-full ${
          scrolled
            ? "supports-[backdrop-filter]:bg-foreground/20 backdrop-blur"
            : ""
        }`}
      >
        <div className="container mx-auto flex h-20 max-w-[1300px] items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo height={60} width={60} />
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={`${navLinkClass}`}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`${navLinkClass} bg-none`}>
                    Features
                  </NavigationMenuTrigger>
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
                    <NavigationMenuLink className={navLinkClass}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/how-it-works" legacyBehavior passHref>
                    <NavigationMenuLink className={navLinkClass}>
                      How it works
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <Button variant="outline" className="border-primary rounded-full">
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
