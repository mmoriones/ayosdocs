# Next.js Migration Plan: AyosDocs

This plan outlines the process of migrating the AyosDocs project from a decoupled Vite/Express architecture to a unified Next.js (App Router) full-stack application.

## 1. Project Initialization & Setup
- [x] Initialize a new Next.js project with App Router.
- [x] Install essential dependencies:
  - Frontend: `lucide-react`, `react-icons`, `react-markdown`, `gray-matter`, `rehype-slug`, `rehype-autolink-headings`, `remark-gfm`.
  - Backend/Auth: `mongoose`, `next-auth`, `google-auth-library`, `jsonwebtoken`, `nodemailer`.
  - Utility: `axios`, `@tanstack/react-query`.
- [x] Configure Tailwind CSS 4 (porting settings from `client/src/tailwind.config.js`).
- [x] Set up environment variables in a single `.env.local` file.
- [x] Create a MongoDB utility file for database connection management (singleton pattern).

## 2. Core UI & Layout Migration
- [x] Port `MainLayout.jsx` to `app/layout.jsx`.
- [x] Port global styles from `client/src/index.css`.
- [x] Port common UI components (`client/src/components/`, `client/src/features/navigation/`).
- [x] Migrate `ToastContext` and `ThemeContext`.

## 3. Data & Content Migration (The "Guides")
- [x] Move Markdown files to a new `content/guides/` or `data/guides/` directory in the root.
- [x] Implement a server-side utility to read and parse Markdown files using `fs` and `gray-matter`.
- [x] Implement `generateStaticParams` in `app/guides/[slug]/page.jsx` for SSG of all guides.

## 4. Authentication Migration (NextAuth.js)
- [x] Configure `app/api/auth/[...nextauth]/route.js` with Google Provider.
- [x] Map NextAuth user sessions to existing MongoDB user profiles.
- [x] Port the `User` model to a shared directory.
- [x] Update components to use the `useSession()` hook for client-side auth state.

## 5. Page & Feature Migration
- [x] **Home Page:** Migrate `Home.jsx` to `app/page.jsx`.
- [x] **All Guides:** Migrate `AllGuides.jsx` to `app/guides/page.jsx`.
- [x] **Guide Detail:** Migrate `Guide.jsx` to `app/guides/[slug]/page.jsx`.
- [x] **My Docs:** Migrate `UserProgress.jsx` to `app/my-docs/page.jsx`.
- [x] **Offices Page:** Port community-driven directory and ratings.
- [x] **Rate Page:** Migrate the experience sharing form.
- [x] **Static Pages:** Migrate About, Contact, FAQ, Privacy, Terms.
- [x] **Onboarding:** Migrate onboarding completion flow.
- [x] **Verified:** Migrate email verification landing page.

## 6. Backend Logic Migration (API Routes & Server Actions)
- [x] Implement API routes for:
  - Progress updates (`/api/user/update-progress`)
  - Fetching progress (`/api/user/get-progress/[slug]`)
  - Deleting progress (`/api/user/delete-progress/[slug]`)
  - Onboarding status (`/api/user/update-onboarding`).
  - Retrieving all user progress data (`/api/user/all-data`).
- [x] Refactor mutations to use Next.js Server Actions for better performance and less boilerplate.

## 7. SEO & Metadata
- [x] Implement the `generateMetadata` function for the guide pages.
- [x] Configure a global `sitemap.js` for automatic sitemap generation.
- [x] Set up `robots.js`.

## 8. Verification & Finalization
- [x] Thoroughly test the login/logout flow (Build verified).
- [x] Verify that guide progress is correctly saved and loaded.
- [x] Check SEO performance and metadata rendering.
- [x] Perform a final cleanup of the old `client` and `server` directories.

## Verification Steps
- [x] User can log in via Google.
- [x] Guides are visible and SEO-friendly (check raw HTML output).
- [x] Progress is saved to MongoDB and persists across sessions.
- [x] Dark/Light theme preference is preserved.
- [x] Mobile navigation works as expected.
