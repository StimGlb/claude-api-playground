# Claude API Playground

Application de test pour expérimenter l'intégration de l'API Claude d'Anthropic avec React/Vite et Express.

## 🛠️ Stack Technique

- **Frontend** : React + Vite
- **Backend** : Express.js
- **API** : Anthropic Claude API (Sonnet 4.5)

## 📋 Prérequis

- Node.js (v18+)
- npm ou yarn
- Clé API Claude (Anthropic)

## 🚀 Installation

### 1. Cloner le repo
```bash
git clone https://github.com/votre-username/claude-api-playground.git
cd claude-api-playground
```

### 2. Configuration du Backend
```bash
cd server
npm install
```

Créez un fichier `.env` dans le dossier `server/` :
```env
CLAUDE_API_KEY=votre_clé_api_ici
PORT=3001
```

### 3. Configuration du Frontend
```bash
cd ../client
npm install
```

## 🎯 Démarrage

**Terminal 1 - Backend :**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd client
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## ⚠️ Sécurité

**IMPORTANT** : Ne jamais commit le fichier `.env` contenant votre clé API. Vérifiez que `.env` est bien dans le `.gitignore`.

## 📝 Notes

Projet de test et d'apprentissage. Non destiné à la production.
