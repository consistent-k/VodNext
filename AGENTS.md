# AGENTS.md

## Project Overview

VodNext is a multi-platform video aggregator player built with Next.js (React) and Tauri for desktop. It supports web and desktop (Windows, macOS, Linux) with features like category browsing, search, and video playback.

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript (strict mode)
- **State**: Zustand (with persist middleware)
- **UI**: Ant Design 6 + Tailwind CSS 4 + SCSS modules
- **Desktop**: Tauri 2 (Rust backend in `src-tauri/`)
- **HTTP**: Axios (web) / Tauri plugin-http (desktop)
- **Package Manager**: pnpm 10.10.0

## Build/Lint/Test Commands

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Production build (standalone mode)
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm export:dev   # Dev server with export mode (for Tauri)
pnpm export       # Export build (generates static files for Tauri)
pnpm commit       # Interactive commit with commitizen

# Desktop (Tauri) builds
pnpm tauri dev    # Start Tauri dev mode
pnpm tauri build  # Build desktop app
```

**Testing**: No test framework is configured. No test files exist in the project source.

**Pre-commit**: Husky + lint-staged runs on staged `./app/**/*.{js,ts,jsx,tsx,json,html,css,md}` files:

- `eslint --fix`
- `prettier --write`

**Commit messages**: Enforced via commitlint with conventional commits format (`feat:`, `fix:`, `docs:`, etc.).

## Code Style Guidelines

### Formatting (Prettier)

- Single quotes
- No trailing commas
- 4-space indentation
- Print width: 200
- Line endings: LF

### Imports

Import ordering is enforced by ESLint (`import/order` rule):

```
1. Node builtins
2. External packages
3. Internal (@/), parent, sibling, index imports
```

Separate groups with blank lines. Alphabetize within groups (case-insensitive).

**Path alias**: Use `@/*` for root-relative imports (e.g., `@/lib/store/useThemeStore`).

```typescript
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';
```

### TypeScript

- `strict: true` in tsconfig
- `@typescript-eslint/no-explicit-any`: **off** (any is allowed)
- `@typescript-eslint/ban-ts-comment`: **off**
- Prefer interfaces for object shapes (see `lib/types/index.ts`)
- Use generics for API responses (`async get<T>(url, config): Promise<T>`)

### Naming Conventions

- **Components**: PascalCase (e.g., `InitProvider`, `BasicLayout`)
- **Hooks**: camelCase with `use` prefix (e.g., `useIsMobile`, `useThemeStore`)
- **Stores**: camelCase with `use` prefix + `Store` suffix (e.g., `useSettingStore`)
- **Files**: Components as `.tsx`, others as `.ts`
- **SCSS modules**: `index.module.scss` co-located with components

### Components

- Client components: Add `'use client'` directive at top of file
- Use arrow functions or function declarations consistently (both used in codebase)
- Props: Destructure in function signature

### State Management

- Zustand stores with `persist` middleware for localStorage
- Valtio is a dependency (may be used for reactive proxy state)
- Store naming: `use{Name}Store.ts` in `lib/store/`

### Error Handling

- HTTP errors: Return `Promise.reject(error)` in interceptors
- API calls: Wrap in try/catch, re-throw with `Promise.reject`
- No global error boundary found; handle errors in components

### Styling

- SCSS modules preferred (`*.module.scss`)
- Tailwind utility classes for layout
- Ant Design components for UI elements

## Project Structure

```
app/              # Next.js App Router pages
  layout.tsx      # Root layout
  layouts/        # Layout components
  home/           # Home page
  category/       # Category browsing
  detail/         # Video detail
  setting/        # Settings page
components/       # Shared UI components
  providers/      # Context providers
  video/          # Video player components
lib/              # Business logic & utilities
  hooks/          # Custom React hooks
  store/          # Zustand stores
  types/          # TypeScript interfaces
  utils/          # Utility functions & request client
services/         # API service layer
  vodhub/         # VodHub API integration
src-tauri/        # Tauri desktop (Rust)
```

## Cursor Rules

Project is a Next.js + Tauri video aggregator supporting web and desktop. Chinese comments are common in type definitions and workflow files. See `.cursor/rules/` for detailed project context.
