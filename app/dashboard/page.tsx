"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const mockWorkouts = [
  {
    id: "1",
    name: "Push Day",
    startedAt: "2026-02-14T08:00:00Z",
    completedAt: "2026-02-14T09:15:00Z",
    exercises: [
      {
        id: "1",
        name: "Bench Press",
        sets: [
          { id: "1", setNumber: 1, weight: 135, reps: 10 },
          { id: "2", setNumber: 2, weight: 155, reps: 8 },
          { id: "3", setNumber: 3, weight: 175, reps: 6 },
        ],
      },
      {
        id: "2",
        name: "Overhead Press",
        sets: [
          { id: "4", setNumber: 1, weight: 85, reps: 10 },
          { id: "5", setNumber: 2, weight: 95, reps: 8 },
          { id: "6", setNumber: 3, weight: 105, reps: 6 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Pull Day",
    startedAt: "2026-02-14T17:00:00Z",
    completedAt: "2026-02-14T18:15:00Z",
    exercises: [
      {
        id: "3",
        name: "Deadlift",
        sets: [
          { id: "7", setNumber: 1, weight: 225, reps: 8 },
          { id: "8", setNumber: 2, weight: 275, reps: 5 },
          { id: "9", setNumber: 3, weight: 315, reps: 3 },
        ],
      },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  function handleSelect(day: Date | undefined) {
    if (!day) return;
    setDate(day);
    setOpen(false);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
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
      </div>

      {mockWorkouts.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          No workouts logged for this date.
        </p>
      ) : (
        <div className="space-y-6">
          {mockWorkouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {format(new Date(workout.startedAt), "h:mm a")} &ndash;{" "}
                  {format(new Date(workout.completedAt), "h:mm a")}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id}>
                    <h3 className="mb-2 font-medium">{exercise.name}</h3>
                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-muted-foreground border-b">
                            <th className="px-3 py-2 text-left font-medium">
                              Set
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                              Weight
                            </th>
                            <th className="px-3 py-2 text-left font-medium">
                              Reps
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set) => (
                            <tr
                              key={set.id}
                              className="border-b last:border-0"
                            >
                              <td className="px-3 py-2">{set.setNumber}</td>
                              <td className="px-3 py-2">{set.weight} lbs</td>
                              <td className="px-3 py-2">{set.reps}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
