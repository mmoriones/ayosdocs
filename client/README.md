# AyosDocs Client

This is the frontend of the AyosDocs application, built with React, Vite, and Tailwind CSS.

## Features

- **Dynamic Guides:** Guides are authored in Markdown and rendered dynamically.
- **Authentication:** Supports Google OAuth and traditional email/password login.
- **User Progress:** Tracks user progress through guide tasks.
- **Responsive Design:** Optimized for both mobile and desktop.

## Getting Started

### Prerequisites

- Node.js installed
- Backend server running (see `server/README.md`)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:
   ```env
   VITE_BACKEND_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_ADSENSE_ENABLED=true
   ```

### Running the App

```bash
npm run dev
```

## Structure

- `src/components`: Reusable UI components.
- `src/features`: Feature-specific logic and components.
- `src/context`: React context providers (Auth, Toast).
- `src/data/guides`: Markdown files for government guides.
- `src/utils`: Utility functions for loading guides, searching, etc.
