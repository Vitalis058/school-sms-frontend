"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/SearchableSelect";
import { StreamCreationSchema, StreamCreationTYpes } from "@/utils/validation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/constants/apiUrl";
import { toast } from "sonner";
import LoadingButton from "@/components/LoadingButton";

type Teacher = {
  value: string;
  label: string;
};

interface StreamFormProps {
  initialData?: {
    id?: string;
    name: string;
    teacherId?: string | null;
  };
  teachers: Teacher[];
}

export default function StreamForm({ teachers, initialData }: StreamFormProps) {
  const isEditing = !!initialData?.id;
  console.log(isEditing);

  const form = useForm<StreamCreationTYpes>({
    resolver: zodResolver(StreamCreationSchema),
    defaultValues: {
      name: "",
      teacherId: "",
    },
  });

  //mutation function
  const mutation = useMutation({
    mutationFn: async (data: StreamCreationTYpes) => {
      return await axios.post(`${API_URL}/api/v1/classes`, data);
    },
    onSuccess: () => {
      toast.success("Class created successfully");
    },

    onError: (error) => {
      toast.error(error.message || "something went wrong");
    },
  });

  function handleSubmit(data: StreamCreationTYpes) {
    mutation.mutate(data);
  }

  return (
    <Card className="w-full max-w-md mx-auto space-y-4">
      <CardHeader>
        <CardTitle className="text-primary text-center">
          Create New Class
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5A, 5B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Teacher</FormLabel>

                  <FormControl>
                    <SearchableSelect
                      options={teachers}
                      onChange={field.onChange}
                      placeholder="class teacher"
                      href="/dashboard/users/teachers/new"
                      value={field.value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <LoadingButton loading={mutation.isPending}>
              Submit class
            </LoadingButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
