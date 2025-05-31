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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Car,
  Users,
  Fuel,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import { 
  useGetVehiclesQuery, 
  useDeleteVehicleMutation,
  useAssignVehicleToDriverMutation,
  useGetDriversQuery 
} from "@/store/api/transportApi";
import { usePermissions } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/utils";
import { Vehicle, Driver } from "@/store/types";

const statusColors = {
  AVAILABLE: "bg-green-100 text-green-800 border-green-200",
  IN_USE: "bg-blue-100 text-blue-800 border-blue-200",
  MAINTENANCE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  OUT_OF_SERVICE: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  AVAILABLE: CheckCircle,
  IN_USE: Car,
  MAINTENANCE: Wrench,
  OUT_OF_SERVICE: AlertTriangle,
};

const fuelTypeColors = {
  PETROL: "bg-blue-100 text-blue-800",
  DIESEL: "bg-green-100 text-green-800",
  ELECTRIC: "bg-purple-100 text-purple-800",
  HYBRID: "bg-orange-100 text-orange-800",
};

export default function VehiclesPage() {
  const router = useRouter();
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    fuelType: "all",
    page: 1,
    pageSize: 10,
  });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  // API queries
  const { 
    data: vehiclesData, 
    isLoading, 
    error 
  } = useGetVehiclesQuery({
    search: filters.search || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    page: filters.page,
    pageSize: filters.pageSize,
  });

  const { data: driversData } = useGetDriversQuery({
    status: "ACTIVE",
    pageSize: 100,
  });

  // Mutations
  const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation();
  const [assignVehicleToDriver, { isLoading: isAssigning }] = useAssignVehicleToDriverMutation();

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

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await deleteVehicle(vehicleId).unwrap();
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAssignVehicle = async () => {
    if (!selectedVehicle || !selectedDriverId) return;
    
    try {
      await assignVehicleToDriver({
        vehicleId: selectedVehicle.id,
        driverId: selectedDriverId,
      }).unwrap();
      toast.success("Vehicle assigned successfully");
      setAssignDialogOpen(false);
      setSelectedVehicle(null);
      setSelectedDriverId("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const openAssignDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setAssignDialogOpen(true);
  };

  if (!canRead("vehicles")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to view vehicles.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  if (isLoading) return <LoadingComponent message="Loading vehicles..." />;
  if (error) return <ErrorComponent message="Failed to load vehicles. Please try again." />;

  const vehicles = vehiclesData?.data || [];
  const drivers = driversData?.data || [];
  const totalPages = vehiclesData?.totalPages || 1;

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
            <p className="text-muted-foreground">
              Manage fleet vehicles, assignments, and maintenance
            </p>
          </div>
          
          {canCreate("vehicles") && (
            <Button onClick={() => router.push("/dashboard/transport/vehicles/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">
                    {vehicles.filter((v: Vehicle) => v.status === "AVAILABLE").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">In Use</p>
                  <p className="text-2xl font-bold">
                    {vehicles.filter((v: Vehicle) => v.status === "IN_USE").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold">
                    {vehicles.filter((v: Vehicle) => v.status === "MAINTENANCE").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Service Due</p>
                  <p className="text-2xl font-bold">
                    {vehicles.filter((v: Vehicle) => {
                      if (!v.nextServiceDate) return false;
                      const serviceDate = new Date(v.nextServiceDate);
                      const thirtyDaysFromNow = new Date();
                      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                      return serviceDate <= thirtyDaysFromNow;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search vehicles..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.fuelType}
                onValueChange={(value) => handleFilterChange("fuelType", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="PETROL">Petrol</SelectItem>
                  <SelectItem value="DIESEL">Diesel</SelectItem>
                  <SelectItem value="ELECTRIC">Electric</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicles List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Driver Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Next Service</TableHead>
                  {(canUpdate("vehicles") || canDelete("vehicles")) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle: Vehicle) => {
                  const StatusIcon = statusIcons[vehicle.status as keyof typeof statusIcons];
                  const isServiceDue = () => {
                    if (!vehicle.nextServiceDate) return false;
                    const serviceDate = new Date(vehicle.nextServiceDate);
                    const thirtyDaysFromNow = new Date();
                    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                    return serviceDate <= thirtyDaysFromNow;
                  };

                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Car className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {vehicle.plateNumber}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Year:</span> {vehicle.year}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={fuelTypeColors[vehicle.fuelType as keyof typeof fuelTypeColors]}>
                              <Fuel className="h-3 w-3 mr-1" />
                              {vehicle.fuelType}
                            </Badge>
                            <Badge variant="outline">
                              <Users className="h-3 w-3 mr-1" />
                              {vehicle.capacity} seats
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {vehicle.Driver ? (
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              {vehicle.Driver.firstName} {vehicle.Driver.lastName}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Not assigned</span>
                            {canUpdate("vehicles") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAssignDialog(vehicle)}
                              >
                                Assign
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[vehicle.status as keyof typeof statusColors]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {vehicle.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{vehicle.mileage.toLocaleString()} km</span>
                      </TableCell>
                      <TableCell>
                        {vehicle.nextServiceDate ? (
                          <div className={`text-sm ${isServiceDue() ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                            {format(new Date(vehicle.nextServiceDate), "MMM dd, yyyy")}
                            {isServiceDue() && (
                              <AlertTriangle className="h-3 w-3 inline ml-1" />
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not scheduled</span>
                        )}
                      </TableCell>
                      {(canUpdate("vehicles") || canDelete("vehicles")) && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => router.push(`/dashboard/transport/vehicles/${vehicle.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canUpdate("vehicles") && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => router.push(`/dashboard/transport/vehicles/${vehicle.id}/edit`)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openAssignDialog(vehicle)}>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Assign Driver
                                  </DropdownMenuItem>
                                </>
                              )}
                              {canDelete("vehicles") && (
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
                                        vehicle record and remove all associated data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
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
                  {Math.min(filters.page * filters.pageSize, vehiclesData?.total || 0)} of{" "}
                  {vehiclesData?.total || 0} results
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

        {/* Assign Driver Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Driver to Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedVehicle && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">
                    {selectedVehicle.make} {selectedVehicle.model}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedVehicle.plateNumber}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Driver</label>
                <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers
                      .filter((driver: Driver) => !driver.vehicleAssigned)
                      .map((driver: Driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.firstName} {driver.lastName} - {driver.licenseNumber}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAssignDialogOpen(false)}
                  disabled={isAssigning}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignVehicle}
                  disabled={!selectedDriverId || isAssigning}
                >
                  {isAssigning ? "Assigning..." : "Assign Driver"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarInset>
  );
} 