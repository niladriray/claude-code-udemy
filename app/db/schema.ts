import { relations } from "drizzle-orm";
import {
  date,
  index,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ── Exercise Definitions (catalog/reference table) ──────────────────────────

export const exerciseDefinitions = pgTable(
  "exercise_definitions",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("exercise_definitions_user_id_name_idx").on(table.userId, table.name)]
);

// ── Workouts (workout sessions) ─────────────────────────────────────────────

export const workouts = pgTable(
  "workouts",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    name: text(),
    date: date({ mode: "string" }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("workouts_user_id_idx").on(table.userId),
    index("workouts_user_id_date_idx").on(table.userId, table.date),
  ]
);

// ── Workout Exercises (exercises within a session) ──────────────────────────

export const workoutExercises = pgTable(
  "workout_exercises",
  {
    id: uuid().primaryKey().defaultRandom(),
    workoutId: uuid("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseDefinitionId: uuid("exercise_definition_id")
      .notNull()
      .references(() => exerciseDefinitions.id, { onDelete: "cascade" }),
    order: smallint().notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("workout_exercises_workout_id_idx").on(table.workoutId)]
);

// ── Workout Sets (sets within an exercise) ──────────────────────────────────

export const workoutSets = pgTable(
  "workout_sets",
  {
    id: uuid().primaryKey().defaultRandom(),
    workoutExerciseId: uuid("workout_exercise_id")
      .notNull()
      .references(() => workoutExercises.id, { onDelete: "cascade" }),
    setNumber: smallint("set_number").notNull(),
    weight: numeric({ precision: 7, scale: 2 }),
    reps: smallint(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("workout_sets_workout_exercise_id_idx").on(table.workoutExerciseId),
  ]
);

// ── Relations ───────────────────────────────────────────────────────────────

export const exerciseDefinitionsRelations = relations(
  exerciseDefinitions,
  ({ many }) => ({
    workoutExercises: many(workoutExercises),
  })
);

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exerciseDefinition: one(exerciseDefinitions, {
      fields: [workoutExercises.exerciseDefinitionId],
      references: [exerciseDefinitions.id],
    }),
    sets: many(workoutSets),
  })
);

export const workoutSetsRelations = relations(workoutSets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [workoutSets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));
