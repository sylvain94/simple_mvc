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

# Create Nginx configuration template
COPY <<EOF /etc/nginx/conf.d/default.conf.template
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

    # Proxy to the API (configurable via environment variables)
    location /api/ {
        proxy_pass \${API_BACKEND_URL}/api/;
        proxy_ssl_verify \${API_SSL_VERIFY};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeout settings
        proxy_connect_timeout \${API_CONNECT_TIMEOUT};
        proxy_send_timeout \${API_SEND_TIMEOUT};
        proxy_read_timeout \${API_READ_TIMEOUT};
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_comp_level 9;
}
EOF

# Create startup script to substitute environment variables
COPY <<EOF /docker-entrypoint.sh
#!/bin/sh
set -e

# Default values for environment variables
export API_BACKEND_URL=\${API_BACKEND_URL:-https://192.168.1.141:8443}
export API_SSL_VERIFY=\${API_SSL_VERIFY:-off}
export API_CONNECT_TIMEOUT=\${API_CONNECT_TIMEOUT:-30s}
export API_SEND_TIMEOUT=\${API_SEND_TIMEOUT:-30s}
export API_READ_TIMEOUT=\${API_READ_TIMEOUT:-30s}

echo "🔧 Configuring Nginx with API backend: \$API_BACKEND_URL"

# Substitute environment variables in the Nginx configuration
envsubst '\$API_BACKEND_URL \$API_SSL_VERIFY \$API_CONNECT_TIMEOUT \$API_SEND_TIMEOUT \$API_READ_TIMEOUT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Test Nginx configuration
nginx -t

echo "✅ Nginx configuration ready"
echo "🚀 Starting Nginx..."

# Start Nginx
exec nginx -g "daemon off;"
EOF

# Make the script executable
RUN chmod +x /docker-entrypoint.sh

# Expose the port 80
EXPOSE 80

# Use custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Labels for the documentation
LABEL maintainer="MediaHub Team"
LABEL description="Application Vue.js MediaHub Admin with MVC architecture"
LABEL version="1.0.0"
