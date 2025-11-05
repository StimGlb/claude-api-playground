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