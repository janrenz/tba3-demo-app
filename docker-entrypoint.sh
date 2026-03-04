#!/bin/sh
set -e

# Start mock API server in background
node /app/simple-api-server.cjs &

# Start MCP server in background (TBA3_API_BASE_URL ggf. per env setzen)
cd /app/mcp-server && PORT=3000 node server-http.js &
sleep 2

# Official nginx:alpine entrypoint handles envsubst on templates + starts nginx
exec /docker-entrypoint.sh nginx -g "daemon off;"
