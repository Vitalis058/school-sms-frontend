import { Button } from "@/components/ui/button";
import { Plus, School } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StreamCard } from "@/features/stream/components/StreamCard";
import { TeacherType } from "@/types/types";
import Link from "next/link";
import LoadingButton from "../../../components/LoadingButton";
import { useCreateStreamMutation, useUpdateStreamMutation, useDeleteStreamMutation } from "@/store/api/academicsApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StreamCreationSchema, StreamCreationTYpes } from "@/utils/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StreamsCardTypes = {
  selectedClass: {
    id: string;
    name: string;
  };

  streams: {
    id: string;
    name: string;
    slug: string;
    classTeacher: string;
    students: number;
  }[];

  teachers: TeacherType[];
};

function StreamsCard({ selectedClass, streams, teachers }: StreamsCardTypes) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<any>(null);

  const [createStream, { isLoading: isCreating }] = useCreateStreamMutation();
  const [updateStream, { isLoading: isUpdating }] = useUpdateStreamMutation();
  const [deleteStream, { isLoading: isDeleting }] = useDeleteStreamMutation();

  // Form for creating streams
  const createForm = useForm<StreamCreationTYpes>({
    resolver: zodResolver(StreamCreationSchema),
    defaultValues: {
      name: "",
      teacherId: "none",
      gradeId: selectedClass?.id || "",
    },
  });

  // Form for editing streams
  const editForm = useForm<StreamCreationTYpes>({
    resolver: zodResolver(StreamCreationSchema),
    defaultValues: {
      name: "",
      teacherId: "none",
      gradeId: selectedClass?.id || "",
    },
  });

  // Handle create stream
  const handleCreateStream = async (data: StreamCreationTYpes) => {
    try {
      await createStream({
        name: data.name,
        gradeId: selectedClass.id,
        teacherId: data.teacherId === "none" ? undefined : data.teacherId,
      }).unwrap();
      
      toast.success("Stream created successfully!");
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create stream");
    }
  };

  // Handle edit stream
  const handleEditStream = async (data: StreamCreationTYpes) => {
    if (!selectedStream) return;
    
    try {
      await updateStream({
        id: selectedStream.id,
        data: {
          name: data.name,
          teacherId: data.teacherId === "none" ? undefined : data.teacherId,
        },
      }).unwrap();
      
      toast.success("Stream updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedStream(null);
      editForm.reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update stream");
    }
  };

  // Handle delete stream
  const handleDeleteStream = async () => {
    if (!selectedStream) return;
    
    try {
      await deleteStream(selectedStream.id).unwrap();
      toast.success("Stream deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedStream(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete stream");
    }
  };

  // Handle edit click
  const handleEditClick = (stream: any) => {
    setSelectedStream(stream);
    editForm.setValue("name", stream.name);
    editForm.setValue("teacherId", stream.teacherId || "none");
    editForm.setValue("gradeId", selectedClass.id);
    setIsEditDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (stream: any) => {
    setSelectedStream(stream);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex-1 rounded-lg p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Grades</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>classes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>streams</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Add Stream Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <p className="hidden sm:block">Add Stream</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Stream</DialogTitle>
              <DialogDescription>
                Add a new stream to class {selectedClass?.name}.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateStream)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5a" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <div className="flex gap-2">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No teacher assigned</SelectItem>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size={"icon"} asChild type="button">
                          <Link href={"/dashboard/users/teachers/new"}>
                            <Plus />
                          </Link>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoadingButton loading={isCreating} type="submit">
                  Create stream
                </LoadingButton>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Stream Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Stream</DialogTitle>
              <DialogDescription>
                Update the stream details for {selectedStream?.name}.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditStream)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stream name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5a" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                  <div className="flex gap-2">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                          </FormControl>
                      <SelectContent>
                            <SelectItem value="none">No teacher assigned</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                        <Button size={"icon"} asChild type="button">
                      <Link href={"/dashboard/users/teachers/new"}>
                        <Plus />
                      </Link>
                    </Button>
                  </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <LoadingButton loading={isUpdating} type="submit" className="flex-1">
                    Update stream
                  </LoadingButton>
                </div>
            </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the stream "{selectedStream?.name}" 
                and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedStream(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteStream}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator className="my-2" />

      {streams.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 text-slate-400">
            <School className="mx-auto mb-2 h-12 w-12" />
            <p className="text-lg font-medium">No streams available</p>
          </div>
          <p className="mb-4 max-w-md text-slate-500">
            This class doesn&apos;t have any streams yet. Create your first
            stream to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {streams.map((item) => (
            <StreamCard
              name={item.name}
              teacher={item.classTeacher}
              studentCount={item.students}
              onEdit={() => handleEditClick(item)}
              onDelete={() => handleDeleteClick(item)}
              key={item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StreamsCard;
