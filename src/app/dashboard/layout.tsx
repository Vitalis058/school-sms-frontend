"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type React from "react";
import AppSidebar from "./AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeSwitch } from "@/components/ThemeToggle";
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth, usePermissions } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { isAdmin } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard layout: Auth state check", { 
      isLoading, 
      isAuthenticated, 
      hasUser: !!user,
      userRole: user?.role 
    });
    
    // Only redirect if we're sure authentication has been checked
    if (!isLoading && !isAuthenticated) {
      console.log("Dashboard: Redirecting to sign-in", { isLoading, isAuthenticated, user });
      router.push("/sign-in");
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "TEACHER":
        return "default";
      case "STUDENT":
        return "secondary";
      case "STAFF":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <div className="flex h-16 items-center justify-between gap-4 border-b px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-5">
            <ThemeSwitch />

            <DropdownMenu>
              <DropdownMenuTrigger asChild name="user">
                <Avatar className="h-9 w-9 rounded-lg cursor-pointer">
                  <AvatarFallback className="rounded-full">
                    {getUserInitials(user.username)}
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
                      <AvatarFallback className="rounded-lg">
                        {getUserInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.username}
                      </span>
                      <span className="truncate text-xs">
                        {user.email}
                      </span>
                      <Badge 
                        variant={getRoleBadgeVariant(user.role)} 
                        className="mt-1 w-fit text-xs"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin() && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Sparkles />
                        Admin Panel
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                  </>
                )}
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
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
