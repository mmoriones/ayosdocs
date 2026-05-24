# AyosDocs Sprint Checklist 📋

## 🎨 Frontend & UI Refinements
~~- [X] **Modernization Phase 2:** Revamp `UserProgress`, `AllGuides`, and Info pages to match the new home page design.~~
~~- [X] **Branding:** ~~
    ~~- [X] Fix logo and add government agency logos.~~
    - ~~[X] Add consistent SVGs/Graphics across the platform.(used webp instead)~~
- [ ] **Mobile Experience:** 
    - ~~[X] Implement Home page Mobile view (refer to `home_wireframe_mobile.png`).~~
        - ~~[X] Spcaing on H1 on Hero section (no spacing between "we" & "help")~~
    - ~~[X] Modernize Mobile Menu to match new design~~
    - [ ] Improve mobile view and overall UX (haptics/visual).
- [ ] **Components:**
    - ~~[X] **Auth Modal:** Improve loading states and spinners during authentication.~~
    - ~~[X] **Home Page:** Improve `lastguideslug` handling (if empty, default to popular guides and update CTAs).~~
~~    - [X] **UI:** Create reusable components for tips badges, close button, etc~~
    ~~- [X] **Breadcrumbs:** Add navigation breadcrumbs (remove "back to my progress" links).~~
    ~~- [X] **Adsense:** Create Adsense component with eligibility context (hidden by default).~~
    - ~~[X] **ToastModal:** Optimize styles and add specific text for first-time login.~~
        - ~~[X] Scroll actions still available when toast modal is open~~
    ~~- [X] **Skeleton:** Add skeleton loading for dynamic UI components~~
    ~~- [X] **Settings:** Add components on the empty tabs on /settings and make them functional.~~
   ~~- [X] **Profile:** Make user details editable except email~~
    ~~- [X] **Refator:** Implement global UI component reuse for consistency~~
    ~~- [X] **Theme:** Add better color palettes for dark mode to improve contrast and readability ~~
    ~~- [X] **Icon:** Update the icon color gradient~~
    ~~- [X] **Skeleton:** Remove the skeleton on /profile and settings~~
    ~~- [X] **Sidebar:** Increase side bar opacity for hover and currently selected item~~
    ~~- [X] **Community Feed:** Make Community Feed single horizontal card~~
    ~~- [X] **Recent Updates:** Improve RecentlyUpdated style and layout on / and /guides~~
    - [ ] **Buttons:** Review buttons variants usage on all pages
    - [ ] **Hover:** Make hover overlays consistent
    - [ ] **Tooltip:** Review all client pages and components that needs tooltip
    ~~- [X] **Scroll:** Create a reusable button for horizontal scroll [ < > ] and a reusable component for the indicator below the items on horizontal scroll~~

## ✨ Features & Logic
- ~~[X] **Onboarding UX:** If logged in but not onboarded, hide Community Feed to prioritize the onboarding banner.~~
- ~~[X] **Guides Discovery:** Add back the **Cost Range** filter on the `/guides` page.~~
- ~~[X] **My Docs:** Ensure data/progress updates trigger a refresh before displaying.~~
~~- [X] **Recently Updated:**~~
    ~~- [X] Replace dummy data in `RecentlyUpdated.jsx` with real content.~~
    ~~- [X] Implement "View all updates" page/logic.~~
    ~~- [X] Connect to backend endpoint for update tracking.~~
~~- [X] **Onboarding:**~~
    - ~~[X] Implement actual "onboarded" trigger (e.g., after clicking "See how it works").~~
~~- [x] Implement user login using email and email verification~~
~~- [x] **Authentication:** Sign up using email and verification using OTP or verification link~~
 - [ ] **Optimizations:**
    - [ ] Improve /my-docs loading speed
    ~~- [X] Refactor/clean up unused imports and use barrel import~~
    ~~- [X] Rename /contact to /support~~


## 👤 User Dashboard (My Docs)
~~- [X] **Rename:** Rebrand "User Progress" to **"My Docs"**.~~
~~- [X] **Grouping:** Add functionality to create and edit custom guide groups (Requires new schema & endpoints).~~
~~- [X] **Search:** Add search function within the dashboard.~~
~~- [X] **Sorting:** Implement filters for All, In Progress, Completed, and Favorites.~~

## ⚙️ Backend & Infrastructure
- [ ] **Content:** Create all missing markdown guides needed for existing life-event bundles.
- [ ] **API Endpoints:**
    ~~- [X] `/api/guides/recently-updated`~~
    ~~- [x] `/api/contact` (Contact form submission)~~
    ~~- [X] `/api/rate` (office rating submission)~~
    ~~- [X] `/api/trending` (trending guides)~~
- ~~[X] **Guide Management:** Remove "Related Guides" section from `.md` files (handle dynamically).~~
~~- [X] **Versioning:** Track guide update dates in frontmatter or database.~~
-~~ [x] **Mail:** Integrate **Zoho Mail** for communications.~~
~~- [X] **Forgot Password Flow:** Email infrastructure (setting up a service like Resend or a Gmail SMTP to send the mail) ~~
~~- [x] **Email Verification** Add "guards" to pages to check if isVerified is true~~
- [ ] **Testing:** Set up **Vitest + Testing Library** for unit/integration tests.
- [ ] **End-to-End Testing:**
    - [ ] Verify **Guest Mode** (Public discovery, limited features).
    - [ ] Verify **Unverified Mode** (Restricted progress tracking).
    - [ ] Verify **Verified Mode** (Full platform access).
- [ ] **Monitoring Alerts:** Configure **Alertmanager** with Zoho SMTP credentials for system notifications. (inject pass from .env)
- [ ] **Grafana Dashboards:** Set up and configure dashboards for App performance, Docker container health, and Host metrics.
- [ ] **SSL Security:** Implement **Cloudflare Origin Certificates** and switch to **Full (Strict)** SSL mode for end-to-end encryption.
- [ ] **Caching:** Research about caching.
~~- [X] **Sitemap:** Update sitemap and robot scripts to not include user-based and protected routes~~
~~- [X] **Vercel:** Update vercel env variable to ZOHO_AUTH_EMAIL for unified auth related emails~~
~~ - [X] **Delete Account:** Implement delete account BE and FE~~
- [ ] **Deployment:**

    ~~- [X] Dockerize the application.~~
    ~~- [X] Setup CI/CD pipelines.~~

## 🐛 Bugs & Fixes
- ~~[X] **Auth Navigation:** Fix bug where canceling Google login or using the back button doesn't refresh the previous page/state.~~
- ~~[X] **Tracking Logic:** Investigate bug where guides are occasionally tracked automatically without user interaction.~~
- ~~[X] **AuthModal:** Fix bug where AuthModal continues to show after successful login.~~
- ~~[X] **Clean Content:** Review and remove any legacy references in guide files.~~
~~- [X] **Hydration:** Rate page showing the unauthenticated "AUthentication Required" card when still hydrating~~

## 💡 Future Ideas
~~- [X] **Service Rating:** Add a rating system for government services (could be a separate app).~~
  - [ ] **Admin Page:** Add admin page for CMS, Approvals, etc


# Next Sprint:
## Mobile view and Tagalog Translation
