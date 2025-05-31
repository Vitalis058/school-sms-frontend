"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
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
  BarChart3,
  BookOpenCheck,
  Bus,
  ChevronRight,
  CreditCard,
  GraduationCap,
  MessageSquare,
  Package,
  PieChart,
  Settings,
  UserPen,
  Users,
  User,
} from "lucide-react";

import Logo from "@/components/nav/Logo";
import Link from "next/link";
import { usePermissions } from "@/contexts/AuthContext";

function AppSidebar() {
  const {
    canRead,
    canCreate,
    isAdmin,
    isTeacher,
    isStudent,
    isStaff,
  } = usePermissions();

  // Define navigation structure with RBAC permissions
  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      show: true, // Dashboard is accessible to all authenticated users
      items: [{ title: "Overview", url: "/dashboard" }],
    },
    {
      title: "Student Management",
      url: "/dashboard/student-management",
      icon: GraduationCap,
      show: canRead("students"),
      items: [
        { 
          title: "Students", 
          url: "/dashboard/student-management",
          show: canRead("students")
        },
        {
          title: "Class Streams",
          url: "/dashboard/student-management/class-streams",
          show: canRead("streams")
        },
        {
          title: "Attendance",
          url: "/dashboard/student-management/attendance",
          show: canRead("attendance")
        },
        {
          title: "Performance",
          url: "/dashboard/student-management/performance",
          show: canRead("students")
        },
        {
          title: "Fees",
          url: "/dashboard/student-management/fees",
          show: canRead("students") && (isAdmin() || isStaff())
        },
        {
          title: "New Student",
          url: "/dashboard/student-management/new",
          show: canCreate("students")
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Academics",
      url: "/dashboard/academics",
      icon: BookOpenCheck,
      show: canRead("subjects") || canRead("lessons"),
      items: [
        { 
          title: "Streams", 
          url: "/dashboard/academics/streams",
          show: canRead("streams")
        },
        { 
          title: "Subjects", 
          url: "/dashboard/academics/subjects",
          show: canRead("subjects")
        },
        { 
          title: "Time Slots", 
          url: "/dashboard/academics/time-slots",
          show: canRead("lessons")
        },
        { 
          title: "Lessons", 
          url: "/dashboard/academics/lessons",
          show: canRead("lessons")
        },
        { 
          title: "Examinations", 
          url: "/dashboard/academics/examinations",
          show: canRead("subjects") && (isAdmin() || isTeacher())
        },
        { 
          title: "Report Cards", 
          url: "/dashboard/academics/report-cards",
          show: canRead("reports")
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Staff Management",
      url: "/dashboard/staff-management",
      icon: UserPen,
      show: isAdmin() || isStaff(),
      items: [
        { 
          title: "All Staff", 
          url: "/dashboard/staff-management/all-staff",
          show: isAdmin() || isStaff()
        },
        {
          title: "Departments",
          url: "/dashboard/staff-management/departments",
          show: canRead("departments")
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/staff-management/roles-permissions",
          show: isAdmin()
        },
     
        {
          title: "Leave Requests",
          url: "/dashboard/staff-management/leave-requests",
          show: isAdmin() || isStaff()
        },
        { 
          title: "Payroll", 
          url: "/dashboard/staff-management/payroll",
          show: isAdmin()
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Users",
      url: "/dashboard/users/parents",
      icon: Users,
      show: canRead("parents") || canRead("teachers") || canRead("users"),
      items: [
        {
          title: "Parents",
          url: "/dashboard/users/parents",
          show: canRead("parents")
        },
        { 
          title: "Teachers", 
          url: "/dashboard/users/teachers",
          show: canRead("teachers")
        },
        {
          title: "Staff",
          url: "/dashboard/users/staff",
          show: canRead("users") && (isAdmin() || isStaff())
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Communication",
      url: "/dashboard/communication",
      icon: MessageSquare,
      show: isAdmin() || isTeacher() || isStaff(),
      items: [
    
        {
          title: "Announcements",
          url: "/dashboard/communication/announcements",
          show: isAdmin() || isTeacher()
        },
        { 
          title: "Notice Board", 
          url: "/dashboard/communication/notice-board",
          show: true
        },
        {
          title: "Emergency Alerts",
          url: "/dashboard/communication/emergency-alerts",
          show: isAdmin()
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Finance",
      url: "/dashboard/finance",
      icon: CreditCard,
      show: isAdmin() || isStaff(),
      items: [
        { 
          title: "Fee Management", 
          url: "/dashboard/finance/fee-management",
          show: isAdmin() || isStaff()
        },
        { 
          title: "Payments", 
          url: "/dashboard/finance/payments",
          show: isAdmin() || isStaff()
        },
        { 
          title: "Scholarships", 
          url: "/dashboard/finance/scholarships",
          show: isAdmin() || isStaff()
        },
      
      ].filter(item => item.show !== false),
    },
    {
      title: "Transport",
      url: "/dashboard/transport",
      icon: Bus,
      show: isAdmin() || isStaff(),
      items: [
        { 
          title: "Routes", 
          url: "/dashboard/transport/routes",
          show: isAdmin() || isStaff()
        },
        { 
          title: "Tracking", 
          url: "/dashboard/transport/tracking",
          show: isAdmin() || isStaff()
        },
        { 
          title: "Drivers", 
          url: "/dashboard/transport/drivers",
          show: isAdmin()
        },
        { 
          title: "Maintenance", 
          url: "/dashboard/transport/maintenance",
          show: isAdmin()
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Library",
      url: "/dashboard/library",
      icon: Package,
      show: isAdmin() || isStaff() || isTeacher(),
      items: [
        { 
          title: "Books", 
          url: "/dashboard/library/books",
          show: true
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Reports & Analytics",
      url: "/dashboard/reports-analytics",
      icon: PieChart,
      show: canRead("reports"),
      items: [
        {
          title: "Academic Reports",
          url: "/dashboard/reports-analytics/academic-reports",
          show: canRead("reports")
        },
        {
          title: "Financial Reports",
          url: "/dashboard/reports-analytics/financial-reports",
          show: isAdmin() || isStaff()
        },
  
        {
          title: "Analytics Dashboard",
          url: "/dashboard/reports-analytics/analytics-dashboard",
          show: isAdmin() || isStaff()
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      show: isAdmin() || isStaff(),
      items: [
        { 
          title: "School Profile", 
          url: "/dashboard/settings/school-profile",
          show: isAdmin()
        },
        {
          title: "System Settings",
          url: "/dashboard/system/settings",
          show: isAdmin()
        },
        {
          title: "System Health",
          url: "/dashboard/system/health",
          show: isAdmin()
        },
      ].filter(item => item.show !== false),
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
      show: true, // Profile is accessible to all authenticated users
      items: [
        { 
          title: "Account Settings", 
          url: "/dashboard/profile",
          show: true
        },
        { 
          title: "Change Password", 
          url: "/dashboard/profile#change-password",
          show: true
        },
      ],
    },
  ].filter(item => item.show);

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
                <span className="truncate font-semibold">School SMS</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
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
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
