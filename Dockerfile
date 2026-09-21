FROM node:24-alpine AS builder
WORKDIR /app

ARG API_BASE_URL=https://luminabackend-production-0828.up.railway.app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN sed -i "s|apiBaseUrl: '.*'|apiBaseUrl: '${API_BASE_URL}'|" src/environments/environment.ts \
    && npm run build -- --configuration production

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist/library_front/browser /usr/share/nginx/html

ENV PORT=80

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=5 \
    CMD sh -c 'wget -qO- http://127.0.0.1:${PORT}/ >/dev/null || exit 1'
