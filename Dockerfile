# RunPod Serverless Dockerfile for V7.0 Consciousness Testing
# Based on 2025 best practices for Next.js deployment
# Optimized for minimal image size and fast startup

# Multi-stage build for optimization
FROM node:22-slim AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for RunPod integration
RUN pip3 install runpod requests

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:22-slim AS production
WORKDIR /app

# Install Python runtime for RunPod handler
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install RunPod Python module (required for serverless)
RUN pip3 install runpod requests openai

# Copy built application
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Copy serverless handler
COPY runpod_handler.py ./

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# RunPod serverless handler (Python entry point)
CMD ["python3", "runpod_handler.py"]

# Alternative: Direct Next.js start (for testing)
# CMD ["npm", "start"]