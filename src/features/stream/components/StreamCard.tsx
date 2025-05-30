"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Edit3, Ellipsis, Trash2Icon, Users } from "lucide-react";

interface ClassCardProps {
  teacher: string;
  studentCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
  name: string;
}

export function StreamCard({ teacher, studentCount, name }: ClassCardProps) {
  return (
    <TooltipProvider>
      <Card className="w-full max-w-xs py-0 shadow-sm transition-shadow duration-200 hover:shadow">
        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="text-lg font-bold">{name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger className="self-start outline-0">
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit3 className="text-primary" />
                  <p>Edit</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Trash2Icon className="text-red-500" />
                  <p>Delete</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-muted-foreground mb-2 text-sm">
            Class Teacher: {teacher}
          </p>

          <div className="text-muted-foreground flex items-center gap-1.5">
            <Users size={16} />
            <span className="text-sm">{studentCount} students</span>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
