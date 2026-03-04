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

# Add Node.js for mock API and MCP server
RUN apk add --no-cache nodejs \
  && rm -f /etc/nginx/conf.d/default.conf

ENV PORT=80
ENV MCP_PORT=3000

WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
COPY simple-api-server.cjs ./

# MCP server (läuft im selben Container)
COPY mcp-server/package*.json mcp-server/
COPY mcp-server/server-impl.js mcp-server/index.js mcp-server/server-http.js mcp-server/
RUN cd /app/mcp-server && npm ci --omit=dev

# nginx:alpine automatically runs envsubst on *.template files in this dir
COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["/entrypoint.sh"]
