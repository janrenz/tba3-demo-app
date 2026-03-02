#!/bin/sh
set -e

# Start mock API server in background
node /app/simple-api-server.cjs &

# Official nginx:alpine entrypoint handles envsubst on templates + starts nginx
exec /docker-entrypoint.sh nginx -g "daemon off;"
