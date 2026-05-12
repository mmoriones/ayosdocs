# AyosDocs Sprint Checklist 📋

## 🎨 Frontend & UI Refinements
- [ ] **Modernization Phase 2:** Revamp `UserProgress`, `AllGuides`, and Info pages to match the new home page design.
- [ ] **Branding:** 
    - [-] Fix logo and add government agency logos. (started)
    - ~~[X] Add consistent SVGs/Graphics across the platform.(used webp instead)~~
- [ ] **Mobile Experience:** 
    - ~~[X] Implement Home page Mobile view (refer to `home_wireframe_mobile.png`).~~
        - ~~[X] Spcaing on H1 on Hero section (no spacing between "we" & "help")~~
    - ~~[ ] Modernize Mobile Menu to match new design~~
    - [ ] Add mobile press feedback (haptics/visual).
- [ ] **Components:**
    - [ ] **Skeleton Loading:** Implement for all data-fetching sections.
    - [ ] **UI:** Create reusable components for tips badges, close button, etc
    - [ ] **Breadcrumbs:** Add navigation breadcrumbs (remove "back to my progress" links).
    - [ ] **Adsense:** Create Adsense component with eligibility context (hidden by default).
    - ~~[X] **ToastModal:** Optimize styles and add specific text for first-time login.~~
        - ~~[X] Scroll actions still available when toast modal is open~~

## ✨ Features & Logic
- [ ] **Recently Updated:**
    - [-] Replace dummy data in `RecentlyUpdated.jsx` with real content.
    - [ ] Implement "View all updates" page/logic.
    - [ ] Connect to backend endpoint for update tracking.
- [ ] **Onboarding:**
    - ~~[X] Implement actual "onboarded" trigger (e.g., after clicking "See how it works").~~
- [ ] Implement user login using email and email verification
- ~~[X] **Popular Guides:** Replace UMID Card and Digital TIN ID with PSA Birth Cert and National ID.~~
- [ ] **Holiday Alert:** Connect to real holiday data.
- [ ] **ChecklistCard:** Disable "Save Progress" button when no changes are made.

## 👤 User Dashboard (My Docs)
- [ ] **Rename:** Rebrand "User Progress" to **"My Docs"**.
- [ ] **Grouping:** Add functionality to create and edit custom guide groups (Requires new schema & endpoints).
- [ ] **Search:** Add search function within the dashboard.
- [ ] **Sorting:** Implement filters for All, In Progress, Completed, and Favorites.

## ⚙️ Backend & Infrastructure
- [ ] **API Endpoints:**
    - [ ] `/api/guides/recently-updated`
    - [ ] `/api/contact` (Contact form submission)
    - [ ] `/api/rate` (office rating submission)
- ~~[X] **Guide Management:** Remove "Related Guides" section from `.md` files (handle dynamically).~~
- [ ] **Versioning:** Track guide update dates in frontmatter or database.
- [ ] **Mail:** Integrate **Zoho Mail** for communications.
- [ ] **Deployment:**
    - [ ] Dockerize the application.
    - [ ] Setup CI/CD pipelines.

## 🐛 Bugs & Fixes
- ~~[X] **AuthModal:** Fix bug where AuthModal continues to show after successful login.~~
- ~~[X] **Clean Content:** Review and remove any legacy references in guide files.~~

## 💡 Future Ideas
- [ ] **Service Rating:** Add a rating system for government services (could be a separate app).
