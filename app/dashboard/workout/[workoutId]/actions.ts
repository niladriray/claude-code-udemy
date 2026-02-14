"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { format } from "date-fns";
import { updateWorkoutById, deleteWorkoutById } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  date: z.coerce.date(),
});

export async function updateWorkout(
  workoutId: string,
  name: string,
  date: Date,
) {
  const validated = updateWorkoutSchema.parse({ name, date });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await updateWorkoutById(
    userId,
    workoutId,
    validated.name,
    format(validated.date, "yyyy-MM-dd"),
  );

  revalidatePath("/dashboard");
}

export async function deleteWorkout(workoutId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await deleteWorkoutById(userId, workoutId);

  revalidatePath("/dashboard");
}
