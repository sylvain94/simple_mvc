#!/bin/bash

# 🚀 depoloyment script for mediahub-admin
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="mediahub-admin"
BUILD_DIR="dist"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "🚀 Deployment of $PROJECT_NAME in mode $ENVIRONMENT"
echo "📅 Timestamp: $TIMESTAMP"

# Colors for logs
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
print_step "Verification of environment..."

if [ ! -f "package.json" ]; then
    print_error "package.json not found. Run the script from the project root."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    print_warning "node_modules missing. Installing dependencies..."
    npm install
fi

# 2. Tests et vérifications
print_step "Execution of checks..."

# Verify that the API is accessible (optional)
if command -v curl &> /dev/null; then
    API_URL=$(grep -o 'https://[^"]*' vite.config.js | head -1 || echo "")
    if [ ! -z "$API_URL" ]; then
        if curl -k -s "$API_URL/api/v1/isAlive" &> /dev/null; then
            print_success "API accessible at $API_URL"
        else
            print_warning "API not accessible at $API_URL"
        fi
    fi
fi

# 3. Cleaning previous build
print_step "Cleaning previous build..."
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    print_success "Directory $BUILD_DIR cleaned"
fi

# 4. Build of production
print_step "Creation of production build..."
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build failed. The directory $BUILD_DIR has not been created."
    exit 1
fi

print_success "Build created successfully"

# 5. Analysis of build
print_step "Analysis of build..."
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
print_success "Size of build: $BUILD_SIZE ($FILE_COUNT files)"

# 6. Creation of deployment archive
print_step "Creation of deployment archive..."
ARCHIVE_NAME="${PROJECT_NAME}_${ENVIRONMENT}_${TIMESTAMP}.tar.gz"
tar -czf "$ARCHIVE_NAME" -C "$BUILD_DIR" .

ARCHIVE_SIZE=$(du -sh "$ARCHIVE_NAME" | cut -f1)
print_success "Archive created: $ARCHIVE_NAME ($ARCHIVE_SIZE)"

# 7. Verification of archive content
print_step "Verification of archive content..."
echo "Fichiers dans l'archive:"
tar -tzf "$ARCHIVE_NAME" | head -10
if [ $(tar -tzf "$ARCHIVE_NAME" | wc -l) -gt 10 ]; then
    echo "... and $(( $(tar -tzf "$ARCHIVE_NAME" | wc -l) - 10 )) other files"
fi

# 8. Test of build (optional)
if command -v python3 &> /dev/null; then
    print_step "Test of build with Python server..."
    cd "$BUILD_DIR"
    timeout 5 python3 -m http.server 8999 &> /dev/null &
    SERVER_PID=$!
    sleep 2
    
    if curl -s http://localhost:8999/ | grep -q "<!doctype html>"; then
        print_success "Build tested successfully"
    else
        print_warning "Impossible to test the build"
    fi
    
    kill $SERVER_PID 2>/dev/null || true
    cd ..
fi

# 9. Deployment instructions
print_step "Deployment instructions:"
echo ""
echo "📦 Archive prête: $ARCHIVE_NAME"
echo ""
echo "🔧 To deploy on a web server:"
echo "  1. Copy the archive to your server"
echo "  2. Extract: tar -xzf $ARCHIVE_NAME -C /var/www/html/"
echo "  3. Configure your web server (see DEPLOYMENT.md)"
echo ""
echo "🐳 For Docker:"
echo "  docker run -p 80:80 -v \$(pwd)/$BUILD_DIR:/usr/share/nginx/html nginx"
echo ""
echo "☁️  For Netlify/Vercel:"
echo "  Drag and drop the '$BUILD_DIR' directory into the web interface"
echo ""

# 10. Cleaning optional
read -p "Do you want to delete the build directory? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$BUILD_DIR"
    print_success "Directory $BUILD_DIR deleted"
fi

print_success "Deployment prepared successfully! 🎉"
echo ""
echo "📖 See DEPLOYMENT.md for more details"
echo "🔍 Archive created: $ARCHIVE_NAME"
