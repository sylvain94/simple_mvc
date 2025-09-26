#!/bin/bash

# 🚀 Script de Déploiement - Simple MVC
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="simple_mvc"
BUILD_DIR="dist"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "🚀 Déploiement de $PROJECT_NAME en mode $ENVIRONMENT"
echo "📅 Timestamp: $TIMESTAMP"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Vérifications préalables
print_step "Vérification de l'environnement..."

if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé. Exécutez le script depuis la racine du projet."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    print_warning "node_modules manquant. Installation des dépendances..."
    npm install
fi

# 2. Tests et vérifications
print_step "Exécution des vérifications..."

# Vérifier que l'API est accessible (optionnel)
if command -v curl &> /dev/null; then
    API_URL=$(grep -o 'https://[^"]*' vite.config.js | head -1 || echo "")
    if [ ! -z "$API_URL" ]; then
        if curl -k -s "$API_URL/api/v1/isAlive" &> /dev/null; then
            print_success "API accessible à $API_URL"
        else
            print_warning "API non accessible à $API_URL"
        fi
    fi
fi

# 3. Nettoyage du build précédent
print_step "Nettoyage du build précédent..."
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    print_success "Dossier $BUILD_DIR nettoyé"
fi

# 4. Build de production
print_step "Création du build de production..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    print_error "Échec du build. Le dossier $BUILD_DIR n'a pas été créé."
    exit 1
fi

print_success "Build créé avec succès"

# 5. Analyse du build
print_step "Analyse du build..."
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
print_success "Taille du build: $BUILD_SIZE ($FILE_COUNT fichiers)"

# 6. Création de l'archive
print_step "Création de l'archive de déploiement..."
ARCHIVE_NAME="${PROJECT_NAME}_${ENVIRONMENT}_${TIMESTAMP}.tar.gz"
tar -czf "$ARCHIVE_NAME" -C "$BUILD_DIR" .

ARCHIVE_SIZE=$(du -sh "$ARCHIVE_NAME" | cut -f1)
print_success "Archive créée: $ARCHIVE_NAME ($ARCHIVE_SIZE)"

# 7. Vérification du contenu
print_step "Vérification du contenu de l'archive..."
echo "Fichiers dans l'archive:"
tar -tzf "$ARCHIVE_NAME" | head -10
if [ $(tar -tzf "$ARCHIVE_NAME" | wc -l) -gt 10 ]; then
    echo "... et $(( $(tar -tzf "$ARCHIVE_NAME" | wc -l) - 10 )) autres fichiers"
fi

# 8. Test du build (optionnel)
if command -v python3 &> /dev/null; then
    print_step "Test du build avec serveur Python..."
    cd "$BUILD_DIR"
    timeout 5 python3 -m http.server 8999 &> /dev/null &
    SERVER_PID=$!
    sleep 2
    
    if curl -s http://localhost:8999/ | grep -q "<!doctype html>"; then
        print_success "Build testé avec succès"
    else
        print_warning "Impossible de tester le build"
    fi
    
    kill $SERVER_PID 2>/dev/null || true
    cd ..
fi

# 9. Instructions de déploiement
print_step "Instructions de déploiement:"
echo ""
echo "📦 Archive prête: $ARCHIVE_NAME"
echo ""
echo "🔧 Pour déployer sur un serveur web:"
echo "  1. Copiez l'archive sur votre serveur"
echo "  2. Extrayez: tar -xzf $ARCHIVE_NAME -C /var/www/html/"
echo "  3. Configurez votre serveur web (voir DEPLOYMENT.md)"
echo ""
echo "🐳 Pour Docker:"
echo "  docker run -p 80:80 -v \$(pwd)/$BUILD_DIR:/usr/share/nginx/html nginx"
echo ""
echo "☁️  Pour Netlify/Vercel:"
echo "  Glissez-déposez le dossier '$BUILD_DIR' dans l'interface web"
echo ""

# 10. Nettoyage optionnel
read -p "Voulez-vous supprimer le dossier de build local? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$BUILD_DIR"
    print_success "Dossier $BUILD_DIR supprimé"
fi

print_success "Déploiement préparé avec succès! 🎉"
echo ""
echo "📖 Consultez DEPLOYMENT.md pour plus de détails"
echo "🔍 Archive créée: $ARCHIVE_NAME"
