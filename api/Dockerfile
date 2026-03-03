# --- Base Stage ---
FROM node:lts-alpine3.22 AS base
WORKDIR /api
RUN set -o pipefail; \
    apk add --no-cache curl py3-pip && \
    pip3 install --break-system-packages --no-cache-dir -U yt-dlp && \
    corepack enable pnpm
COPY package*.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# --- Development Stage ---
FROM base AS dev
RUN pnpm install
COPY . .
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# --- Production Stage ---
FROM base AS prod
RUN pnpm install --prod=false
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "start"]

# --- Staging Stage ---
FROM base AS staging
RUN pnpm install --prod=false
COPY . .
ENV NODE_ENV=staging
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "run", "dev"]
