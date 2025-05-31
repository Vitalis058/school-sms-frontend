"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Check,
  X,
  FileText,
  Plus,
  Eye,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  useGetLeaveStatisticsQuery,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "@/store/api/leaveApi";
import { usePermissions } from "@/contexts/AuthContext";
import LoadingComponent from "@/components/LoadingComponent";

const leaveTypeLabels: Record<LeaveType, string> = {
  SICK: "Sick",
  ANNUAL: "Annual",
  PERSONAL: "Personal",
  MATERNITY: "Maternity",
  PATERNITY: "Paternity",
  EMERGENCY: "Emergency",
};

const statusColors: Record<LeaveStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function LeaveRequestsWidget() {
  const { isAdmin, isTeacher, isStaff } = usePermissions();
  const { data: statisticsData, isLoading } = useGetLeaveStatisticsQuery();

  // Only show widget to staff, teachers, and admins
  if (!isAdmin() && !isTeacher() && !isStaff()) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Leave Requests
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

  const statistics = statisticsData?.data;

  if (!statistics) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Leave Requests
        </CardTitle>
        <Link href="/dashboard/staff-management/leave-requests">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-medium">{statistics.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-600" />
                Pending
              </span>
              <span className="font-medium text-yellow-600">{statistics.pending}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                Approved
              </span>
              <span className="font-medium text-green-600">{statistics.approved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <X className="h-3 w-3 text-red-600" />
                Rejected
              </span>
              <span className="font-medium text-red-600">{statistics.rejected}</span>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        {statistics.recentRequests && statistics.recentRequests.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Recent Requests</h4>
              <Link href="/dashboard/staff-management/leave-requests">
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-2">
              {statistics.recentRequests.slice(0, 3).map((request: LeaveRequest) => (
                <div key={request.id} className="flex items-center justify-between p-2 bg-primary/20 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {request.user.firstName} {request.user.lastName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {leaveTypeLabels[request.leaveType]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd")}
                    </div>
                  </div>
                  <Badge className={`text-xs ${statusColors[request.status]}`}>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="flex gap-2">
            <Link href="/dashboard/staff-management/leave-requests" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </Link>
            {isAdmin() && (
              <Link href="/dashboard/staff-management/leave-requests?status=PENDING" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 