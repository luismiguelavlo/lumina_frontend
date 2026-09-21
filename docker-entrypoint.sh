#!/bin/sh
set -eu

# Railway inyecta PORT; si no viene, usamos 8080.
export PORT="${PORT:-8080}"

echo "lumina-frontend: listening on 0.0.0.0:${PORT}"

# Genera la config final (solo sustituye PORT).
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Evita que el entrypoint oficial vuelva a tocar la config.
rm -f /docker-entrypoint.d/20-envsubst-on-templates.sh

exec /docker-entrypoint.sh nginx -g 'daemon off;'
