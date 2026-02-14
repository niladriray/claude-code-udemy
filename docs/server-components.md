# Server Component Standards

## Async Props: `params` and `searchParams`

In Next.js 15+, `params` and `searchParams` are **Promises** and **must** be awaited before use. Never destructure them synchronously.

### `params`

Type as `Promise<{ ... }>` and `await` before accessing values:

```tsx
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  // use workoutId
}
```

### `searchParams`

Same pattern — type as a `Promise` and `await`:

```tsx
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  // use date
}
```

### Rules

- **Always** type `params` and `searchParams` as `Promise<...>`.
- **Always** `await` them at the top of the function body before reading any property.
- **Never** access properties directly (e.g., `params.workoutId`) without awaiting first — this will cause a runtime error.

## Authentication Guard

Every protected server component **must** call `auth()` from `@clerk/nextjs/server` and redirect unauthenticated users before any data fetching. See `docs/auth.md` for full details.

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/");
```

## Data Fetching

Server components fetch data by calling helper functions from the `data/` directory. See `docs/data-fetching.md` for full details.

- Pass the authenticated `userId` to every data helper.
- Keep data fetching in server components only — never in client components.
