# Guide de Dépannage - Claude API Playground

**Date :** 5 novembre 2025  
**Projet :** Claude API Playground  
**Problème :** Résolution des erreurs 504 et 502

---

## 📋 Table des matières

1. [Problème Initial](#1-problème-initial)
2. [Diagnostic](#2-diagnostic)
3. [Solution](#3-solution)
4. [Sauvegarde du Projet](#4-sauvegarde-du-projet)
5. [Problèmes Supplémentaires](#5-problèmes-supplémentaires)
6. [Commandes Utiles](#6-commandes-utiles)
7. [Résumé](#7-résumé)

---

## 1. Problème Initial

### 1.1 Symptômes

L'application affichait les erreurs suivantes lors de l'envoi de messages à Claude :

- ❌ Erreur 504 (Gateway Timeout)
- ❌ Message : `Failed to load resource: the server responded with a status of 504`
- ❌ L'interface affichait "Claude est en train d'écrire..." puis plantait

### 1.2 Code source de l'erreur

```
/api/chat:1  Failed to load resource: the server responded with a status of 504 ()
Chat.jsx:39 Erreur: Error: Erreur lors de la communication avec le serveur
    at sendMessageToClaude (api.js:13:11)
    at async handleSubmit (Chat.jsx:30:20)
```

---

## 2. Diagnostic

### 2.1 Cause racine

**Le proxy Vite était mal configuré et pointait vers lui-même, créant une boucle infinie.**

| ❌ Configuration Incorrecte | ✅ Configuration Correcte |
|----------------------------|---------------------------|
| `target: 'https://...5173.app.github.dev/'` | `target: 'http://localhost:3001'` |

**⚠️ Le port 5173 est le port de Vite, pas du serveur Node.js !**

---

## 3. Solution

### 3.1 Correction du vite.config.js

Remplacer le contenu du fichier `vite.config.js` par :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // ✅ Pointe vers Node.js
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### 3.2 Démarrage correct

Toujours démarrer les serveurs dans cet ordre :

#### **Étape 1 : Terminal 1 - Démarrer le backend Node.js**

```bash
cd /workspaces/claude-api-playground
node server.js
```

Vous devriez voir : `🚀 Serveur démarré sur http://localhost:3001`

#### **Étape 2 : Terminal 2 - Démarrer le frontend Vite**

```bash
cd /workspaces/claude-api-playground/client
npm run dev
```

Vous devriez voir : `Local: http://localhost:5173/`

---

## 4. Sauvegarde du Projet

### 4.1 Méthode Git (Recommandée)

```bash
cd /workspaces/claude-api-playground
git add .
git commit -m "✅ Fix proxy Vite + backup complet"
git push origin main
```

### 4.2 Méthode Archive TAR

```bash
cd /workspaces
tar -czf claude-backup.tar.gz claude-api-playground/
```

Puis télécharger le fichier via l'interface Codespaces :
1. Clic droit sur `claude-backup.tar.gz`
2. Sélectionner **"Download"**

---

## 5. Problèmes Supplémentaires

### 5.1 Erreur Git Push

**Erreur :**
```
! [rejected]        main -> main (fetch first)
error: failed to push some refs
```

**Solution :**
```bash
git pull origin main --rebase
git push origin main
```

### 5.2 Erreur 502 au redémarrage

**Erreur :**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Cause :** Un processus Node.js est déjà en cours sur le port 3001

**Solution :**
```bash
# Tuer le processus qui utilise le port 3001
kill -9 $(lsof -ti:3001)

# Redémarrer le serveur
node server.js
```

---

## 6. Commandes Utiles

| Action | Commande |
|--------|----------|
| **Vérifier le port 3001** | `lsof -i:3001` |
| **Tuer un processus sur le port 3001** | `kill -9 $(lsof -ti:3001)` |
| **Tuer tous les processus Node.js** | `pkill -9 node` |
| **Voir tous les processus Node** | `ps aux \| grep node` |
| **Backup Git rapide** | `git add . && git commit -m "Backup" && git push origin main` |
| **Créer une archive TAR** | `tar -czf backup.tar.gz dossier/` |

---

## 7. Résumé

### ✅ Points clés à retenir :

1. **Le proxy Vite doit pointer vers `http://localhost:3001`** (serveur Node.js)
2. **Toujours démarrer le backend AVANT le frontend**
3. **Vérifier que le port 3001 est libre** avant de démarrer le serveur
4. **Faire des backups réguliers avec Git**
5. **En cas d'erreur 502**, tuer les processus Node.js zombies avec `kill -9 $(lsof -ti:3001)`

---

## 📁 Structure du projet

```
claude-api-playground/
├── server.js              # Backend Node.js (port 3001)
├── package.json           # Dépendances serveur
├── .env                   # Clé API (NE PAS COMMIT)
└── client/
    ├── src/
    │   ├── components/
    │   │   └── Chat.jsx   # Interface chat
    │   └── services/
    │       └── api.js     # Client API
    ├── vite.config.js     # Configuration Vite (CORRIGÉ ✅)
    └── package.json       # Dépendances client
```

---

## 🎯 Résultat final

✅ **Erreur 504 résolue**  
✅ **Proxy Vite corrigé**  
✅ **Projet sauvegardé**  
✅ **Documentation complète**

---

**Document généré avec Claude Sonnet 4.5** 🤖

## Bonus :

cd /workspaces/claude-api-playground/client

# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller tout
npm install

# Réessayer l'installation de Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 🐛 Debug Final - Tailwind CSS ne charge pas

## 📋 Problème rencontré

### Erreur affichée
```
[vite] Internal server error: [postcss] It looks like you're trying to use 
`tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to 
a separate package, so to continue using Tailwind CSS with PostCSS you'll 
need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

---

## 🔍 Cause du problème

**Tailwind CSS v4 (beta) installé au lieu de v3 (stable)**

Quand vous faites `npm install tailwindcss`, npm installe par défaut la **dernière version disponible**, qui est actuellement la **v4 beta**.

### Différences v3 vs v4

| Aspect | Tailwind v3 (stable) | Tailwind v4 (beta) |
|--------|---------------------|-------------------|
| **PostCSS plugin** | `tailwindcss` | `@tailwindcss/postcss` |
| **Configuration** | `tailwind.config.js` | Nouvelle syntaxe CSS |
| **Stabilité** | ✅ Production ready | ⚠️ Beta (peut changer) |
| **Documentation** | ✅ Complète | 🚧 En cours |
| **Prototypage** | ✅ Parfait | ⚠️ Peut casser |

---

## ✅ Solution - Downgrade vers v3

### Commandes à exécuter

```bash
cd /workspaces/claude-api-playground/client

# 1. Désinstaller Tailwind v4
npm uninstall tailwindcss postcss autoprefixer

# 2. Installer Tailwind v3 (stable)
npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0

# 3. Supprimer le cache Vite
rm -rf node_modules/.vite

# 4. Redémarrer Vite
npm run dev
```

### Résultat attendu

```bash
✅ Tailwind CSS v3.4.0 installé
✅ PostCSS fonctionne correctement
✅ Vite compile sans erreur
✅ Les styles s'appliquent dans le navigateur
```

---

## 🆕 Alternative - Utiliser Tailwind v4

Si vous souhaitez utiliser la nouvelle version v4 beta :

### Étape 1 : Installer le nouveau plugin

```bash
npm install -D @tailwindcss/postcss
```

### Étape 2 : Modifier postcss.config.js

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // ← Nouveau plugin v4
    autoprefixer: {},
  },
}
```

### Étape 3 : Redémarrer Vite

```bash
rm -rf node_modules/.vite
npm run dev
```

---

## 💡 Recommandation

### Utilisez Tailwind v3 pour :
- ✅ Prototypage rapide
- ✅ Projets en production
- ✅ Stabilité garantie
- ✅ Documentation complète
- ✅ Compatibilité avec tous les outils

### Utilisez Tailwind v4 seulement si :
- 🧪 Vous voulez tester les nouvelles features
- 🚀 Projet expérimental
- 📚 Vous êtes prêt à suivre les changements beta

**Pour votre projet actuel : Tailwind v3 est le bon choix ! ✅**

---

## 🔧 Vérification post-installation

### 1. Vérifier la version installée

```bash
npm list tailwindcss
```

**Devrait afficher :**
```
tailwindcss@3.4.0
```

### 2. Test dans le navigateur

Ouvrez la console (F12) et testez :

```javascript
document.body.classList.add('bg-red-500')
```

- **Fond rouge** → ✅ Tailwind marche !
- **Pas de changement** → ❌ Problème persiste

### 3. Test visuel dans Chat.jsx

Ajoutez temporairement :

```jsx
<div className="bg-blue-500 text-white p-4 text-center font-bold">
  🎉 TAILWIND FONCTIONNE !
</div>
```

---

## 📊 Récapitulatif du problème

### Timeline du debug

1. ✅ **Installation initiale** : `npm install -D tailwindcss`
2. ⚠️ **npm installe v4 beta** par défaut
3. ❌ **Erreur PostCSS** : plugin incompatible
4. 🔍 **Diagnostic** : Vérification de l'erreur
5. ✅ **Solution** : Downgrade vers v3.4.0
6. 🎉 **Résultat** : Tout fonctionne !

---

## 🎯 Leçons apprises

### Pour éviter ce problème à l'avenir

**Toujours spécifier la version lors de l'installation :**

```bash
# ❌ Mauvais (installe la dernière, même beta)
npm install -D tailwindcss

# ✅ Bon (installe une version stable précise)
npm install -D tailwindcss@^3.4.0
```

### Bonnes pratiques npm

```bash
# Voir les versions disponibles
npm view tailwindcss versions

# Installer une version spécifique
npm install -D package@version

# Vérifier la version installée
npm list package
```

---

## 📚 Ressources utiles

- **Tailwind v3 Docs** : https://tailwindcss.com/docs
- **Tailwind v4 Beta** : https://tailwindcss.com/blog/tailwindcss-v4-alpha
- **PostCSS** : https://postcss.org/
- **Vite + Tailwind** : https://tailwindcss.com/docs/guides/vite

---

## ✅ Checklist finale

- [x] Tailwind v3.4.0 installé
- [x] PostCSS configuré correctement
- [x] Cache Vite supprimé
- [x] Vite redémarré
- [x] Styles appliqués dans le navigateur
- [x] Interface modernisée fonctionnelle

---

## 🎉 Résultat final

```
Avant : Styles inline CSS dans JSX 😐
Après : Tailwind CSS v3 + Design moderne ✨

✅ Bulles de chat élégantes
✅ Gradients bleu/violet
✅ Animations fluides
✅ Responsive design
✅ Auto-scroll
✅ Loading states
```

_Document généré le 5 novembre 2025 - Debug session avec Claude Sonnet 4.5_