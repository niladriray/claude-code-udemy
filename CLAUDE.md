# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Project Standards

Before generating any code, **always** read and follow the relevant docs in the `docs/` directory. These contain mandatory coding standards for this project:

- `docs/ui.md` — UI component and date formatting standards

## Commands

- `npm run dev` — Start development server (http://localhost:3000)
- `npm run build` — Production build
- `npm run start` — Start production server (requires build first)
- `npm run lint` — Run ESLint (flat config with Next.js core-web-vitals + TypeScript rules)

## Architecture

This is a **Next.js 16** app using the **App Router**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Key Directories

- `app/` — App Router root: pages, layouts, and global styles. Add new routes as folders with `page.tsx` files (e.g., `app/dashboard/page.tsx` → `/dashboard`).
  - `layout.tsx` — Root layout; loads Geist and Geist Mono fonts via `next/font/google`
  - `page.tsx` — Home page (`/`)
  - `globals.css` — Global styles and Tailwind theme tokens
- `public/` — Static assets (SVGs, images) served at `/` (e.g., `public/next.svg` → `/next.svg`)

## Path Alias

`@/*` maps to the project root, configured in `tsconfig.json`. Use it for all imports:
```ts
import { Something } from "@/app/components/Something";
```

## Styling

- **Tailwind CSS v4** with PostCSS (`@tailwindcss/postcss`). There is **no `tailwind.config` file** — this is v4, not v3.
- Tailwind is imported via `@import "tailwindcss"` in `app/globals.css`
- Custom theme tokens are defined with `@theme inline` in `globals.css`:
  - `--color-background` / `--color-foreground` — adapt to light/dark via `prefers-color-scheme`
  - `--font-sans` / `--font-mono` — mapped to Geist font CSS variables set in `layout.tsx`
- Use Tailwind utility classes (e.g., `bg-background`, `text-foreground`, `font-sans`, `font-mono`) to reference these tokens
- Dark mode uses the `dark:` variant with `prefers-color-scheme` (media strategy, not class-based)

### ESLint

Uses ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next` core-web-vitals and TypeScript presets.
