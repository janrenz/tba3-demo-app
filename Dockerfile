# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache nginx \
  && mkdir -p /run/nginx \
  && rm -f /etc/nginx/http.d/default.conf

WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
COPY simple-api-server.cjs ./
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost/healthz || exit 1

ENTRYPOINT ["/entrypoint.sh"]
