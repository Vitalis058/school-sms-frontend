"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarDays,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import Link from "next/link";
import {
  useGetLeaveRequestsQuery,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "@/store/api/leaveApi";
import { usePermissions } from "@/contexts/AuthContext";

const leaveTypeColors: Record<LeaveType, string> = {
  SICK: "bg-red-100 text-red-800",
  ANNUAL: "bg-blue-100 text-blue-800",
  PERSONAL: "bg-purple-100 text-purple-800",
  MATERNITY: "bg-pink-100 text-pink-800",
  PATERNITY: "bg-indigo-100 text-indigo-800",
  EMERGENCY: "bg-orange-100 text-orange-800",
};

export default function LeaveCalendarWidget() {
  const { isAdmin, isTeacher, isStaff } = usePermissions();
  
  // Only show to admins and staff who can manage schedules
  if (!isAdmin() && !isStaff()) {
    return null;
  }

  const { data: leaveRequestsData, isLoading } = useGetLeaveRequestsQuery({
    status: "APPROVED",
    pageSize: 50, // Get more requests to show in calendar
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Staff Leave Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const approvedLeaves = leaveRequestsData?.data || [];
  
  // Get current week
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  // Get leaves for current week
  const getLeavesForDate = (date: Date) => {
    return approvedLeaves.filter((leave) => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  // Get upcoming leaves (next 7 days)
  const upcomingLeaves = approvedLeaves.filter((leave) => {
    const startDate = new Date(leave.startDate);
    const nextWeek = addDays(today, 7);
    return startDate >= today && startDate <= nextWeek;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Staff Leave Calendar
        </CardTitle>
        <Link href="/dashboard/staff-management/leave-requests">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Week View */}
        <div>
          <h4 className="text-sm font-medium mb-3">This Week</h4>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => {
              const leavesForDay = getLeavesForDate(day);
              const isToday = isSameDay(day, today);
              
              return (
                <div
                  key={index}
                  className={`p-2 border rounded-lg text-center ${
                    isToday ? "bg-primary" : "bg-gray-800"
                  }`}
                >
                  <div className="text-xs font-medium">
                    {format(day, "EEE")}
                  </div>
                  <div className={`text-sm ${isToday ? "font-bold" : ""}`}>
                    {format(day, "dd")}
                  </div>
                  
                  {leavesForDay.length > 0 && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full mx-auto"></div>
                      <div className="text-xs text-red-600 mt-1">
                        {leavesForDay.length}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Leaves */}
        {upcomingLeaves.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Upcoming Leaves</h4>
              <Badge variant="outline" className="text-xs">
                {upcomingLeaves.length} scheduled
              </Badge>
            </div>
            
            <div className="space-y-2">
              {upcomingLeaves.slice(0, 3).map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-2 bg-gray-500 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {leave.user.firstName} {leave.user.lastName}
                      </span>
                      <Badge className={`text-xs ${leaveTypeColors[leave.leaveType]}`}>
                        {leave.leaveType}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(leave.startDate), "MMM dd")} - {format(new Date(leave.endDate), "MMM dd")}
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingLeaves.length > 3 && (
                <div className="text-center">
                  <Link href="/dashboard/staff-management/leave-requests?status=APPROVED">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View {upcomingLeaves.length - 3} more
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Staff Availability Alert */}
        {approvedLeaves.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>
                {approvedLeaves.filter(leave => {
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  return today >= startDate && today <= endDate;
                }).length} staff members on leave today
              </span>
            </div>
          </div>
        )}

        {/* No upcoming leaves */}
        {upcomingLeaves.length === 0 && (
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming leaves scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 