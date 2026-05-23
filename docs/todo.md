# AyosDocs Sprint Checklist 📋

## 🎨 Frontend & UI Refinements
~~- [ ] **Modernization Phase 2:** Revamp `UserProgress`, `AllGuides`, and Info pages to match the new home page design.~~
- [ ] **Branding:** 
    ~~- [-] Fix logo and add government agency logos. (started)~~
    - ~~[X] Add consistent SVGs/Graphics across the platform.(used webp instead)~~
- [ ] **Mobile Experience:** 
    - ~~[X] Implement Home page Mobile view (refer to `home_wireframe_mobile.png`).~~
        - ~~[X] Spcaing on H1 on Hero section (no spacing between "we" & "help")~~
    - ~~[ ] Modernize Mobile Menu to match new design~~
    - [ ] Improve mobile view and overall UX (haptics/visual).
- [ ] **Components:**
    - [ ] **UI:** Create reusable components for tips badges, close button, etc
    ~~- [ ] **Breadcrumbs:** Add navigation breadcrumbs (remove "back to my progress" links).~~
    ~~- [ ] **Adsense:** Create Adsense component with eligibility context (hidden by default).~~
    - ~~[X] **ToastModal:** Optimize styles and add specific text for first-time login.~~
        - ~~[X] Scroll actions still available when toast modal is open~~
    ~~- [ ] **Skeleton:** Add skeleton loading for dynamic UI components~~
    ~~- [ ] **Settings:** Add components on the empty tabs on /settings and make them functional.~~
   ~~- [X] **Profile:** Make user details editable except email~~
    ~~- [ ] **Refator:** Implement global UI component reuse for consistency~~
    - [ ] **Theme:** Add better color palettes for dark mode to improve contrast and readability 

## ✨ Features & Logic
- [ ] **Recently Updated:**
    ~~- [-] Replace dummy data in `RecentlyUpdated.jsx` with real content.~~
    ~~- [ ] Implement "View all updates" page/logic.~~
    ~~- [ ] Connect to backend endpoint for update tracking.~~
- [ ] **Onboarding:**
    - ~~[X] Implement actual "onboarded" trigger (e.g., after clicking "See how it works").~~
~~- [x] Implement user login using email and email verification~~
~~- [x] **Authentication:** Sign up using email and verification using OTP or verification link~~

## 👤 User Dashboard (My Docs)
~~- [ ] **Rename:** Rebrand "User Progress" to **"My Docs"**.~~
~~- [ ] **Grouping:** Add functionality to create and edit custom guide groups (Requires new schema & endpoints).~~
~~- [ ] **Search:** Add search function within the dashboard.~~
~~- [ ] **Sorting:** Implement filters for All, In Progress, Completed, and Favorites.~~

## ⚙️ Backend & Infrastructure
- [ ] **API Endpoints:**
    ~~- [ ] `/api/guides/recently-updated`~~
    ~~- [x] `/api/contact` (Contact form submission)~~
    ~~- [ ] `/api/rate` (office rating submission)~~
    ~~- [ ] `/api/trending` (trending guides)~~
- ~~[X] **Guide Management:** Remove "Related Guides" section from `.md` files (handle dynamically).~~
~~- [ ] **Versioning:** Track guide update dates in frontmatter or database.~~
-~~ [x] **Mail:** Integrate **Zoho Mail** for communications.~~
~~- [ ] **Forgot Password Flow:** Email infrastructure (setting up a service like Resend or a Gmail SMTP to send the mail) ~~
~~- [x] **Email Verification** Add "guards" to pages to check if isVerified is true~~
- [ ] **Testing:** Set up **Vitest + Testing Library** for unit/integration tests.
- [ ] **Monitoring Alerts:** Configure **Alertmanager** with Zoho SMTP credentials for system notifications. (inject pass from .env)
- [ ] **Grafana Dashboards:** Set up and configure dashboards for App performance, Docker container health, and Host metrics.
- [ ] **SSL Security:** Implement **Cloudflare Origin Certificates** and switch to **Full (Strict)** SSL mode for end-to-end encryption.
- [ ] **Caching:** Research about caching.
~~- [ ] **Sitemap:** Update sitemap and robot scripts to not include user-based and protected routes~~
~~- [ ] **Vercel:** Update vercel env variable to ZOHO_AUTH_EMAIL for unified auth related emails~~
- [ ] **Deployment:**

    ~~- [ ] Dockerize the application.~~
    ~~- [ ] Setup CI/CD pipelines.~~

## 🐛 Bugs & Fixes
- ~~[X] **AuthModal:** Fix bug where AuthModal continues to show after successful login.~~
- ~~[X] **Clean Content:** Review and remove any legacy references in guide files.~~

## 💡 Future Ideas
~~- [ ] **Service Rating:** Add a rating system for government services (could be a separate app).~~
  - [ ] **Admin Page:** Add admin page for CMS, Approvals, etc