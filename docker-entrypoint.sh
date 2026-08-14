#!/bin/sh
# docker-entrypoint.sh
#
# Runs before nginx starts. Reads environment variables and writes
# /usr/share/nginx/html/config.json so the SPA can fetch runtime settings
# without a rebuild.
#
# Usage (docker run):
#   docker run -e API_BASE_URL=http://my-api:8001 -p 8080:80 <image>
#
# Supported env vars:
#   API_BASE_URL   — backend API base URL  (default: http://localhost:8001)

set -e

CONFIG_FILE="/usr/share/nginx/html/config.json"

cat > "$CONFIG_FILE" <<EOF
{
  "apiBaseUrl": "${API_BASE_URL:-http://localhost:8001}"
}
EOF

echo "[entrypoint] Wrote ${CONFIG_FILE}:"
cat "$CONFIG_FILE"

exec nginx -g 'daemon off;'
