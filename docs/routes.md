# Routing Standards

## Route Structure

All application routes live under `/dashboard`. The root `/` page is a public landing page. Every feature page must be a sub-route of `/dashboard`:

```
/                              — Public landing page
/dashboard                     — Main dashboard (protected)
/dashboard/workout/new         — Create a new workout (protected)
/dashboard/workout/[workoutId] — View/edit a workout (protected)
```

When adding a new route, create it as a folder under `app/dashboard/` with a `page.tsx` file. Do not create top-level routes outside of `app/dashboard/` for authenticated features.

## Route Protection

Routes under `/dashboard` are protected and only accessible to logged-in users. Protection is enforced at two layers:

### 1. Middleware (primary gate)

The file `proxy.ts` runs Clerk's middleware on all non-static routes. Use `clerkMiddleware` with `createRouteMatcher` to redirect unauthenticated users away from `/dashboard` and its sub-routes:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

The middleware matcher in `proxy.ts` already skips Next.js internals and static files. Do not modify the matcher unless you have a specific reason.

### 2. Server component auth check (defence in depth)

Every protected page must also call `auth()` and redirect if there is no `userId`. This is a second layer of protection in case middleware is misconfigured:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/");
```

See `docs/auth.md` for full authentication standards.

## Rules

- All authenticated features must live under `/dashboard`. Do not create protected routes outside this prefix.
- Never rely solely on the server component `auth()` check for route protection — the middleware must be the primary gate.
- Internal links to protected pages must use the `/dashboard` prefix (e.g., `/dashboard/workout/new`, not `/workout/new`).
- Use Next.js `<Link>` from `next/link` for all internal navigation. Do not use `<a>` tags for in-app routes.
