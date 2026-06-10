# AyosDocs — Agent Guide

## One-liner
Next.js 16 app (App Router, JS, not TS) helping Filipinos navigate government paperwork. Content-driven guides in Markdown + MongoDB for user data + AI chat assistant (Claude Haiku via Bedrock + Qdrant vector DB) + Docker Compose deploy on AWS EC2.

## Commands (run from repo root)
| Command | What |
|---|---|
| `npm run dev` | Next.js dev (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint 9 (eslint-config-next core-web-vitals, runs with `--quiet`) |
| `npm run setup-env` | Requires Ansible Vault password — generates `app/.env.local` and `app/.env.tunnel` from `infra/ansible/vars/secrets.yml` |

All root commands proxy to the `app/` workspace. Run any single-workspace command with `npm run <cmd -w app`.

## Architecture
- **Monorepo** — npm workspaces with a single package: `app/`
- **`app/`** — Next.js 16 standalone output; `@/*` maps to `app/src/*`
- **`app/src/data/guides/`** — JSON files (no CMS). Guides parsed via `JSON.parse` server-side. Frontmatter fields: title, shortTitle, slug, description, lastUpdated, category, agency, difficulty, estimatedTime, costRange, tags, aliases, checklist
- **`app/src/models/`** — Mongoose models: User, GuideStats, RateLimit
- **`app/src/lib/ai/provider.js`** — AI config: Claude 3 Haiku via AWS Bedrock, Cohere Multilingual v3 embeddings, Qdrant client
- **`app/src/app/api/chat/route.js`** — Streaming RAG endpoint: embed user query → Qdrant search → Claude Haiku generation
- **`app/src/components/chat/ChatAssistant.js`** — Floating chat bubble UI, uses `useChat()` from `@ai-sdk/react`
- **`scripts/index-guides.mjs`** — Chunks guides, generates embeddings, upserts to Qdrant
- **`app/src/lib/`** — MongoDB connect, auth (NextAuth + Google OAuth + credentials with JWT), rate-limit, metrics (prom-client), mail, seed
- **`infra/terraform/`** + **`infra/ansible/`** — AWS EC2 provisioning + Cloudflare DNS; secrets managed via Ansible Vault
- **`docker/compose/`** — full stack: app, mongodb, nginx, qdrant, watchtower, Prometheus, Grafana, Alertmanager, node-exporter, cadvisor, backup (rclone to Cloudflare R2)
- **CI** — `.github/workflows/pipeline.yml` (triggers on `master`): lint → Docker build → Trivy scan (CRITICAL/HIGH only) → push to ghcr.io

## Style & conventions
- **No TypeScript** — plain JS with JSDoc on exported functions/components
- **Tailwind CSS 4** — Catppuccin theme (`@catppuccin/tailwindcss`), typography plugin; PostCSS via `@tailwindcss/postcss`
- **Server Components** preferred; Server Actions for mutations
- Pages use `PageHeader`, `HolidayAlert`, `Banner` standardized components; main container max-width 1600px with `px-6 lg:px-10`

## Build quirks
- `next.config.mjs` sets `output: 'standalone'` (Docker)
- Docker build needs dummy `MONGO_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` env vars (provided in `app/Dockerfile`)
- AI features need `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `QDRANT_URL`, `AI_ENABLED` at runtime

## Notable missing pieces
- **No tests** — no test files, test runner, or test scripts anywhere in the repo
- `.env*` files are gitignored
- `.next/`, `out/`, `build/` gitignored
