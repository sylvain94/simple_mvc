# 🚀 Simple MVC

A modern application based on MVC architecture with Vue 3, built with best practices and current technologies.

## 🛠 Technology Stack

- **Frontend:** Vue 3 (Composition API) + Vite
- **Styling:** Tailwind CSS + DaisyUI
- **Routing:** Vue Router 4
- **State Management:** Pinia
- **Build Tool:** Vite
- **Runtime:** Node.js 22.19.0 (managed with NVM)

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
- Node.js 20.19+ ou 22.12+ (recommended: 22.19.0 with NVM)
- npm or yarn

### Installation
```bash
# Clone the projet
git clone https://github.com/sylvain94/simple_mvc.git
cd simple_mvc

# Install the dependancies
npm install

# Launch the development server
npm run dev
```

### NVM Configuration (recommended)
```bash
# Install if not already done
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Install and use Node.js 22
nvm install --lts
nvm use --lts
```

## 📖 Available Scripts

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
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
