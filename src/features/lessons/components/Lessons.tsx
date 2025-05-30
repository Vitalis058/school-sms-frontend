import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetAllSubjectsQuery,
  useGetAllTeachersQuery,
  useGetAllTimeSlotsQuery,
} from "@/redux/services";
import { StreamsType } from "@/types/types";
import { Plus } from "lucide-react";
import LoadingButton from "../../../components/LoadingButton";
import { createLessonAction } from "../actions/lessons_actions";

type LessonsProps = {
  stream?: StreamsType;
};

const initialState = {
  message: "",
  errors: {},
};

function Lessons({ stream }: LessonsProps) {
  const { data: teachers = [] } = useGetAllTeachersQuery();
  const { data: subjects = [] } = useGetAllSubjectsQuery();
  const { data: timeSlots = [] } = useGetAllTimeSlotsQuery();

  const [state, action, isPending] = useActionState(
    createLessonAction,
    initialState,
  );

  return (
    <div className="flex-1 rounded-lg p-2 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>{stream?.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>lessons</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Add Stream Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>Create New Lesson</DialogTitle>
              <DialogDescription>Add a new lesson .</DialogDescription>
            </DialogHeader>
            {state.message && (
              <p className="text-sm text-green-500">{state.message}</p>
            )}
            {state.errors?.error && (
              <p className="text-sm text-red-500">{state.errors.error[0]}</p>
            )}

            <form action={action} className="lg:grid lg:grid-cols-2 lg:gap-2">
              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input name="name" id="name" className="w-full" />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="timeSlot" className="text-right">
                  Time Slot
                </Label>
                <Select name="timeSlotId" disabled={!timeSlots.length}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the timeSlot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((item) => (
                      <SelectItem id="day" value={item.id} key={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <input className="hidden" name="streamId" value={stream?.id} />

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="teacher" className="text-right">
                  Teacher
                </Label>
                <Select name="teacherId">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem
                        key={teacher.id}
                        id="teacher"
                        value={teacher.id}
                      >
                        {teacher.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Select name="subjectId">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        id="subject"
                        value={subject.id}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="day" className="text-right">
                  Day
                </Label>
                <Select name="day">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem id="day" value={"1"}>
                      Monday
                    </SelectItem>
                    <SelectItem id="day" value={"2"}>
                      Tuesday
                    </SelectItem>
                    <SelectItem id="day" value={"3"}>
                      Wednesday
                    </SelectItem>
                    <SelectItem id="day" value={"4"}>
                      Thursday
                    </SelectItem>
                    <SelectItem id="day" value={"5"}>
                      Friday
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2">
                <LoadingButton className="w-full" loading={isPending}>
                  Create lesson
                </LoadingButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>Display the lessons here</div>
    </div>
  );
}

export default Lessons;
