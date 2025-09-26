# 🐳 Dockerfile pour Simple MVC
# Multi-stage build pour optimiser la taille de l'image finale

# Stage 1: Build de l'application
FROM node:18-alpine as builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY vite.config.js ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Créer le build de production
RUN npm run build

# Stage 2: Serveur web Nginx
FROM nginx:alpine

# Copier les fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Support pour SPA (Single Page Application)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache pour les assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy vers l'API (ajustez l'URL selon vos besoins)
    location /api/ {
        proxy_pass https://192.168.1.141:8443/api/;
        proxy_ssl_verify off;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Headers de sécurité
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

# Exposer le port 80
EXPOSE 80

# Commande par défaut
CMD ["nginx", "-g", "daemon off;"]

# Labels pour la documentation
LABEL maintainer="Simple MVC Team"
LABEL description="Application Vue.js Simple MVC avec architecture MVC"
LABEL version="1.0.0"
