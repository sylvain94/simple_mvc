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

# Install OpenSSL for certificate generation
RUN apk add --no-cache openssl

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create SSL certificate directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=FR/ST=France/L=Paris/O=MediaHub/OU=IT/CN=localhost"

# Create Nginx configuration template with HTTPS
COPY <<EOF /etc/nginx/conf.d/default.conf.template
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name _;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

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
        proxy_set_header X-Forwarded-Proto https;
        
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
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

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

# Function to detect VM IP address (where both frontend and backend are hosted)
get_vm_ip() {
    # Since we're in a Docker container, we need to get the host VM's IP
    # Try multiple methods to get the VM's IP address
    
    # Method 1: Get Docker host IP (the VM where Docker is running)
    HOST_IP=\$(ip route show default 2>/dev/null | awk '/default/ { print \$3 }' | head -1)
    if [ -n "\$HOST_IP" ] && [ "\$HOST_IP" != "127.0.0.1" ]; then
        echo "\$HOST_IP"
        return 0
    fi
    
    # Method 2: Try to resolve host.docker.internal
    if command -v getent >/dev/null 2>&1; then
        VM_IP=\$(getent hosts host.docker.internal 2>/dev/null | awk '{print \$1}' | head -1)
        if [ -n "\$VM_IP" ] && [ "\$VM_IP" != "127.0.0.1" ]; then
            echo "\$VM_IP"
            return 0
        fi
    fi
    
    # Method 3: Try to get from /etc/hosts
    VM_IP=\$(awk '/host.docker.internal/ { print \$1 }' /etc/hosts 2>/dev/null | head -1)
    if [ -n "\$VM_IP" ] && [ "\$VM_IP" != "127.0.0.1" ]; then
        echo "\$VM_IP"
        return 0
    fi
    
    # Method 4: Convert hex gateway from /proc/net/route
    HEX_IP=\$(awk '/^0.0.0.0/ { print \$2 }' /proc/net/route 2>/dev/null | head -1)
    if [ -n "\$HEX_IP" ]; then
        # Convert hex to decimal IP
        VM_IP=\$(printf "%d.%d.%d.%d\\n" \$(echo \$HEX_IP | sed 's/../0x& /g'))
        if [ -n "\$VM_IP" ] && [ "\$VM_IP" != "127.0.0.1" ] && [ "\$VM_IP" != "0.0.0.0" ]; then
            echo "\$VM_IP"
            return 0
        fi
    fi
    
    # Method 5: Try hostname resolution as fallback
    if command -v hostname >/dev/null 2>&1; then
        HOSTNAME=\$(hostname 2>/dev/null)
        if [ -n "\$HOSTNAME" ] && command -v getent >/dev/null 2>&1; then
            VM_IP=\$(getent hosts "\$HOSTNAME" 2>/dev/null | awk '{print \$1}' | head -1)
            if [ -n "\$VM_IP" ] && [ "\$VM_IP" != "127.0.0.1" ]; then
                echo "\$VM_IP"
                return 0
            fi
        fi
    fi
    
    # Final fallback to configured default (your development IP)
    echo "192.168.1.141"
}

# Auto-detect VM IP if not explicitly configured
if [ -z "\${API_BACKEND_URL}" ] || [ "\${API_BACKEND_URL}" = "auto" ]; then
    DETECTED_VM_IP=\$(get_vm_ip)
    API_BACKEND_PORT=\${API_BACKEND_PORT:-8443}
    API_BACKEND_PROTOCOL=\${API_BACKEND_PROTOCOL:-https}
    export API_BACKEND_URL="\${API_BACKEND_PROTOCOL}://\${DETECTED_VM_IP}:\${API_BACKEND_PORT}"
    echo "🔍 Auto-detected VM IP: \$DETECTED_VM_IP"
    echo "🔗 Generated API backend URL: \$API_BACKEND_URL"
else
    export API_BACKEND_URL=\${API_BACKEND_URL}
fi

# Default values for other environment variables
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

# Expose ports 80 (HTTP) and 443 (HTTPS)
EXPOSE 80 443

# Use custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Labels for the documentation
LABEL maintainer="MediaHub Team"
LABEL description="MediaHub-admin with Vue.js architecture"
LABEL version="1.0.0"

