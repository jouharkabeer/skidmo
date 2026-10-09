# Build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SITE_URL=https://skidmosa.com
ARG VITE_API_URL=
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Serve static files (copied into nginx image via compose, or standalone)
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
