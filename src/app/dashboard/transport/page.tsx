"use client";

import React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Users,
  Calendar,
  Wrench,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/contexts/AuthContext";
import { useGetTransportAnalyticsQuery } from "@/store/api/transportApi";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";

export default function TransportDashboard() {
  const router = useRouter();
  const { canRead, canCreate, isAdmin, isStaff, isDriver } = usePermissions();
  
  const { data: analytics, isLoading, error } = useGetTransportAnalyticsQuery();

  if (!canRead("transport")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view transport management.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (isLoading) return <LoadingComponent message="Loading transport data..." />;
  if (error) return <ErrorComponent message="Failed to load transport data. Please try again." />;

  const getWelcomeMessage = () => {
    if (isDriver()) {
      return "Welcome to your driver dashboard. Manage your vehicle and bookings.";
    } else if (isAdmin() || isStaff()) {
      return "Manage your fleet, drivers, and vehicle bookings efficiently.";
    } else {
      return "Book vehicles for your transportation needs.";
    }
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (canCreate("bookings")) {
      actions.push({
        title: "Book Vehicle",
        description: "Request a vehicle for transportation",
        icon: Calendar,
        href: "/dashboard/transport/bookings/new",
        color: "bg-blue-500",
      });
    }
    
    if (canCreate("vehicles")) {
      actions.push({
        title: "Add Vehicle",
        description: "Register a new vehicle to the fleet",
        icon: Car,
        href: "/dashboard/transport/vehicles/new",
        color: "bg-green-500",
      });
    }
    
    if (canCreate("drivers")) {
      actions.push({
        title: "Add Driver",
        description: "Register a new driver",
        icon: Users,
        href: "/dashboard/transport/drivers/new",
        color: "bg-purple-500",
      });
    }
    
    if (canCreate("maintenance")) {
      actions.push({
        title: "Report Maintenance",
        description: "Create a maintenance report",
        icon: Wrench,
        href: "/dashboard/transport/maintenance/new",
        color: "bg-orange-500",
      });
    }
    
    return actions;
  };

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
            <p className="text-muted-foreground">
              {getWelcomeMessage()}
            </p>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalVehicles}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.availableVehicles} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeDrivers}</div>
                <p className="text-xs text-muted-foreground">
                  of {analytics.totalDrivers} total drivers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.pendingBookings} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.vehiclesInMaintenance}</div>
                <p className="text-xs text-muted-foreground">
                  vehicles in maintenance
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Frequently used actions and shortcuts
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {getQuickActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push(action.href)}
                >
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {canRead("vehicles") && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => router.push("/dashboard/transport/vehicles")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicles
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage fleet vehicles, assignments, and status
                </p>
                {analytics && (
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary">
                      {analytics.availableVehicles} Available
                    </Badge>
                    <Badge variant="outline">
                      {analytics.vehiclesInUse} In Use
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {canRead("drivers") && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/dashboard/transport/drivers")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Drivers
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage driver profiles, licenses, and assignments
                </p>
                {analytics && (
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {analytics.activeDrivers} Active
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {canRead("bookings") && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/dashboard/transport/bookings")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Bookings
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage vehicle booking requests
                </p>
                {analytics && (
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary">
                      {analytics.pendingBookings} Pending
                    </Badge>
                    <Badge variant="outline">
                      {analytics.completedBookings} Completed
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {canRead("maintenance") && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/dashboard/transport/maintenance")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track vehicle maintenance and service records
                </p>
                <div className="mt-2">
                  <Badge variant="secondary">
                    {analytics?.vehiclesInMaintenance || 0} In Service
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity - Driver specific view */}
        {isDriver() && (
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed trip to City Center</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upcoming trip to Airport</p>
                    <p className="text-xs text-muted-foreground">Tomorrow at 9:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wrench className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Vehicle service due</p>
                    <p className="text-xs text-muted-foreground">Next week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
} 