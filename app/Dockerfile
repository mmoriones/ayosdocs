# Stage 1: Build
FROM node:22-alpine
 AS builder
WORKDIR /app

# Install dependencies for the workspace
COPY package.json package-lock.json ./
COPY app/package.json ./app/
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/app
RUN npm run build

# Stage 2: Runner
FROM node:22-alpine
 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-privileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Next.js standalone build structure for workspaces:
# .next/standalone/
#   node_modules/
#   app/
#     server.js
#     package.json

COPY --from=builder /app/app/public ./app/public
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./app/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# We need to run the server from the app workspace folder in standalone
WORKDIR /app/app
CMD ["node", "server.js"]
