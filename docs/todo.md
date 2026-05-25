# AyosDocs Sprint Checklist 📋

## 🎨 Frontend & UI Refinements
- [x] **Modernization Phase 2:** Revamp `UserProgress`, `AllGuides`, and Info pages to match the new home page design.
- [x] **Branding:**
    - [x] Fix logo and add government agency logos.
    - [x] Add consistent SVGs/Graphics across the platform.(used webp instead)
- [x] **Mobile Experience:**
    - [x] Implement Home page Mobile view (refer to `home_wireframe_mobile.png`).
        - [x] Spcaing on H1 on Hero section (no spacing between "we" & "help")
    - [x] Modernize Mobile Menu to match new design
- [ ] **Components:**
    - [x] **Auth Modal:** Improve loading states and spinners during authentication.
    - [x] **Home Page:** Improve `lastguideslug` handling (if empty, default to popular guides and update CTAs).
    - [x] **UI:** Create reusable components for tips badges, close button, etc
    - [x] **Breadcrumbs:** Add navigation breadcrumbs (remove "back to my progress" links).
    - [x] **Adsense:** Create Adsense component with eligibility context (hidden by default).
    - [x] **ToastModal:** Optimize styles and add specific text for first-time login.
        - [x] Scroll actions still available when toast modal is open
    - [x] **Skeleton:** Add skeleton loading for dynamic UI components
    - [x] **Settings:** Add components on the empty tabs on /settings and make them functional.
    - [x] **Profile:** Make user details editable except email
    - [x] **Refator:** Implement global UI component reuse for consistency
    - [x] **Theme:** Add better color palettes for dark mode to improve contrast and readability
    - [x] **Icon:** Update the icon color gradient
    - [x] **Skeleton:** Remove the skeleton on /profile and settings
    - [x] **Sidebar:** Increase side bar opacity for hover and currently selected item
    - [x] **Community Feed:** Make Community Feed single horizontal card
    - [x] **Recent Updates:** Improve RecentlyUpdated style and layout on / and /guides
    - [x] **Buttons:** Review buttons variants usage on all pages
    - [x] **Hover:** Make hover overlays consistent
    - [x] Click: Add ripple or click visual indicator 
    - [ ] **Tooltip:** Review all client pages and components that needs tooltip
    - [x] **Scroll:** Create a reusable button for horizontal scroll [ < > ] and a reusable component for the indicator below the items on horizontal scroll

## ✨ Features & Logic
- [x] **Onboarding UX:** If logged in but not onboarded, hide Community Feed to prioritize the onboarding banner.
- [x] **Guides Discovery:** Add back the **Cost Range** filter on the `/guides` page.
- [x] **My Docs:** Ensure data/progress updates trigger a refresh before displaying.
- [x] **Recently Updated:**
    - [x] Replace dummy data in `RecentlyUpdated.jsx` with real content.
    - [x] Implement "View all updates" page/logic.
    - [x] Connect to backend endpoint for update tracking.
- [x] **Onboarding:**
    - [x] Implement actual "onboarded" trigger (e.g., after clicking "See how it works").
- [x] Implement user login using email and email verification
- [x] **Authentication:** Sign up using email and verification using OTP or verification link
- [x] **Tracking Indicator:** Show indicator on bundles/guides when they are being tracked
- [x] **Stop Tracking Modal:** Add confirm modal when stopping bundle tracking
- [x] **Standardization:**
    - [x] Standardize terms used
    - [x] Standardize knowledge base since it has a lot of categories now for quick
- [ ] **Optimizations:**
    - [ ] Improve /my-docs loading speed
    - [x] Refactor/clean up unused imports and use barrel import
    - [x] Rename /contact to /support

## 👤 User Dashboard (My Docs)
- [x] **Rename:** Rebrand "User Progress" to **"My Docs"**.
- [x] **Grouping:** Add functionality to create and edit custom guide groups (Requires new schema & endpoints).
- [x] **Search:** Add search function within the dashboard.
- [x] **Sorting:** Implement filters for All, In Progress, Completed, and Favorites.

## ⚙️ Backend & Infrastructure
- [x] **Content:** Create all missing markdown guides needed for existing life-event bundles.
- [ ] **API Endpoints:**
    - [x] `/api/guides/recently-updated`
    - [x] `/api/contact` (Contact form submission)
    - [x] `/api/rate` (office rating submission)
    - [x] `/api/trending` (trending guides)
- [x] **Guide Management:** Remove "Related Guides" section from `.md` files (handle dynamically).
- [x] **Versioning:** Track guide update dates in frontmatter or database.
- [x] **Mail:** Integrate **Zoho Mail** for communications.
- [x] **Forgot Password Flow:** Email infrastructure (setting up a service like Resend or a Gmail SMTP to send the mail)
- [x] **Email Verification** Add "guards" to pages to check if isVerified is true
- [ ] **Testing:** Set up **Vitest + Testing Library** for unit/integration tests.
- [ ] **End-to-End Testing:**
    - [ ] Verify **Guest Mode** (Public discovery, limited features).
    - [ ] Verify **Unverified Mode** (Restricted progress tracking).
    - [ ] Verify **Verified Mode** (Full platform access).
- [ ] **Monitoring Alerts:** Configure **Alertmanager** with Zoho SMTP credentials for system notifications. (inject pass from .env)
- [ ] **Grafana Dashboards:** Set up and configure dashboards for App performance, Docker container health, and Host metrics.
- [ ] **SSL Security:** Implement **Cloudflare Origin Certificates** and switch to **Full (Strict)** SSL mode for end-to-end encryption.
- [ ] **Caching:** Research about caching.
- [x] **Sitemap:** Update sitemap and robot scripts to not include user-based and protected routes
- [x] **Vercel:** Update vercel env variable to ZOHO_AUTH_EMAIL for unified auth related emails
- [x] **Delete Account:** Implement delete account BE and FE
- [ ] **Deployment:**
    - [x] Dockerize the application.
    - [x] Setup CI/CD pipelines.

## 🐛 Bugs & Fixes
- [x] **Auth Navigation:** Fix bug where canceling Google login or using the back button doesn't refresh the previous page/state.
- [x] **Tracking Logic:** Investigate bug where guides are occasionally tracked automatically without user interaction.
- [x] **AuthModal:** Fix bug where AuthModal continues to show after successful login.
- [x] **Clean Content:** Review and remove any legacy references in guide files.
- [x] **Hydration:** Rate page showing the unauthenticated "AUthentication Required" card when still hydrating
- [ ] **Hydration:** `/onboarding` page causes the sidebar to blink during hydration

## 💡 Future Ideas
- [x] **Service Rating:** Add a rating system for government services (could be a separate app).
- [ ] **Admin Page:** Add admin page for CMS, Approvals, etc

# Next Sprint:
## Mobile view and Tagalog Translation
