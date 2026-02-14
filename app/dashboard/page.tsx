import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { PencilIcon, PlusIcon } from "lucide-react";
import { getWorkoutsByDate } from "@/data/workouts";
import { WorkoutDatePicker } from "./workout-date-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const selectedDate = params.date ?? format(new Date(), "yyyy-MM-dd");

  const userWorkouts = await getWorkoutsByDate(userId, selectedDate);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/workout/new">
              <PlusIcon className="size-4" />
              New Workout
            </Link>
          </Button>
          <WorkoutDatePicker selectedDate={selectedDate} />
        </div>
      </div>

      {userWorkouts.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">
          No workouts logged for this date.
        </p>
      ) : (
        <div className="space-y-6">
          {userWorkouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{workout.name ?? "Untitled Workout"}</CardTitle>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/workout/${workout.id}`}>
                    <PencilIcon className="size-4" />
                  </Link>
                </Button>
                {workout.startedAt && workout.completedAt && (
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(workout.startedAt), "h:mm a")} &ndash;{" "}
                    {format(new Date(workout.completedAt), "h:mm a")}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {workout.workoutExercises.map((we) => (
                  <div key={we.id}>
                    <h3 className="mb-2 font-medium">
                      {we.exerciseDefinition.name}
                    </h3>
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
                          {we.sets.map((set) => (
                            <tr
                              key={set.id}
                              className="border-b last:border-0"
                            >
                              <td className="px-3 py-2">{set.setNumber}</td>
                              <td className="px-3 py-2">
                                {set.weight
                                  ? `${parseFloat(set.weight)} lbs`
                                  : "—"}
                              </td>
                              <td className="px-3 py-2">
                                {set.reps ?? "—"}
                              </td>
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
