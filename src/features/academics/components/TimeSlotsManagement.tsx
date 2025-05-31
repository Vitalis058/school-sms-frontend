"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Clock, 
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  useGetTimeSlotsQuery,
  useCreateTimeSlotMutation,
  useUpdateTimeSlotMutation,
  useDeleteTimeSlotMutation 
} from "@/store/api/academicsApi";
import LoadingComponent from "@/components/LoadingComponent";
import ErrorComponent from "@/components/ErrorComponent";
import { TimeSlotFormDialog } from "./TimeSlotFormDialog";
import { DeleteConfirmDialog } from "@/features/stream/components/DeleteConfirmDialog";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export function TimeSlotsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  // API hooks
  const { data: timeSlots = [], isLoading: timeSlotsLoading, error: timeSlotsError } = useGetTimeSlotsQuery();
  
  const [createTimeSlot, { isLoading: isCreating }] = useCreateTimeSlotMutation();
  const [updateTimeSlot, { isLoading: isUpdating }] = useUpdateTimeSlotMutation();
  const [deleteTimeSlot, { isLoading: isDeleting }] = useDeleteTimeSlotMutation();

  // Filter time slots based on search
  const filteredTimeSlots = timeSlots.filter((timeSlot) => {
    return timeSlot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           timeSlot.startTime.includes(searchTerm) ||
           timeSlot.endTime.includes(searchTerm);
  });

  // Handle create time slot
  const handleCreateTimeSlot = async (data: { name: string; startTime: string; endTime: string }) => {
    try {
      await createTimeSlot(data).unwrap();
      toast.success("Time slot created successfully!");
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create time slot");
    }
  };

  // Handle edit time slot
  const handleEditTimeSlot = async (data: { name: string; startTime: string; endTime: string }) => {
    if (!selectedTimeSlot) return;
    
    try {
      await updateTimeSlot({
        id: selectedTimeSlot.id,
        data,
      }).unwrap();
      toast.success("Time slot updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedTimeSlot(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update time slot");
    }
  };

  // Handle delete time slot
  const handleDeleteTimeSlot = async () => {
    if (!selectedTimeSlot) return;
    
    try {
      await deleteTimeSlot(selectedTimeSlot.id).unwrap();
      toast.success("Time slot deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedTimeSlot(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete time slot");
    }
  };

  // Handle edit click
  const handleEditClick = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setIsEditDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setIsDeleteDialogOpen(true);
  };

  // Format time for display
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  if (timeSlotsLoading) {
    return <LoadingComponent />;
  }

  if (timeSlotsError) {
    return <ErrorComponent />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Slots Management</h1>
          <p className="text-muted-foreground">
            Manage class time slots and schedules
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search time slots by name or time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Slots</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeSlots.length}</div>
            <p className="text-xs text-muted-foreground">
              Available periods
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Morning Slots</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeSlots.filter(slot => {
                const hour = parseInt(slot.startTime.split(':')[0]);
                return hour < 12;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Before 12:00 PM
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afternoon Slots</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeSlots.filter(slot => {
                const hour = parseInt(slot.startTime.split(':')[0]);
                return hour >= 12;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              After 12:00 PM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Slots Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTimeSlots.map((timeSlot) => (
          <Card key={timeSlot.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{timeSlot.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(timeSlot)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteClick(timeSlot)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Duration: {(() => {
                    const start = new Date(`2000-01-01T${timeSlot.startTime}`);
                    const end = new Date(`2000-01-01T${timeSlot.endTime}`);
                    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
                    return `${diff} minutes`;
                  })()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTimeSlots.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No time slots found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? "Try adjusting your search criteria"
                : "Get started by creating your first time slot"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Time Slot
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <TimeSlotFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTimeSlot}
        isLoading={isCreating}
        title="Create New Time Slot"
        description="Add a new time slot for class scheduling."
      />

      <TimeSlotFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditTimeSlot}
        isLoading={isUpdating}
        title="Edit Time Slot"
        description="Update the time slot details."
        initialData={selectedTimeSlot ? {
          name: selectedTimeSlot.name,
          startTime: selectedTimeSlot.startTime,
          endTime: selectedTimeSlot.endTime,
        } : undefined}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTimeSlot}
        isLoading={isDeleting}
        title="Delete Time Slot"
        description={`Are you sure you want to delete "${selectedTimeSlot?.name}"? This action cannot be undone and may affect scheduled lessons.`}
      />
    </div>
  );
} 