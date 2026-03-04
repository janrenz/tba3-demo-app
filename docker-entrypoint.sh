#!/bin/sh
set -e

# Start mock API server in background
node /app/simple-api-server.cjs &

# Start MCP server in background; Default-TBA3-API wie die App (kann per env überschrieben werden)
cd /app/mcp-server && PORT=3000 TBA3_API_BASE_URL="${TBA3_API_BASE_URL:-https://apps.indibit.eu/tba3-api}" node server-http.js &
sleep 2

# Official nginx:alpine entrypoint handles envsubst on templates + starts nginx
exec /docker-entrypoint.sh nginx -g "daemon off;"
