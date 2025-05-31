"use client";

import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Filter,
  Plus,
  Search,
  Eye,
  Check,
  X,
  FileText,
  Download,
  CalendarDays,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import {
  useGetLeaveRequestsQuery,
  useGetLeaveStatisticsQuery,
  useUpdateLeaveRequestStatusMutation,
  useCancelLeaveRequestMutation,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "@/store/api/leaveApi";
import { usePermissions } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/utils";
import LeaveRequestForm from "@/components/Forms/leave/LeaveRequestForm";

const leaveTypeLabels: Record<LeaveType, string> = {
  SICK: "Sick Leave",
  ANNUAL: "Annual Leave",
  PERSONAL: "Personal Leave",
  MATERNITY: "Maternity Leave",
  PATERNITY: "Paternity Leave",
  EMERGENCY: "Emergency Leave",
};

const statusColors: Record<LeaveStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

const leaveTypeColors: Record<LeaveType, string> = {
  SICK: "bg-red-50 text-red-700 border-red-200",
  ANNUAL: "bg-blue-50 text-blue-700 border-blue-200",
  PERSONAL: "bg-purple-50 text-purple-700 border-purple-200",
  MATERNITY: "bg-pink-50 text-pink-700 border-pink-200",
  PATERNITY: "bg-indigo-50 text-indigo-700 border-indigo-200",
  EMERGENCY: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function LeaveRequestsPage() {
  const { isAdmin, isTeacher, isStaff } = usePermissions();
  const [filters, setFilters] = useState({
    status: "all",
    leaveType: "all",
    search: "",
    page: 1,
    pageSize: 10,
  });
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // API queries
  const { 
    data: leaveRequestsData, 
    isLoading: requestsLoading, 
    error: requestsError 
  } = useGetLeaveRequestsQuery(filters);

  const { 
    data: statisticsData, 
    isLoading: statsLoading 
  } = useGetLeaveStatisticsQuery();

  // Mutations
  const [updateLeaveRequestStatus, { isLoading: isUpdating }] = useUpdateLeaveRequestStatusMutation();
  const [cancelLeaveRequest, { isLoading: isCancelling }] = useCancelLeaveRequestMutation();

  const handleStatusUpdate = async (requestId: number, status: "APPROVED" | "REJECTED") => {
    try {
      await updateLeaveRequestStatus({
        requestId,
        data: {
          status,
          rejectionReason: status === "REJECTED" ? rejectionReason : undefined,
        },
      }).unwrap();

      toast.success(`Leave request ${status.toLowerCase()} successfully`);
      setSelectedRequest(null);
      setIsViewDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    try {
      await cancelLeaveRequest(requestId).unwrap();
      toast.success("Leave request cancelled successfully");
      setSelectedRequest(null);
      setIsViewDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

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

  const canManageRequests = isAdmin();
  const canCreateRequests = isTeacher() || isStaff() || isAdmin();

  if (requestsLoading) return <LoadingComponent message="Loading leave requests..." />;
  if (requestsError) return <ErrorComponent message="Failed to load leave requests. Please try again." />;

  const statistics = statisticsData?.data;
  const requests = leaveRequestsData?.data || [];
  const totalPages = leaveRequestsData?.totalPages || 1;

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
            <p className="text-muted-foreground">
              Manage staff leave requests and time-off applications
            </p>
          </div>
          
          {canCreateRequests && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Leave Request</DialogTitle>
                </DialogHeader>
                <LeaveRequestForm
                  onSuccess={() => setIsCreateDialogOpen(false)}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Check className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{statistics.approved}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <X className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{statistics.rejected}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or reason..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Leave Type</Label>
                <Select value={filters.leaveType} onValueChange={(value) => handleFilterChange("leaveType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                    <SelectItem value="PERSONAL">Personal Leave</SelectItem>
                    <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                    <SelectItem value="PATERNITY">Paternity Leave</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Page Size</Label>
                <Select value={filters.pageSize.toString()} onValueChange={(value) => handleFilterChange("pageSize", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No leave requests found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {request.user.firstName} {request.user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.user.email}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {request.user.role}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={leaveTypeColors[request.leaveType]}>
                            {leaveTypeLabels[request.leaveType]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(request.appliedDate), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[request.status]}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {request.status === "PENDING" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Leave Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this leave request? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelRequest(request.id)}
                                      disabled={isCancelling}
                                    >
                                      {isCancelling ? "Cancelling..." : "Cancel Request"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {filters.page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View/Manage Request Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Employee</Label>
                    <p className="text-sm">
                      {selectedRequest.user.firstName} {selectedRequest.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedRequest.user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <Badge variant="outline">{selectedRequest.user.role}</Badge>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Leave Type</Label>
                    <Badge className={leaveTypeColors[selectedRequest.leaveType]}>
                      {leaveTypeLabels[selectedRequest.leaveType]}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={statusColors[selectedRequest.status]}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <p className="text-sm">{format(new Date(selectedRequest.startDate), "PPP")}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Date</Label>
                    <p className="text-sm">{format(new Date(selectedRequest.endDate), "PPP")}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">
                    {Math.ceil((new Date(selectedRequest.endDate).getTime() - new Date(selectedRequest.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Reason</Label>
                  <p className="text-sm dark:bg-gray-800 bg-gray-200 p-3 rounded-lg">{selectedRequest.reason}</p>
                </div>

                {selectedRequest.rejectionReason && (
                  <div>
                    <Label className="text-sm font-medium text-red-600">Rejection Reason</Label>
                    <p className="text-sm dark:bg-red-900/20 bg-red-200 p-3 rounded-lg text-red-700">
                      {selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Admin Actions */}
                {canManageRequests && selectedRequest.status === "PENDING" && (
                  <div className="space-y-4 border-t pt-4">
                    <Label className="text-sm font-medium">Admin Actions</Label>
                    
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Rejection reason (required for rejection)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStatusUpdate(selectedRequest.id, "APPROVED")}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(selectedRequest.id, "REJECTED")}
                        disabled={isUpdating || !rejectionReason.trim()}
                        variant="destructive"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
} 