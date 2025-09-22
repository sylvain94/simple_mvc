# 🚀 Simple MVC

Une application moderne basée sur l'architecture MVC avec Vue 3, construite avec les meilleures pratiques et les technologies actuelles.

## 🛠 Stack Technologique

- **Frontend:** Vue 3 (Composition API) + Vite
- **Styling:** Tailwind CSS + DaisyUI
- **Routing:** Vue Router 4
- **State Management:** Pinia
- **Build Tool:** Vite
- **Runtime:** Node.js 22.19.0 (géré avec NVM)

## 📁 Structure du Projet

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

## 🎨 Fonctionnalités

### ✅ Interface Utilisateur
- **Navigation responsive** avec menu mobile
- **Système de thèmes** (Light, Dark, Cupcake, etc.)
- **Dashboard interactif** avec statistiques et actions rapides
- **Formulaire de connexion** avec validation
- **Page de paramètres** complète (profil, apparence, notifications, sécurité)

### ✅ Architecture MVC
- **Models:** Stores Pinia pour la gestion d'état
- **Views:** Composants Vue avec routing
- **Controllers:** Services API pour la logique métier

### ✅ Technologies Modernes
- **Vue 3 Composition API** pour une meilleure réactivité
- **Tailwind CSS** pour un styling utility-first
- **DaisyUI** pour des composants prêts à l'emploi
- **Vue Router** pour la navigation SPA
- **Pinia** pour un state management simple et efficace

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20.19+ ou 22.12+ (recommandé: 22.19.0 avec NVM)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone https://github.com/sylvain94/simple_mvc.git
cd simple_mvc

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Configuration NVM (recommandé)
```bash
# Installer NVM si pas déjà fait
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Installer et utiliser Node.js 22
nvm install --lts
nvm use --lts
```

## 📖 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
```

## 🎯 Pages Disponibles

- **`/`** - Dashboard principal avec statistiques et actions
- **`/login`** - Page de connexion avec validation
- **`/settings`** - Paramètres (profil, thème, notifications, sécurité)

## 🔧 Configuration

### Thèmes DaisyUI Disponibles
- Light, Dark, Cupcake, Bumblebee, Emerald, Corporate, etc.

### Variables d'Environnement
Créez un fichier `.env` basé sur `.env.example`:
```env
VITE_API_BASE=http://localhost:8080/api/v1
VITE_APP_NAME=Simple MVC
VITE_APP_VERSION=1.0.0
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Développé avec ❤️ par [Sylvain Renard](https://github.com/sylvain94)**
