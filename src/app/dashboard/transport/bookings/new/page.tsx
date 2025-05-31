"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Car,
  Users,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Fuel,
} from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import { 
  useGetAvailableVehiclesQuery,
  useGetDriversQuery,
  useCreateVehicleBookingMutation
} from "@/store/api/transportApi";
import { usePermissions } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/utils";
import { Vehicle, Driver } from "@/store/types";

const fuelTypeColors = {
  PETROL: "bg-blue-100 text-blue-800",
  DIESEL: "bg-green-100 text-green-800",
  ELECTRIC: "bg-purple-100 text-purple-800",
  HYBRID: "bg-orange-100 text-orange-800",
};

export default function NewBookingPage() {
  const router = useRouter();
  const { canCreate } = usePermissions();
  
  const [formData, setFormData] = useState({
    startDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    purpose: "",
    destination: "",
    passengers: "1",
    notes: "",
    vehicleId: "",
    driverId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // API queries
  const { 
    data: availableVehicles = [], 
    isLoading: isLoadingVehicles,
    error: vehiclesError 
  } = useGetAvailableVehiclesQuery({
    startDate: formData.startDate,
    endDate: formData.endDate,
  }, {
    skip: !formData.startDate || !formData.endDate
  });

  const { 
    data: driversData,
    isLoading: isLoadingDrivers 
  } = useGetDriversQuery({
    status: "ACTIVE",
    pageSize: 100,
  });

  // Mutations
  const [createBooking, { isLoading: isCreating }] = useCreateVehicleBookingMutation();

  const drivers = driversData?.data || [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // Reset vehicle selection when dates change
    if (field === "startDate" || field === "endDate") {
      setFormData(prev => ({ ...prev, vehicleId: "", driverId: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.passengers || parseInt(formData.passengers) < 1) {
      newErrors.passengers = "Number of passengers must be at least 1";
    }
    if (!formData.vehicleId) newErrors.vehicleId = "Please select a vehicle";
    if (!formData.driverId) newErrors.driverId = "Please select a driver";

    // Date validation
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = startOfDay(new Date());

    if (isBefore(startDate, today)) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    if (isBefore(endDate, startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }

    // Time validation for same day bookings
    if (formData.startDate === formData.endDate) {
      const startTime = formData.startTime;
      const endTime = formData.endTime;
      
      if (startTime >= endTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Passenger capacity validation
    const selectedVehicle = availableVehicles.find((v: Vehicle) => v.id === formData.vehicleId);
    if (selectedVehicle && parseInt(formData.passengers) > selectedVehicle.capacity) {
      newErrors.passengers = `Vehicle capacity is ${selectedVehicle.capacity} passengers`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await createBooking({
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        purpose: formData.purpose.trim(),
        destination: formData.destination.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        passengers: parseInt(formData.passengers),
        notes: formData.notes.trim() || undefined,
      }).unwrap();

      toast.success("Vehicle booking request submitted successfully");
      router.push("/dashboard/transport/bookings");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!canCreate("bookings")) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to create vehicle bookings.
            </p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/transport">Transport</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/transport/bookings">Bookings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>New Booking</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold tracking-tight">Book Vehicle</h1>
            <p className="text-muted-foreground">
              Request a vehicle for transportation needs
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      min={formData.startDate}
                      className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      className={errors.startTime ? "border-red-500" : ""}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.startTime}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      className={errors.endTime ? "border-red-500" : ""}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Input
                    id="purpose"
                    placeholder="e.g., Field trip, Meeting, Conference"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    className={errors.purpose ? "border-red-500" : ""}
                  />
                  {errors.purpose && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.purpose}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., City Center, Airport, University"
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    className={errors.destination ? "border-red-500" : ""}
                  />
                  {errors.destination && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Number of Passengers *</Label>
                  <Input
                    id="passengers"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.passengers}
                    onChange={(e) => handleInputChange("passengers", e.target.value)}
                    className={errors.passengers ? "border-red-500" : ""}
                  />
                  {errors.passengers && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.passengers}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or additional information..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vehicle & Driver Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle & Driver Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Available Vehicles */}
                <div className="space-y-2">
                  <Label>Available Vehicles *</Label>
                  {isLoadingVehicles ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="text-sm text-muted-foreground">Loading available vehicles...</div>
                    </div>
                  ) : vehiclesError ? (
                    <div className="text-sm text-red-500">Failed to load vehicles</div>
                  ) : availableVehicles.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-4 border rounded-lg">
                      No vehicles available for the selected dates. Please try different dates.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {availableVehicles.map((vehicle: Vehicle) => (
                        <div
                          key={vehicle.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.vehicleId === vehicle.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            handleInputChange("vehicleId", vehicle.id);
                            // Reset driver selection when vehicle changes
                            setFormData(prev => ({ ...prev, driverId: "" }));
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <Car className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {vehicle.make} {vehicle.model} ({vehicle.year})
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {vehicle.plateNumber}
                                </div>
                              </div>
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
                              {formData.vehicleId === vehicle.id && (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.vehicleId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.vehicleId}
                    </p>
                  )}
                </div>

                {/* Driver Selection */}
                <div className="space-y-2">
                  <Label htmlFor="driverId">Assign Driver *</Label>
                  <Select
                    value={formData.driverId}
                    onValueChange={(value) => handleInputChange("driverId", value)}
                    disabled={!formData.vehicleId}
                  >
                    <SelectTrigger className={errors.driverId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingDrivers ? (
                        <div className="p-2 text-sm text-muted-foreground">Loading drivers...</div>
                      ) : (
                        drivers
                          .filter((driver: Driver) => !driver.vehicleAssigned || driver.vehicleAssigned === formData.vehicleId)
                          .map((driver: Driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>
                                  {driver.firstName} {driver.lastName} - {driver.licenseNumber}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.driverId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.driverId}
                    </p>
                  )}
                  {!formData.vehicleId && (
                    <p className="text-sm text-muted-foreground">
                      Please select a vehicle first to choose a driver
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="min-w-32"
            >
              {isCreating ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </div>
        </form>
      </div>
    </SidebarInset>
  );
} 