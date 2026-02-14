# UI Coding Standards

## Component Library

All UI components **must** come from [shadcn/ui](https://ui.shadcn.com/). Do not create custom components. If a component is needed, install it via the shadcn CLI:

```bash
npx shadcn@latest add <component-name>
```

Installed components live in `components/ui/` and can be composed together to build any page or feature.

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/) with ordinal day suffixes:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the following date-fns format string:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy");
```
