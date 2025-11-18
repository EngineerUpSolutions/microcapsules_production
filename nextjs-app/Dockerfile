# Builder stage: full toolchain for building the Next.js app
FROM node:22.20-alpine3.21 AS builder
WORKDIR /app

# Install build deps for native modules (only in builder)
RUN apk add --no-cache build-base python3

# Copy package files first for caching
COPY package*.json ./

# Install deps (dev + prod needed for build)
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Runtime stage: minimal image
FROM node:22.20-alpine3.21 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup -S app && adduser -S -G app app

# Copy only runtime artifacts from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

USER app
EXPOSE 3000

# Start Next in production mode
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
