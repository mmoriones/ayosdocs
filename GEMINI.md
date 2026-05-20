# AyosDocs Project Overview

AyosDocs is a full-stack web application designed to help Filipinos navigate government documentation and applications through interactive guides.

## Product Vision

AyosDocs is evolving from a collection of guides into a **workflow platform** that helps Filipinos successfully accomplish government processes and life-event requirements. The platform follows a layered evolution:

1.  **Government Guide Platform:** Step-by-step guides, requirements, fees, and office info.
2.  **Personal Progress Tracker:** Checklist system, tracking, and completion history.
3.  **Life Event Workflow System:** Bundled requirements for goals like "Starting a Business" or "Getting Married".
4.  **Community Intelligence Platform:** Office ratings, crowdsourced wait times, and processing insights.

## Feature Specifications (v1.0)

### 1. My Docs Page
A personal dashboard for tracking government tasks.
-   **Stats:** Active Guides, Completed Guides, Favorites.
-   **Tabs:**
    -   **In Progress:** Partially completed or checklist started.
    -   **Completed:** Fully checked or manually marked.
    -   **Favorites:** Bookmarked guides.

### 2. Requirement Bundles (Life Event Bundles)
Bundled guides for specific life goals.
-   **Examples:** Wedding Requirements, First Job Bundle, Starting a Business.
-   **Structure:** Includes core "Required Guides" and helpful "Optional Guides".
-   **Tracking:** Progress is tracked at the bundle level (e.g., "Wedding Bundle: 3/8 completed").

### 3. All Guides Page
A searchable knowledge base.
-   **Search:** Supports names, aliases, abbreviations, and common misspellings.
-   **Filtering:** By Category, Government Agency, Difficulty Level, Processing Time, and Cost Range.

### 4. Government Office Ratings
Structured community insights to avoid misinformation.
-   **Ratings:** Speed, Staff Friendliness, Queue Management, Facility Cleanliness.
-   **Structured Feedback:** Appointment availability, actual waiting time, and extra requirement requests.
-   **Aggregation:** Prioritize aggregate insights (e.g., "Average waiting time") over raw comments.

## Architecture

The project is structured as a monorepo-style workspace to separate application logic from infrastructure and documentation.

- **Root Workspace:** Managed via `package.json` workspaces.
- **Application (`/app`):** The unified full-stack application built with **Next.js (App Router)**.
  - **Frontend:** React 19 components using Server and Client components. Styling is powered by **Tailwind CSS 4**.
  - **Backend:** Next.js API Routes and **Server Actions** handle business logic and database interactions.
  - **Content Management:** Guides are authored in Markdown and stored in `app/src/data/guides/`. They are parsed server-side and rendered using React Markdown.
  - **Database:** MongoDB (via Mongoose) stores user profiles and their progress.
  - **Authentication:** NextAuth.js with Google Provider managed through `app/src/app/api/auth/`.
- **Documentation (`/docs`):** Project-wide documentation, architecture diagrams, and runbooks.
- **Infrastructure (`/infra`):** Terraform and Ansible configurations.
- **Docker (`/docker`):** Orchestration and monitoring configurations.

## Core Technologies

### Stack
-   **Framework:** Next.js 16+ (App Router)
-   **Runtime:** Node.js
-   **Styling:** Tailwind CSS 4
-   **Database:** MongoDB (Mongoose)
-   **Auth:** NextAuth.js (Google OAuth)
-   **Data Fetching:** TanStack React Query & Axios
-   **Content:** React Markdown, gray-matter

## Getting Started

### Prerequisites
-   Node.js installed
-   MongoDB instance (local or Atlas)
-   Google Cloud Console project (for OAuth credentials)

### Installation

1.  **Install dependencies (from root):**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    AyosDocs uses Ansible Vault to manage secrets. Ensure you have Ansible installed, then run the setup script to generate your local environment files:
    ```bash
    npm run setup-env
    ```
    You will be prompted for the Vault password. This will create `app/.env.local` and `app/.env.tunnel`.

### Running the Project

-   **Development mode (from root):**
    ```bash
    npm run dev
    ```
-   **Production build (from root):**
    ```bash
    npm run build
    ```

## Development Conventions

### UI Standards
-   **Reusable Components:** Use standardized components for consistent UI.
    -   `PageHeader`: Mandatory for all main discovery pages (Guides, Bundles, Offices).
    -   `HolidayAlert`: Displays important closure information, typically moved to the Offices page during holiday periods.
    -   `Banner`: Use for tips, alerts, and inline information.
-   **Spacing:** Follow the established 1600px max-width and responsive padding (`px-6 lg:px-10`) for main page containers.

### Git Workflow
-   **Linting:** ALWAYS run `npm run lint` before committing changes. Fix any linting errors before proceeding with the commit.
-   **Commit Messages:** Prefer clear, concise messages that focus on "why" and "what".

### Documentation & Comments
-   **JSDoc:** Use JSDoc for all exported functions and components.
-   **Educational Comments:** Explain the "why" and "how" of complex logic. 
-   **Server Components:** Prefer Server Components for data fetching whenever possible.
-   **Server Actions:** Use Server Actions for mutations (form submissions, status updates).

### Content Management
-   Guides are stored as Markdown files in `src/data/guides/`.
-   Metadata is handled via YAML frontmatter.
-   Headings are automatically extracted for the Table of Contents.

## Future Roadmap

### High Priority
-   Advanced search relevance and filtering.
-   Bundle progress tracking and completion analytics.
-   Structured office reviews and experience reports.

### Medium Priority
-   Smart recommendations (e.g., "Completed Passport -> Suggest Apostille").
-   Personalized dashboard with suggested next steps.
-   Guide relationship mapping.

### Long-Term Vision
-   Renewal reminders (Passport, Driver's License).
-   Timeline-based workflows across multiple agencies.
-   Community analytics and peak hour insights.
-   AI assistance for requirement clarification and eligibility checking.

## Deployment
-   **Frontend:** Configured for Vercel via `client/vercel.json`.
-   **Backend:** Can be deployed to any Node.js hosting provider (Render, Railway, Heroku).
