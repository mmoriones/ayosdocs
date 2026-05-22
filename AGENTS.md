# AyosDocs

Philippine government process guide platform. Next.js 16 App Router, React 19, Tailwind CSS 4, MongoDB, NextAuth.

## Source layout

- `app/src/` — mapped to `@/` alias (see `jsconfig.json`)
- `app/src/app/` — Next.js App Router pages (server components) + API routes + Server Actions
- `app/src/components/` — shared React components: `ui/`, `layout/`, dashboard/
- `app/src/features/` — feature modules (`auth/`, `guides/`), each with a `components/` subtree
- `app/src/context/` — React contexts (theme, toast, search, workspace)
- `app/src/lib/` — server utilities (auth, MongoDB, Mongoose models, rate-limit, mail, metrics)
- `app/src/data/guides/` — 25 markdown guides with YAML frontmatter
- `app/src/data/bundles.js` — life-event bundle definitions

## Commands

Run from repo root; delegates to `app/` workspace.

| Command | What it does |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build (standalone output) |
| `npm run start` | Production server |
| `npm run lint` | ESLint (quiet mode) |

No test framework is configured.

## Key conventions

- **Server → Client split:** Page files (`page.js`) are server components that fetch data and pass it to `*Client.js` client components. Server Actions in `app/src/app/actions/` handle mutations.
- **Auth:** NextAuth with Google OAuth + credentials. Session strategy is JWT, 30-day expiry. DB-backed user profiles with rate-limited login (5 attempts, 15-min lockout).
- **Theme:** `next-themes` with class-based Catppuccin. Light = `.latte`, dark = `.mocha`. Use `useTheme()` from `@/context` (exposes `theme`, `setTheme`, `toggleTheme`, `actualTheme`).
- **UI components:** Reusable components in `components/ui/`, barrel-exported from `@/components/ui`. Use these; avoid ad-hoc button/input/modal styles.
- **Styling:** Tailwind v4 with `@import "tailwindcss"` + `@theme` block in `globals.css`. Catppuccin CSS variables (`ctp-base`, `ctp-text`, `ctp-sky-800`, etc.). No Tailwind config file.
- **Imports:** Prefer barrel imports where available (`@/context`, `@/components/layout`, `@/components/ui`, feature component barrels).
- **Guide content:** Markdown in `src/data/guides/`. Frontmatter includes: `title`, `shortTitle`, `slug`, `description`, `lastUpdated`, `category`, `agency`, `difficulty`, `estimatedTime`, `costRange`, `tags`, `checklist`. TOC is extracted from `##` headings only.
- **Data fetching:** TanStack React Query + Axios on the client. `staleTime: 60s`, `refetchOnWindowFocus: false`. Query key convention: `['user-data']` for full user payload, `['progress', slug]` for per-guide progress.
- **JSDoc:** Use JSDoc on all exported functions and components. No TypeScript.
- **CSP:** Strict Content Security Policy is enforced via `next.config.mjs` headers. External image sources must be added to `remotePatterns`.

## Infrastructure

- Docker Compose with app + MongoDB + nginx + backup + monitoring stack
- CI: GitHub Actions (lint → Docker build → Trivy scan → push to GHCR)
- Secrets managed via Ansible Vault; `npm run setup-env` to bootstrap `.env.local`
- Build output: `output: 'standalone'` in Next.js config; Dockerfile at `app/Dockerfile`
