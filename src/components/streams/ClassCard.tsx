"use client";

import { Pencil, Trash, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClassCardProps {
  teacher: string;
  studentCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
  name: string;
}

export function ClassCard({
  teacher,
  studentCount,
  onEdit,
  onDelete,
  name,
}: ClassCardProps) {
  return (
    <TooltipProvider>
      <Card className="w-full max-w-xs shadow-sm hover:shadow transition-shadow duration-200 py-0">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold">{name}</h3>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-slate-100"
                    onClick={onEdit}
                  >
                    <Pencil size={16} className="text-slate-600" />
                    <span className="sr-only">Edit class</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit class</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-red-50"
                    onClick={onDelete}
                  >
                    <Trash size={16} className="text-red-500" />
                    <span className="sr-only">Delete class</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete class</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-2">
            Class Teacher: {teacher}
          </p>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={16} />
            <span className="text-sm">{studentCount} students</span>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
