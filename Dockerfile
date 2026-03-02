# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
# Use the official nginx image – nginx is properly configured out of the box
FROM nginx:alpine AS runner

# Add Node.js for the mock API server
RUN apk add --no-cache nodejs \
  # Remove the default nginx site
  && rm -f /etc/nginx/conf.d/default.conf

ENV PORT=80

WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
COPY simple-api-server.cjs ./

# nginx:alpine automatically runs envsubst on *.template files in this dir
COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:${PORT}/healthz || exit 1

ENTRYPOINT ["/entrypoint.sh"]
