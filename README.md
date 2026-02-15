This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Tech Stack & Configuration

### [Clerk](https://clerk.com) — Authentication

- `@clerk/nextjs` v6 for authentication and user management
- `ClerkProvider` wraps the app in `app/layout.tsx`
- Middleware in `proxy.ts` uses `clerkMiddleware()` to protect all `/dashboard` routes
- Server components use `auth()` from `@clerk/nextjs/server` to get `userId`
- Built-in UI components: `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>`
- Environment variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

### [Neon](https://neon.tech) — Serverless Postgres Database

- `@neondatabase/serverless` for HTTP-based serverless connections
- Database connection configured via `DATABASE_URL` environment variable
- Connection uses Neon's pooler endpoint with SSL required
- Database schema includes 4 tables: `exercise_definitions`, `workouts`, `workout_exercises`, `workout_sets`
- All tables include `user_id` for row-level data isolation

### [Drizzle](https://drizzle.team) — TypeScript ORM

- `drizzle-orm` with `drizzle-kit` for migrations
- Config in `drizzle.config.ts` — dialect: `postgresql`, schema: `./app/db/schema.ts`, output: `./drizzle`
- Database client initialized in `app/db/index.ts` using `drizzle-orm/neon-http`
- Schema and relations defined in `app/db/schema.ts`
- Data access functions in `/data/workouts.ts` with user isolation on all queries

### [shadcn/ui](https://shadcn.com) — UI Components

- Configured in `components.json` with `new-york` style and React Server Components enabled
- Components installed to `/components/ui/`: `button`, `card`, `input`, `label`, `calendar`, `popover`
- Uses Tailwind CSS v4 (no `tailwind.config` file — configured via `app/globals.css`)
- Icon library: `lucide-react`
- Headless primitives: `@radix-ui`
- Date formatting: `date-fns` with `"do MMM yyyy"` format

### [Vercel](https://vercel.com) — Deployment

- No custom `vercel.json` — uses Next.js defaults for automatic deployment
- Next.js 16 App Router with server components and server actions are natively supported
- Environment variables (`DATABASE_URL`, Clerk keys) mapped as Vercel secrets
- Middleware (`proxy.ts`) runs on Vercel Edge Runtime
- Build command: `npm run build`, start: `npm run start`
