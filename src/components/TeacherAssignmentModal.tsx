"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: any;
  teachers: any[];
  onAssignTeacher: (teacherId: string) => Promise<void>;
  onRemoveTeacher: (teacherId: string) => Promise<void>;
}

export function TeacherAssignmentModal({
  isOpen,
  onClose,
  subject,
  teachers,
  onAssignTeacher,
  onRemoveTeacher,
}: TeacherAssignmentModalProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [removingTeacherId, setRemovingTeacherId] = useState<string | null>(null);

  const assignedTeachers = subject?.teachers || [];
  const availableTeachers = teachers.filter(
    teacher => !assignedTeachers.some((assigned: any) => assigned.id === teacher.id)
  );

  const handleAssignTeacher = async () => {
    if (!selectedTeacherId) {
      toast.error("Please select a teacher");
      return;
    }

    setIsAssigning(true);
    try {
      await onAssignTeacher(selectedTeacherId);
      setSelectedTeacherId("");
      toast.success("Teacher assigned successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveTeacher = async (teacherId: string) => {
    setRemovingTeacherId(teacherId);
    try {
      await onRemoveTeacher(teacherId);
      toast.success("Teacher removed successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRemovingTeacherId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Manage Teachers - {subject?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assign New Teacher */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Assign Teacher
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeachers.length === 0 ? (
                        <SelectItem value="" disabled>
                          No available teachers
                        </SelectItem>
                      ) : (
                        availableTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.firstName} {teacher.lastName} - {teacher.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAssignTeacher}
                  disabled={!selectedTeacherId || isAssigning || availableTeachers.length === 0}
                >
                  {isAssigning ? "Assigning..." : "Assign"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Currently Assigned Teachers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Assigned Teachers ({assignedTeachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedTeachers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teachers assigned to this subject yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedTeachers.map((teacher: any) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {teacher.email}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveTeacher(teacher.id)}
                        disabled={removingTeacherId === teacher.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        {removingTeacherId === teacher.id ? (
                          "Removing..."
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subject Information */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Subject Code:</span>
                  <div className="text-muted-foreground">{subject?.subjectCode}</div>
                </div>
                <div>
                  <span className="font-medium">Short Name:</span>
                  <div className="text-muted-foreground">{subject?.shortname}</div>
                </div>
                <div>
                  <span className="font-medium">Department:</span>
                  <div className="text-muted-foreground">{subject?.Department?.name}</div>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <div>
                    <Badge variant={subject?.active ? "default" : "secondary"}>
                      {subject?.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                {subject?.optional && (
                  <Badge variant="outline">Optional</Badge>
                )}
                {subject?.labRequired && (
                  <Badge variant="outline">Lab Required</Badge>
                )}
                {subject?.fieldtrips && (
                  <Badge variant="outline">Field Trips</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 