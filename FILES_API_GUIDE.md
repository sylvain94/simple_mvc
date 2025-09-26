# 📁 Guide de test de l'API Files

## ✅ Modèle InputFile adapté

Le modèle `InputFile` a été mis à jour pour correspondre exactement à votre structure API :

### 🔗 Propriétés principales mappées :
- ✅ `id` → `120372d5-26f1-4850-86a5-e57968fcb38d`
- ✅ `name` → `"Mire 720p"`
- ✅ `filePath` + `fileName` → `"/home/ansible/" + "mire_720p.ts"`
- ✅ `multicastAddress` + `multicastPort` → `"232.0.0.2:6005"`
- ✅ `sourceAddress` → `"192.168.1.20"`
- ✅ `running`, `enabled`, `active` → Status management
- ✅ `command`, `inputOptions`, `outputOptions` → FFmpeg configuration
- ✅ `packetSize` → `1316`

### 🎯 Propriétés calculées :
- `status` → "Active" | "Stopped" | "Running (Disabled)" | "Disabled"
- `multicastAddressFormatted` → "232.0.0.2:6005"
- `fullPath` → "/home/ansible/mire_720p.ts"
- `isActive` → true/false

## 🧪 Pages de test disponibles

### 1. Test du modèle InputFile
```
http://192.168.1.141:8081/test-inputfile-model.html
```
- Teste la création du modèle avec vos données API
- Affiche les propriétés calculées
- Montre le rendu comme dans l'interface Vue

### 2. Test de l'API Files
```
http://192.168.1.141:8081/test-files-api.html
```
- Teste directement l'endpoint `/api/v1/functions/input_files/getAll`
- Permet de configurer le token Bearer
- Affiche les réponses API en détail

### 3. Application principale
```
http://192.168.1.141:8081/
```
- Interface Vue.js complète
- Page Files avec chargement automatique
- Authentification requise

## 🔄 Flux de données

### 1. Clic sur "Files" dans le menu
```javascript
// 1. Vue mounted
onMounted(() => {
  refreshFiles()
})

// 2. Controller call
InputFileController.getAllInputFiles()

// 3. API request
GET /api/v1/functions/input_files/getAll
Authorization: Bearer {token}

// 4. Model creation
files.map(fileData => InputFile.fromApiResponse(fileData))

// 5. UI update
inputFiles.value = files
```

### 2. Affichage dans le tableau
```html
<!-- Name column -->
<td>{{ file.name }}</td>

<!-- Path column -->
<td>{{ file.fullPath }}</td>

<!-- Status column -->
<td class="badge" :class="file.getStatusBadgeClass()">
  {{ file.status }}
</td>

<!-- Multicast column -->
<td>{{ file.multicastAddressFormatted }}</td>
```

## 🎮 Actions disponibles

### ✅ Implémentées
- **Refresh** → Recharge les données depuis l'API
- **Search** → Filtre par nom, chemin, IP, commande
- **Select** → Sélection multiple avec actions en lot
- **View Details** → Affichage complet des propriétés

### 🚧 À implémenter (TODOs)
- **Start/Stop** → Appels API vers les endpoints start/stop
- **Edit** → Modal d'édition des propriétés
- **Create** → Modal de création de nouveaux fichiers
- **Analyze** → Analyse des flux avec `tsp`
- **Delete** → Suppression avec confirmation

## 🔧 Configuration API

### Endpoint principal
```
GET /api/v1/functions/input_files/getAll
```

### Headers requis
```
Authorization: Bearer {JWT_TOKEN}
Accept: */*
Content-Type: application/json
```

### Réponse attendue
```json
[
  {
    "id": "120372d5-26f1-4850-86a5-e57968fcb38d",
    "functionType": "InputFileToTSEntity",
    "name": "Mire 720p",
    "filePath": "/home/ansible/",
    "fileName": "mire_720p.ts",
    "multicastAddress": "232.0.0.2",
    "multicastPort": 6005,
    "sourceAddress": "192.168.1.20",
    "running": false,
    "enabled": true,
    "active": true,
    "packetSize": 1316,
    // ... autres propriétés
  }
]
```

## 🎯 Prochaines étapes

1. **Tester l'authentification** avec un token valide
2. **Vérifier l'endpoint API** depuis l'interface
3. **Implémenter les actions Start/Stop** si nécessaire
4. **Ajouter les modals** d'édition et création
5. **Optimiser les performances** avec pagination si nécessaire

## 🐛 Debug

### Console logs à observer
```javascript
🔄 Refreshing input files...
📁 Raw API response: [...]
✅ Successfully loaded X input files
📊 Input files count updated: X
```

### En cas d'erreur
```javascript
❌ Error fetching input files: [message]
```

L'architecture MVC est respectée avec :
- **Model** : `InputFile.js` - Gestion des données
- **View** : `Files.vue` - Interface utilisateur
- **Controller** : `InputFileController.js` - Logique métier

## 🎉 Résultat

Votre page Files charge maintenant automatiquement les données depuis l'API au clic, avec une interface moderne utilisant DaisyUI et une architecture MVC propre !
