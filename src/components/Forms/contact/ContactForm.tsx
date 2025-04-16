"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CheckCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2),
  country: z.string(),
  email: z.string().email(),
  schoolName: z.string(),
  phone: z.string(),
  role: z.string(),
  website: z.string().optional(),
  students: z.string(),
  painPoints: z.string().min(10),
  referral: z.string(),
});

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      email: "",
      schoolName: "",
      phone: "",
      role: "",
      website: "",
      students: "",
      painPoints: "",
      referral: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1500));
    console.log(values);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 py-12 text-center">
        <div className="rounded-full bg-emerald-100 p-3">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Thank You!</h3>
        <p className="max-w-md text-slate-600">
          Your information has been received. Our team will review your
          requirements and get back to you shortly.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setIsSubmitted(false)}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="te space-y-5">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Website or Social Media</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter website URL or social media link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="students"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Number of Students</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select student count" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="less-than-100">
                        Less than 100
                      </SelectItem>
                      <SelectItem value="100-500">100 - 500</SelectItem>
                      <SelectItem value="501-1000">501 - 1,000</SelectItem>
                      <SelectItem value="1001-5000">1,001 - 5,000</SelectItem>
                      <SelectItem value="more-than-5000">
                        More than 5,000
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="painPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pain Points / Problems to Solve</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe the challenges your school is facing that you need help with"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 md:flex-row">
              <FormField
                control={form.control}
                name="referral"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>How Did You Hear About Us?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="search">Search Engine</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="recommendation">
                          Recommendation
                        </SelectItem>
                        <SelectItem value="conference">
                          Educational Conference
                        </SelectItem>
                        <SelectItem value="advertisement">
                          Advertisement
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Your Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="administrator">
                          Administrator
                        </SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="it-manager">IT Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full text-white">
          {form.formState.isSubmitting
            ? "Submitting..."
            : "Get School Management Solutions"}
        </Button>
      </form>
    </Form>
  );
}
