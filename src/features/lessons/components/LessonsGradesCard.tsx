"use client";

import { GraduationCapIcon, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useActionState } from "react";

import { Card, CardContent } from "../../../components/ui/card";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StreamsType } from "@/types/types";
import { createTimeSlot } from "../actions/time_slot_actions";

type StreamsCardTypes = {
  setSelectedStream: Dispatch<SetStateAction<StreamsType | undefined>>;
  streams?: StreamsType[];
  selectedStream?: StreamsType;
};

function LessonsStreamsCard({
  setSelectedStream,
  streams,
  selectedStream,
}: StreamsCardTypes) {
  const initialState = {
    message: "",
    error: {},
  };

  const [state, action, isPending] = useActionState(
    createTimeSlot,
    initialState,
  );

  return (
    <div className="w-full max-w-[300px] flex-1">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <GraduationCapIcon className="h-6 w-6 text-slate-700" />
          <p className="text-lg font-semibold">Streams</p>
        </span>
        <Dialog>
          <DialogTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size={"icon"}>
                    <Plus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  Add time slot
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            {state.message && (
              <p className="text-sm text-green-500">{state.message}</p>
            )}
            {state.error?.error && (
              <p className="text-sm text-red-500">{state.error.error[0]}</p>
            )}

            <DialogHeader>
              <DialogTitle>Create time slot</DialogTitle>
              <DialogDescription>
                Create your time slots here that will be used in creating the
                lessons.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-5"
              action={action}
            >
              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input name="name" id="name" className="w-full" />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="startTime" className="text-right">
                  Start time
                </Label>
                <Input
                  name="startTime"
                  id="startTime"
                  type="time"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 lg:col-span-1">
                <Label htmlFor="endTime" className="text-right">
                  End time
                </Label>
                <Input
                  name="endTime"
                  id="endTime"
                  type="time"
                  className="w-full"
                />
              </div>

              <div className="lg:col-span-2">
                <LoadingButton className="w-full" loading={isPending}>
                  Create time slot
                </LoadingButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {!streams ? (
        <p>No Streams</p>
      ) : (
        <div className="space-y-3">
          {streams.map((streamItem) => (
            <Card
              key={streamItem.id}
              className={`border-muted-foreground w-full cursor-pointer py-2 transition-all duration-200 hover:shadow-md ${
                selectedStream?.id === streamItem.id
                  ? "bg-muted border-primary"
                  : ""
              }`}
              onClick={() => setSelectedStream(streamItem)}
            >
              <CardContent className="px-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="line-clamp-1 text-sm font-bold">
                        {streamItem.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default LessonsStreamsCard;
