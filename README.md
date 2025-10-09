# 🚀 Simple MVC

A modern application based on MVC architecture with Vue 3, built with best practices and current technologies.

## 🛠 Technology Stack

- **Frontend:** Vue 3 (Composition API) + Vite
- **Styling:** Tailwind CSS + DaisyUI
- **Routing:** Vue Router 4
- **State Management:** Pinia
- **Build Tool:** Vite
- **Runtime:** Node.js 18.20+ (compatible with Vite 5.x) or 20.19+ (for Vite 7.x)

## 📁 Project Structure

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants d'interface
│   └── WizardModal.vue # Modal wizard
├── views/              # Pages/Vues principales (MVC Views)
│   ├── Dashboard.vue   # Tableau de bord
│   ├── Login.vue       # Page de connexion
│   └── Settings.vue    # Paramètres
├── stores/             # Stores Pinia (MVC Models)
│   ├── app.js          # Store application
│   └── user.js         # Store utilisateur
├── services/           # Services API (MVC Controllers)
│   └── api.js          # Client API REST
├── router/             # Configuration des routes
│   └── index.js        # Routes de l'application
├── App.vue             # Composant racine
├── main.js             # Point d'entrée
└── style.css           # Styles globaux
```

## 🎨 Functionalities

### ✅ User interface
- **Navigation responsive** with mobile menu
- **Système de thèmes** (Light, Dark, Cupcake, etc.)
- **Dashboard interactif** with statistics and quick actions
- **Formulaire de connexion** with validation
- **Page de paramètres** complete (profile, appearance, notifications, security)

### ✅ Architecture MVC
- **Models:** Pinia Stores for Condition Management
- **Views:** Component Vuejs with Routing
- **Controllers:** API services for business logic

### ✅ Technologies Modernes
- **Vue 3 Composition API** for a better reactivity
- **Tailwind CSS** for utility-first styling
- **DaisyUI** for ready-to-use components
- **Vue Router** for SPA navigation
- **Pinia** for simple and effective state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18.20+ (minimum) or 20.19+ (recommended)
- npm 8.0+

### Installation

#### Option 1: Standard Installation (Node.js 18.20+)
```bash
# Clone the project
git clone https://github.com/sylvain94/simple_mvc.git
cd simple_mvc

# Install dependencies
npm install

# Launch the development server
npm run dev
```

#### Option 2: With Node.js Update (if you have Node.js < 18.20)
```bash
# Update Node.js to version 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify versions
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x

# Clone and install
git clone https://github.com/sylvain94/simple_mvc.git
cd simple_mvc
npm install
npm run dev
```

#### Option 3: Using NVM (Node Version Manager)
```bash
# Install NVM if not already done
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

# Install and use Node.js 20 (LTS)
nvm install 20
nvm use 20

# Clone and install
git clone https://github.com/sylvain94/simple_mvc.git
cd simple_mvc
npm install
npm run dev
```

### 🐧 Linux Server Installation (Headless)
If you're installing on a Linux server without GUI:

```bash
# Configure environment for headless server
export QT_QPA_PLATFORM=offscreen
echo 'export QT_QPA_PLATFORM=offscreen' >> ~/.bashrc

# Then follow standard installation
npm install
npm run dev
```

## 📖 Available Scripts

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ "vite: not found" Error
```bash
# Solution: Install dependencies first
npm install
```

#### ❌ "Unsupported engine" or Node.js Version Error
```bash
# Check your Node.js version
node --version

# If < 18.20, update Node.js:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Then reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Qt/XCB Display Errors on Linux Servers
```bash
# Add environment variable for headless servers
export QT_QPA_PLATFORM=offscreen
echo 'export QT_QPA_PLATFORM=offscreen' >> ~/.bashrc
source ~/.bashrc
```

#### ❌ Permission Errors with npm
```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
# Or install with sudo and fix ownership
sudo npm install
sudo chown -R $USER:$USER node_modules
```

#### ✅ Verify Installation
```bash
# Check versions
node --version    # Should be >= 18.20
npm --version     # Should be >= 8.0
npx vite --version # Should show Vite version

# Test the application
npm run dev
# Should show: "VITE ready in XXX ms" and network URLs
```

## 🎯 Available Pages

- **`/`** - Main dashboard with statistics and actions
- **`/login`** - Login page with validation
- **`/settings`** - Settings (profile, theme, notifications, security)

## 🔧 Configuration

### DaisyUI Themes Available
- Light, Dark, Cupcake, Bumblebee, Emerald, Corporate, etc.

### Environment Variables
Create a file `.env` based on `.env.example`:
```env
VITE_API_BASE=http://localhost:8080/api/v1
VITE_APP_NAME=Simple MVC
VITE_APP_VERSION=1.0.0
```

## 🤝 Contribution

1. Fork the projet
2. Create a branch for your functionality (`git checkout -b feature/AmazingFeature`)
3. Commit yours changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to your branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see file [LICENSE](LICENSE) for more details.

---

**Developed with ❤️ by [Sylvain Renard](https://github.com/sylvain94)**
