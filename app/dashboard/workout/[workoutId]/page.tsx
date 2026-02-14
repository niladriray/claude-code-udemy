import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { workoutId } = await params;
  const workout = await getWorkoutById(userId, workoutId);
  if (!workout) redirect("/dashboard");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <EditWorkoutForm workout={workout} />
    </main>
  );
}
