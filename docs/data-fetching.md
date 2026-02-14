# Data Fetching Standards

## Server Components Only

All data fetching **must** happen in React Server Components. Do not fetch data in:

- Client components
- Route handlers
- Server actions
- Any other mechanism

Pass fetched data from server components to client components as props when needed.

## Database Query Functions

All database queries **must** live in helper functions inside the `data/` directory. These functions:

- **Must** use Drizzle ORM to query the database. Do not use raw SQL.
- **Must** accept a `userId` parameter and filter every query by it.
- **Must** be called from server components only.

Example structure:

```
data/
  workouts.ts    — workout-related queries
  exercises.ts   — exercise-related queries
```

## User Data Isolation

A logged in user must **only** be able to access their own data. Every query **must** include a `userId` filter. No exceptions.

Always verify the authenticated user via Clerk before querying:

```ts
const { userId } = await auth();
if (!userId) redirect("/");
```

Then pass `userId` to every `data/` helper function to scope the query.
