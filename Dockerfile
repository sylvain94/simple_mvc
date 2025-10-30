# 🐳 Dockerfile for mediahub-admin
# Multi-stage build to optimize the final image size

# Stage 1: Build the application
FROM node:18-alpine as builder

WORKDIR /app

# Copy the configuration files
COPY package*.json ./
COPY package-lock.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY vite.config.js ./

# Install all the dependencies (dev + prod for the build)
# Use npm install instead of npm ci to resolve version conflicts
RUN npm install

# Copy the source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Create the production build
RUN npm run build

# Stage 2: Serveur web Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Support for SPA (Single Page Application)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache for the assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy to the API (adjust the URL according to your needs)
    location /api/ {
        proxy_pass https://192.168.1.141:8443/api/;
        proxy_ssl_verify off;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compressiongzip on;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 9;
}
EOF

# Expose the port 80
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]

# Labels for the documentation
LABEL maintainer="MediaHub Team"
LABEL description="Application Vue.js MediaHub Admin with MVC architecture"
LABEL version="1.0.0"
