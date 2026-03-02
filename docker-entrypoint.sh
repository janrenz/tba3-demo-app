#!/bin/sh
set -e

# Start mock API server in background
node /app/simple-api-server.cjs &

# Nginx in foreground keeps the container alive
exec nginx -g "daemon off;"
