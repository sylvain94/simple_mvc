# 🚀 Guide de Déploiement - Simple MVC

## 📦 Contenu du Build de Production

Le dossier `dist/` contient tous les fichiers nécessaires pour déployer l'application :

```
dist/
├── index.html              # Point d'entrée principal
├── assets/                 # Fichiers JavaScript et CSS compilés
│   ├── index-*.css         # Styles Tailwind + DaisyUI (71.55 kB)
│   ├── index-*.js          # Application principale (116.51 kB)
│   └── *-*.js              # Modules des pages (code-splitting)
├── logo.svg                # Logo de l'application
├── avatar.png              # Avatar par défaut
└── *.html                  # Pages de debug (optionnelles)
```

## 🖥️ Options de Déploiement

### Option 1: Serveur Web (Recommandé)

**Apache (avec .htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache des assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option 2: Serveur Statique Simple

**Python (pour tests):**
```bash
cd dist/
python3 -m http.server 8080
```

**Node.js (serve):**
```bash
npm install -g serve
serve -s dist/ -l 8080
```

### Option 3: Hébergement Cloud

- **Netlify**: Glisser-déposer le dossier `dist/`
- **Vercel**: `vercel --prod dist/`
- **GitHub Pages**: Push du dossier `dist/` vers la branche `gh-pages`

## ⚙️ Configuration Requise

### Côté Serveur
- **Serveur Web**: Apache, Nginx, ou similaire
- **HTTPS**: Recommandé (Let's Encrypt gratuit)
- **Compression**: Gzip/Brotli pour optimiser les performances

### Configuration API
L'application utilise un proxy vers l'API. En production, configurez :

```javascript
// Dans vite.config.js (pour rebuild)
const apiBaseUrl = 'https://votre-api.com:8443';
```

Ou configurez le reverse proxy nginx :
```nginx
location /api/ {
    proxy_pass https://192.168.1.141:8443/api/;
    proxy_ssl_verify off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 📋 Checklist de Déploiement

### Avant le Déploiement
- [ ] Tester le build localement : `npm run preview`
- [ ] Vérifier l'URL de l'API dans `vite.config.js`
- [ ] S'assurer que CORS est configuré sur l'API
- [ ] Tester l'authentification

### Déploiement
- [ ] Copier le contenu de `dist/` vers le serveur web
- [ ] Configurer les redirections (SPA routing)
- [ ] Activer la compression gzip
- [ ] Configurer le cache des assets
- [ ] Tester toutes les routes

### Après le Déploiement
- [ ] Vérifier que l'application se charge
- [ ] Tester le changement de thème
- [ ] Tester l'authentification
- [ ] Vérifier les logs du serveur
- [ ] Tester sur différents navigateurs

## 🔧 Variables d'Environnement

Créez un fichier `.env.production` pour la configuration :

```bash
VITE_API_URL=https://votre-api.com:8443
VITE_APP_TITLE=MediaHub Production
VITE_APP_VERSION=1.0.0
```

## 📊 Optimisations Performance

### Tailles des Bundles
- **CSS**: 71.55 kB (12.87 kB gzippé)
- **JS Principal**: 116.51 kB (43.21 kB gzippé)
- **Total**: ~188 kB (~56 kB gzippé)

### Optimisations Appliquées
- ✅ **Code Splitting**: Chaque page est un module séparé
- ✅ **Tree Shaking**: Code inutilisé supprimé
- ✅ **Minification**: CSS et JS minifiés
- ✅ **Compression**: Gzip/Brotli recommandé

## 🚨 Dépannage

### L'application ne se charge pas
- Vérifiez la console F12 pour les erreurs
- Assurez-vous que le serveur sert `index.html` pour toutes les routes
- Vérifiez les permissions des fichiers

### Erreurs d'API
- Vérifiez l'URL de l'API dans la configuration
- Contrôlez la configuration CORS
- Testez l'API directement avec curl

### Thèmes ne fonctionnent pas
- Vérifiez que le CSS se charge (index-*.css)
- Ouvrez F12 et regardez l'attribut `data-theme`
- Effacez le cache du navigateur

## 📞 Support

En cas de problème :
1. Vérifiez les logs du serveur web
2. Consultez la console du navigateur (F12)
3. Testez avec `npm run preview` localement
4. Comparez avec la version de développement

---

**Version**: 1.0.0
**Dernière mise à jour**: $(date +'%d/%m/%Y')
