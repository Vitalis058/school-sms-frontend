import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useFormContext } from "react-hook-form";
import { SubjectType } from "@/types/types";
import { TeacherEnrollmentType } from "@/utils/validation";

interface ProfessionalInfoProps {
  subjects: SubjectType[];
}

function ProfessionalInfo({ subjects }: ProfessionalInfoProps) {
  const { control } = useFormContext<TeacherEnrollmentType>();

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold">Educational Qualifications</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="highestQualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highest Qualification</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bachelor">
                    Bachelor&apos;s Degree
                  </SelectItem>
                  <SelectItem value="master">Master&apos;s Degree</SelectItem>
                  <SelectItem value="phd">PhD/Doctorate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mathematics Education" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="teachingExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Teaching Experience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">More than 10 years</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-6" />

      <h3 className="mb-4 text-lg font-semibold">Teaching Preferences</h3>
      <div className="space-y-6">
        <FormField
          control={control}
          name="subjects"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Subjects Can Teach</FormLabel>
                <FormDescription>
                  Select all subjects that the teacher is qualified to teach
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {subjects.map((subject) => (
                  <FormField
                    key={subject.id}
                    control={control}
                    name="subjects"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={subject.id}
                          className="flex flex-row items-start space-y-0 space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(subject.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, subject.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== subject.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {subject.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gradesCanTeach"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Grades Can Teach</FormLabel>
                <FormDescription>
                  Select all grades that the teacher can teach
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <FormField
                    key={grade}
                    control={control}
                    name="gradesCanTeach"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={grade}
                          className="flex flex-row items-start space-y-0 space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(grade.toString())}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      grade.toString(),
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) =>
                                          value !== grade.toString(),
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Grade {grade}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default ProfessionalInfo;
