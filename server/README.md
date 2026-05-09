# AyosDocs Server

This is the backend of the AyosDocs application, built with Node.js, Express, and MongoDB.

## Features

- **Authentication:** JWT-based session management and Google OAuth integration.
- **User Management:** User profiles and progress tracking.
- **Email Service:** Verification emails using Nodemailer.
- **API Endpoints:** RESTful endpoints for guides and user data.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```

### Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Structure

- `controllers`: Logic for handling API requests.
- `services`: Business logic and external integrations.
- `models`: Mongoose schemas for MongoDB.
- `routes`: API route definitions.
- `middleware`: Express middleware (e.g., authentication).
