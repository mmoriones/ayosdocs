# AyosDocs

AyosDocs is a full-stack web application designed to help Filipinos navigate government documentation and applications through interactive, step-by-step guides.

## 🚀 Features

- **Interactive Guides:** Comprehensive requirements, fees, and procedures for major government documents (Passport, NBI, SSS, etc.).
- **Personal Progress Tracker:** Save your progress and track completed requirements.
- **Requirement Bundles:** Grouped guides for specific life events like "Starting a Business" or "Getting Married".
- **Office Directory & Ratings:** Crowdsourced insights on government office waiting times and service quality.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB (Mongoose)
- **Authentication:** NextAuth.js (Google Provider)
- **State Management:** TanStack React Query

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (Local or Atlas)
- Google OAuth credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ayosdocs.git
   cd ayosdocs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_ADSENSE_ENABLED=false
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
