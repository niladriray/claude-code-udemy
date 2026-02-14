"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { format } from "date-fns";
import { insertWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  date: z.coerce.date(),
});

export async function createWorkout(name: string, date: Date) {
  const validated = createWorkoutSchema.parse({ name, date });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await insertWorkout(userId, validated.name, format(validated.date, "yyyy-MM-dd"));

  revalidatePath("/dashboard");
  redirect(`/dashboard?date=${format(validated.date, "yyyy-MM-dd")}`);
}
