# Authentication Standards

## Provider

This app uses [Clerk](https://clerk.com/) (`@clerk/nextjs`) for all authentication. Do not use any other auth provider or roll custom auth.

## Key Files

- `app/layout.tsx` — Wraps the app in `<ClerkProvider>`
- `proxy.ts` — Clerk middleware that runs on all non-static routes

## Server-Side Auth

Use `auth()` from `@clerk/nextjs/server` to get the current user in server components. Always verify the user is logged in before accessing protected data:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/");
```

## Client-Side Auth Components

Use Clerk's built-in components for all auth UI. Do not build custom sign-in or sign-up forms:

- `<SignInButton>` — Sign in trigger
- `<SignUpButton>` — Sign up trigger
- `<UserButton>` — Signed-in user avatar and menu
- `<SignedIn>` — Renders children only when authenticated
- `<SignedOut>` — Renders children only when unauthenticated

## Rules

- Every protected page **must** call `auth()` and redirect if `userId` is null.
- Never expose Clerk secret keys in client code. Use `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` for the client and `CLERK_SECRET_KEY` for the server, both via environment variables.
- The `userId` from Clerk is the canonical user identifier used across the entire app, including all database queries.
