"use client";

import React from "react";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpenCheck,
  Bus,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  GraduationCap,
  LogOut,
  MessageSquare,
  Package,
  PieChart,
  Settings,
  Sparkles,
  UserPen,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/nav/Logo";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      items: [{ title: "Overview", url: "/dashboard" }],
    },
    {
      title: "Student Management",
      url: "/dashboard/student-management",
      icon: GraduationCap,
      items: [
        { title: "Student Directory", url: "/dashboard/student-management" },
        {
          title: "streams",
          url: "/dashboard/student-management/class-streams",
        },
        {
          title: "Attendance",
          url: "/dashboard/student-management/attendance",
        },
        {
          title: "Performance",
          url: "/dashboard/student-management/performance",
        },
        { title: "Fees", url: "/dashboard/student-management/fees" },
      ],
    },
    {
      title: "Academics",
      url: "/dashboard/academics",
      icon: BookOpenCheck,
      items: [
        { title: "Curriculum", url: "/dashboard/academics/curriculum" },
        { title: "Subjects", url: "/dashboard/academics/subjects" },
        { title: "Lessons", url: "/dashboard/academics/lessons" },
        { title: "Assignments", url: "/dashboard/academics/assignments" },
        { title: "Examinations", url: "/dashboard/academics/examinations" },
        { title: "Report Cards", url: "/dashboard/academics/report-cards" },
      ],
    },

    {
      title: "Staff Management",
      url: "/dashboard/staff-management",
      icon: UserPen,
      items: [
        { title: "All Staff", url: "/dashboard/staff-management/all-staff" },
        {
          title: "Departments",
          url: "/dashboard/staff-management/departments",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/staff-management/roles-permissions",
        },
        { title: "Attendance", url: "/dashboard/staff-management/attendance" },
        {
          title: "Leave Requests",
          url: "/dashboard/staff-management/leave-requests",
        },
        { title: "Payroll", url: "/dashboard/staff-management/payroll" },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users/parents",
      icon: Users,
      items: [
        {
          title: "Parents",
          url: "/dashboard/users/parents",
        },
        { title: "Teachers", url: "/dashboard/users/teachers" },
      ],
    },
    {
      title: "Communication",
      url: "/dashboard/communication",
      icon: MessageSquare,
      items: [
        { title: "Messages", url: "/dashboard/communication/messages" },
        {
          title: "Announcements",
          url: "/dashboard/communication/announcements",
        },
        { title: "Notice Board", url: "/dashboard/communication/notice-board" },
        {
          title: "Emergency Alerts",
          url: "/dashboard/communication/emergency-alerts",
        },
      ],
    },
    {
      title: "Finance",
      url: "/dashboard/finance",
      icon: CreditCard,
      items: [
        { title: "Fee Management", url: "/dashboard/finance/fee-management" },
        { title: "Payments", url: "/dashboard/finance/payments" },
        { title: "Scholarships", url: "/dashboard/finance/scholarships" },
        { title: "Reports", url: "/dashboard/finance/reports" },
      ],
    },
    {
      title: "Transport",
      url: "/dashboard/transport",
      icon: Bus,
      items: [
        { title: "Routes", url: "/dashboard/transport/routes" },
        { title: "Tracking", url: "/dashboard/transport/tracking" },
        { title: "Drivers", url: "/dashboard/transport/drivers" },
        { title: "Maintenance", url: "/dashboard/transport/maintenance" },
      ],
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: Package,
      items: [
        { title: "Library", url: "/dashboard/resources/library" },
        { title: "Inventory", url: "/dashboard/resources/inventory" },
        { title: "Facilities", url: "/dashboard/resources/facilities" },
        { title: "Assets", url: "/dashboard/resources/assets" },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "/dashboard/reports-analytics",
      icon: PieChart,
      items: [
        {
          title: "Academic Reports",
          url: "/dashboard/reports-analytics/academic-reports",
        },
        {
          title: "Financial Reports",
          url: "/dashboard/reports-analytics/financial-reports",
        },
        {
          title: "Custom Reports",
          url: "/dashboard/reports-analytics/custom-reports",
        },
        {
          title: "Analytics Dashboard",
          url: "/dashboard/reports-analytics/analytics-dashboard",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        { title: "School Profile", url: "/dashboard/settings/school-profile" },
        {
          title: "User Management",
          url: "/dashboard/settings/user-management",
        },
        {
          title: "System Settings",
          url: "/dashboard/settings/system-settings",
        },
        {
          title: "Backup & Security",
          url: "/dashboard/settings/backup-security",
        },
      ],
    },
  ],
};

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Logo width={60} height={60} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Spence Shool SMS</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                // defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="text-primary" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
