"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type React from "react";
import { useEffect, useState } from "react";
import AppSidebar from "./AppSidebar";
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Bell,
  CreditCard,
  Loader2,
  LogOut,
  Plus,
  Sparkles,
  User,
} from "lucide-react";
import { ThemeSwitch } from "@/components/ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTeachers } from "@/features/teacher/slice";
import { fetchGrades } from "@/features/grade/slice";
import { fetchDepartments } from "@/features/department/slice";
import { fetchSubjects } from "@/features/subject/slice";
import { fetchParents } from "@/features/parent/slice";
import { fetchStreams } from "@/features/stream/slice";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchGrades());
    dispatch(fetchDepartments());
    dispatch(fetchSubjects());
    dispatch(fetchParents());
    dispatch(fetchStreams());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { status: teachersStatus } = useAppSelector((state) => state.teachers);
  const { status: gradesStatus } = useAppSelector((state) => state.grades);

  const isLoading = teachersStatus === "pending" || gradesStatus === "pending";

  if (isLoading) {
    return (
      <p className="mt-10 flex justify-center-safe">
        <Loader2 className="text-primary animate-spin text-center" />
      </p>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />

          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <ThemeSwitch />
          <Button variant="outline" size="icon">
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add new</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild name="user">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage
                  src={data.user.avatar || "/placeholder.svg"}
                  alt={data.user.name}
                />
                <AvatarFallback className="rounded-full">
                  <User />
                </AvatarFallback>
              </Avatar>
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
                      src={data.user.avatar || "/placeholder.svg"}
                      alt={data.user.name}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
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
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
