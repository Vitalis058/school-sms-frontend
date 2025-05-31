"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car,
  Wrench,
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  User,
  FileText,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import { 
  useGetMaintenanceReportsQuery, 
  useDeleteMaintenanceReportMutation
} from "@/store/api/transportApi";
import { usePermissions } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/utils";
import { MaintenanceReport } from "@/store/types";

const statusColors = {
  SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusIcons = {
  SCHEDULED: Calendar,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle,
  CANCELLED: AlertTriangle,
};

const typeColors = {
  ROUTINE: "bg-blue-100 text-blue-800",
  REPAIR: "bg-red-100 text-red-800",
  INSPECTION: "bg-green-100 text-green-800",
  EMERGENCY: "bg-orange-100 text-orange-800",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function MaintenancePage() {
  const router = useRouter();
  const { canRead, canCreate, canUpdate, canDelete, isAdmin, isStaff, isDriver } = usePermissions();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    priority: "all",
    vehicleId: "all",
    page: 1,
    pageSize: 10,
  });

  // API queries
  const { 
    data: maintenanceData, 
    isLoading, 
    error 
  } = useGetMaintenanceReportsQuery({
    search: filters.search || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    vehicleId: filters.vehicleId === "all" ? undefined : filters.vehicleId,
    page: filters.page,
    pageSize: filters.pageSize,
  });

  // Mutations
  const [deleteMaintenanceReport, { isLoading: isDeleting }] = useDeleteMaintenanceReportMutation();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteMaintenanceReport(reportId).unwrap();
      toast.success("Maintenance report deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!canRead("maintenance")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view maintenance records.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (isLoading) return <LoadingComponent message="Loading maintenance records..." />;
  if (error) return <ErrorComponent message="Failed to load maintenance records. Please try again." />;

  const reports = maintenanceData?.data || [];
  const totalPages = maintenanceData?.totalPages || 1;

  const getWelcomeMessage = () => {
    if (isDriver()) {
      return "Report maintenance issues and schedule services for your assigned vehicle.";
    } else if (isAdmin() || isStaff()) {
      return "Monitor and manage vehicle maintenance across the entire fleet.";
    } else {
      return "View maintenance records and reports.";
    }
  };

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Maintenance</h1>
            <p className="text-muted-foreground">
              {getWelcomeMessage()}
            </p>
          </div>
          
          {canCreate("maintenance") && (
            <Button onClick={() => router.push("/dashboard/transport/maintenance/new")}>
              <Plus className="h-4 w-4 mr-2" />
              {isDriver() ? "Report Issue" : "Add Maintenance"}
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">
                    {reports.filter((r: MaintenanceReport) => r.status === "SCHEDULED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">
                    {reports.filter((r: MaintenanceReport) => r.status === "IN_PROGRESS").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {reports.filter((r: MaintenanceReport) => r.status === "COMPLETED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">
                    ${reports.reduce((sum: number, r: MaintenanceReport) => sum + r.cost, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ROUTINE">Routine</SelectItem>
                  <SelectItem value="REPAIR">Repair</SelectItem>
                  <SelectItem value="INSPECTION">Inspection</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({
                  search: "",
                  status: "all",
                  type: "all",
                  priority: "all",
                  vehicleId: "all",
                  page: 1,
                  pageSize: 10,
                })}
              >
                Clear Filters
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/transport/maintenance/schedule")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Details</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type & Priority</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  {(canUpdate("maintenance") || canDelete("maintenance")) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report: MaintenanceReport) => {
                  const StatusIcon = statusIcons[report.status as keyof typeof statusIcons];

                  return (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {report.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            #{report.id.slice(-8)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {report.Vehicle && (
                            <div className="flex items-center gap-1">
                              <Car className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                {report.Vehicle.make} {report.Vehicle.model}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Mileage: {report.mileageAtService.toLocaleString()} km
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={typeColors[report.type as keyof typeof typeColors]}>
                            {report.type}
                          </Badge>
                          <Badge className={priorityColors[report.priority as keyof typeof priorityColors]}>
                            {report.priority}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {format(new Date(report.serviceDate), "MMM dd, yyyy")}
                          </div>
                          {report.nextServiceDue && (
                            <div className="text-xs text-muted-foreground">
                              Next: {format(new Date(report.nextServiceDue), "MMM dd, yyyy")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            ${report.cost.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {report.serviceProvider}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {report.Driver && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="text-sm">
                                {report.Driver.firstName} {report.Driver.lastName}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(report.createdAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      {(canUpdate("maintenance") || canDelete("maintenance")) && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => router.push(`/dashboard/transport/maintenance/${report.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canUpdate("maintenance") && (
                                <DropdownMenuItem 
                                  onClick={() => router.push(`/dashboard/transport/maintenance/${report.id}/edit`)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {report.status === "SCHEDULED" && canUpdate("maintenance") && (
                                <DropdownMenuItem 
                                  onClick={() => router.push(`/dashboard/transport/maintenance/${report.id}/start`)}
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  Start Service
                                </DropdownMenuItem>
                              )}
                              {canDelete("maintenance") && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the
                                        maintenance report and remove all associated data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteReport(report.id)}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {isDeleting ? "Deleting..." : "Delete"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((filters.page - 1) * filters.pageSize) + 1} to{" "}
                  {Math.min(filters.page * filters.pageSize, maintenanceData?.total || 0)} of{" "}
                  {maintenanceData?.total || 0} results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Driver Quick Actions */}
        {isDriver() && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push("/dashboard/transport/maintenance/new?type=EMERGENCY")}
                >
                  <div className="p-2 rounded-full bg-red-500 text-white">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Emergency Report</div>
                    <div className="text-xs text-muted-foreground">
                      Report urgent issues
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push("/dashboard/transport/maintenance/new?type=ROUTINE")}
                >
                  <div className="p-2 rounded-full bg-blue-500 text-white">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Schedule Service</div>
                    <div className="text-xs text-muted-foreground">
                      Plan routine maintenance
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push("/dashboard/transport/maintenance/new?type=REPAIR")}
                >
                  <div className="p-2 rounded-full bg-orange-500 text-white">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Report Repair</div>
                    <div className="text-xs text-muted-foreground">
                      Log repair needs
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push("/dashboard/transport/maintenance/new?type=INSPECTION")}
                >
                  <div className="p-2 rounded-full bg-green-500 text-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Inspection Report</div>
                    <div className="text-xs text-muted-foreground">
                      Submit inspection results
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
} 