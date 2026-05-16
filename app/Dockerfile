# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies based on the preferred package manager
# Copy root package files
COPY package.json package-lock.json ./
# Copy app package files
COPY app/package.json ./app/

# Install dependencies for the workspace
RUN npm ci

# Copy the rest of the application code
COPY app/ ./app/

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w app

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-privileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Note: Next.js standalone build puts files in app/.next/standalone
# Since we are building from root, the path is ./app/.next/standalone
COPY --from=builder /app/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone/app ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./app/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
