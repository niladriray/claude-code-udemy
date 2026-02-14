# Data Mutation Standards

## Server Actions Only

All data mutations **must** happen via Next.js server actions. Do not mutate data in:

- Client components
- Route handlers
- Server components
- Any other mechanism

## Server Action Files

All server actions **must** live in colocated `actions.ts` files next to the page that uses them. Do not define server actions inline in components or in shared/global files.

Example structure:

```
app/
  workouts/
    page.tsx        — server component (renders UI)
    actions.ts      — server actions for this route
  workouts/[id]/
    page.tsx
    actions.ts
```

Every `actions.ts` file **must** start with the `"use server"` directive at the top of the file.

## Server Action Parameters

All server action parameters **must** be explicitly typed. Do **not** use `FormData` as a parameter type. Instead, define typed parameters directly.

**Correct:**

```ts
"use server";

export async function createWorkout(name: string, date: Date) {
  // ...
}
```

**Incorrect:**

```ts
"use server";

export async function createWorkout(formData: FormData) {
  // ...
}
```

## Zod Validation

All server actions **must** validate their arguments using [Zod](https://zod.dev/) before performing any mutation. Define schemas alongside the action and parse inputs at the top of the function body.

```ts
"use server";

import { z } from "zod";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkout(name: string, date: Date) {
  const validated = createWorkoutSchema.parse({ name, date });
  // use validated.name, validated.date from here on
}
```

## Database Mutation Functions

All database mutations **must** live in helper functions inside the `data/` directory. These functions:

- **Must** use Drizzle ORM to perform mutations. Do not use raw SQL.
- **Must** accept a `userId` parameter and scope every mutation by it.
- **Must** only be called from server actions.

Example structure:

```
data/
  workouts.ts    — workout queries and mutations
  exercises.ts   — exercise queries and mutations
```

Example mutation helper:

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function insertWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date });
}

export async function deleteWorkout(userId: string, workoutId: number) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## User Data Isolation

The same rules from `data-fetching.md` apply to mutations. A user must **only** be able to modify their own data. Every mutation helper **must** include a `userId` filter. No exceptions.

Always verify the authenticated user via Clerk in the server action before calling any `data/` helper:

```ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { insertWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkout(name: string, date: Date) {
  const validated = createWorkoutSchema.parse({ name, date });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await insertWorkout(userId, validated.name, validated.date);
}
```

## Redirects

Do **not** call `redirect()` inside server actions. Server actions should return data or throw errors — nothing more. All redirects **must** happen client-side after the server action call resolves.

```ts
// In the client component:
const result = await createWorkout(name, date);
router.push("/dashboard");
```

## Revalidation

After a successful mutation, use `revalidatePath` from `next/cache` to refresh the relevant route data:

```ts
import { revalidatePath } from "next/cache";

// at the end of the server action, after the mutation succeeds
revalidatePath("/workouts");
```
