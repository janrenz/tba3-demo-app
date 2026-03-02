#!/bin/sh
set -e

# Substitute $PORT into nginx config
envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template \
  > /etc/nginx/http.d/default.conf

# Start mock API server in background
node /app/simple-api-server.cjs &

# Nginx in foreground keeps the container alive
exec nginx -g "daemon off;"
