FROM node:24-alpine AS builder
WORKDIR /app

ARG API_BASE_URL=https://luminabackend-production-0828.up.railway.app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN sed -i "s|apiBaseUrl: '.*'|apiBaseUrl: '${API_BASE_URL}'|" src/environments/environment.ts \
    && npm run build -- --configuration production

FROM nginx:1.27-alpine

# Quita el default de nginx (escucha en 80) para no chocar con Railway.
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint-lumina.sh
COPY --from=builder /app/dist/library_front/browser /usr/share/nginx/html

RUN chmod +x /docker-entrypoint-lumina.sh

# Convención Railway: la app escucha en PORT (default 8080).
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint-lumina.sh"]
