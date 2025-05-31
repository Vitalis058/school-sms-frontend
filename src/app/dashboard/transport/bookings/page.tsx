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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import { 
  useGetVehicleBookingsQuery, 
  useApproveVehicleBookingMutation,
  useCancelVehicleBookingMutation,
  useCompleteVehicleBookingMutation
} from "@/store/api/transportApi";
import { usePermissions } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/utils";
import { VehicleBooking } from "@/store/types";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusIcons = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
};

export default function BookingsPage() {
  const router = useRouter();
  const { canRead, canCreate, canUpdate, canDelete, isAdmin, isStaff } = usePermissions();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    startDate: "",
    endDate: "",
    page: 1,
    pageSize: 10,
  });
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve");

  // API queries
  const { 
    data: bookingsData, 
    isLoading, 
    error 
  } = useGetVehicleBookingsQuery({
    search: filters.search || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    page: filters.page,
    pageSize: filters.pageSize,
  });

  // Mutations
  const [approveBooking, { isLoading: isApproving }] = useApproveVehicleBookingMutation();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelVehicleBookingMutation();
  const [completeBooking, { isLoading: isCompleting }] = useCompleteVehicleBookingMutation();

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

  const handleApprovalAction = async () => {
    if (!selectedBooking) return;
    
    try {
      await approveBooking({
        id: selectedBooking.id,
        approved: approvalAction === "approve",
        notes: approvalNotes,
      }).unwrap();
      
      toast.success(`Booking ${approvalAction === "approve" ? "approved" : "rejected"} successfully`);
      setApprovalDialogOpen(false);
      setSelectedBooking(null);
      setApprovalNotes("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCancelBooking = async (bookingId: string, reason: string) => {
    try {
      await cancelBooking({ id: bookingId, reason }).unwrap();
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const openApprovalDialog = (booking: VehicleBooking, action: "approve" | "reject") => {
    setSelectedBooking(booking);
    setApprovalAction(action);
    setApprovalDialogOpen(true);
  };

  if (!canRead("bookings")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view vehicle bookings.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (isLoading) return <LoadingComponent message="Loading bookings..." />;
  if (error) return <ErrorComponent message="Failed to load bookings. Please try again." />;

  const bookings = bookingsData?.data || [];
  const totalPages = bookingsData?.totalPages || 1;

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Bookings</h1>
            <p className="text-muted-foreground">
              Manage vehicle booking requests and approvals
            </p>
          </div>
          
          {canCreate("bookings") && (
            <Button onClick={() => router.push("/dashboard/transport/bookings/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Book Vehicle
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b: VehicleBooking) => b.status === "PENDING").length}
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
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b: VehicleBooking) => b.status === "APPROVED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b: VehicleBooking) => b.status === "COMPLETED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">
                    {bookings.filter((b: VehicleBooking) => b.status === "REJECTED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Start date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />

              <Input
                type="date"
                placeholder="End date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />

              <Button
                variant="outline"
                onClick={() => setFilters({
                  search: "",
                  status: "all",
                  startDate: "",
                  endDate: "",
                  page: 1,
                  pageSize: 10,
                })}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Details</TableHead>
                  <TableHead>Vehicle & Driver</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  {(canUpdate("bookings") || canDelete("bookings")) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: VehicleBooking) => {
                  const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons];

                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">#{booking.id.slice(-8)}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {booking.destination}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {booking.passengers} passengers
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {booking.Vehicle && (
                            <div className="flex items-center gap-1">
                              <Car className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                {booking.Vehicle.make} {booking.Vehicle.model}
                              </span>
                            </div>
                          )}
                          {booking.Driver && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              {booking.Driver.firstName} {booking.Driver.lastName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {booking.RequestedByUser && (
                            <div className="text-sm font-medium">
                              {booking.RequestedByUser.firstName} {booking.RequestedByUser.lastName}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {format(new Date(booking.startDate), "MMM dd, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.startTime} - {booking.endTime}
                          </div>
                          {booking.startDate !== booking.endDate && (
                            <div className="text-xs text-muted-foreground">
                              to {format(new Date(booking.endDate), "MMM dd, yyyy")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="text-sm font-medium truncate">
                            {booking.purpose}
                          </div>
                          {booking.notes && (
                            <div className="text-xs text-muted-foreground truncate">
                              {booking.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {booking.status}
                        </Badge>
                      </TableCell>
                      {(canUpdate("bookings") || canDelete("bookings")) && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => router.push(`/dashboard/transport/bookings/${booking.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              
                              {booking.status === "PENDING" && (isAdmin() || isStaff()) && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => openApprovalDialog(booking, "approve")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => openApprovalDialog(booking, "reject")}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              
                              {booking.status === "APPROVED" && (
                                <DropdownMenuItem 
                                  onClick={() => router.push(`/dashboard/transport/bookings/${booking.id}/complete`)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </DropdownMenuItem>
                              )}
                              
                              {["PENDING", "APPROVED"].includes(booking.status) && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this booking? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelBooking(booking.id, "Cancelled by user")}
                                        disabled={isCancelling}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {isCancelling ? "Cancelling..." : "Yes, Cancel"}
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
                  {Math.min(filters.page * filters.pageSize, bookingsData?.total || 0)} of{" "}
                  {bookingsData?.total || 0} results
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

        {/* Approval Dialog */}
        <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {approvalAction === "approve" ? "Approve" : "Reject"} Booking
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedBooking && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">
                    Booking #{selectedBooking.id.slice(-8)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.purpose} - {selectedBooking.destination}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedBooking.startDate), "MMM dd, yyyy")} 
                    {" "}{selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {approvalAction === "approve" ? "Approval" : "Rejection"} Notes
                </label>
                <Textarea
                  placeholder={`Add notes for ${approvalAction === "approve" ? "approval" : "rejection"}...`}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setApprovalDialogOpen(false)}
                  disabled={isApproving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalAction}
                  disabled={isApproving}
                  className={approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                >
                  {isApproving ? "Processing..." : (approvalAction === "approve" ? "Approve" : "Reject")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
} 