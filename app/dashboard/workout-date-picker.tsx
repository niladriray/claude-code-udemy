"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function WorkoutDatePicker({ selectedDate }: { selectedDate: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const date = parseISO(selectedDate);

  function handleSelect(day: Date | undefined) {
    if (!day) return;
    setOpen(false);
    router.push(`/dashboard?date=${format(day, "yyyy-MM-dd")}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="size-4" />
          {format(date, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
