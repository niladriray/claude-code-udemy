import { db } from "@/app/db";
import { workouts } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkoutById(userId: string, workoutId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}

export async function updateWorkoutById(
  userId: string,
  workoutId: string,
  name: string,
  date: string,
) {
  const [workout] = await db
    .update(workouts)
    .set({ name, date })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return workout;
}

export async function deleteWorkoutById(userId: string, workoutId: string) {
  const [workout] = await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return workout;
}

export async function insertWorkout(
  userId: string,
  name: string,
  date: string,
) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, date })
    .returning();
  return workout;
}

export async function getWorkoutsByDate(userId: string, date: string) {
  return db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, date)),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exerciseDefinition: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  });
}
