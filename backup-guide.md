# 🌿 Stratégie de Backup - Branches Git

## ✅ Configuration Actuelle

Votre projet `claude-api-playground` dispose maintenant de **2 branches** :

| Branche | Rôle | État |
|---------|------|------|
| **`main`** | Développement actif | 🚀 Branche de travail |
| **`stable-v1`** | Version stable | 🔒 Backup fonctionnel |

---

## 📦 Ce qui a été sauvegardé

La branche `stable-v1` contient :
- ✅ **Dark mode** permanent (CSS personnalisé)
- ✅ **Tailwind CSS** v3.4.0 configuré
- ✅ **Interface chat** moderne avec bulles
- ✅ **Animations** fluides (fade-in, slide-up)
- ✅ **Responsive design**
- ✅ **API Claude** fonctionnelle (proxy Vite + serveur Node.js)

---

## 🎯 Utilisation des Branches

### Développement Normal (main)

```bash
# Vous êtes déjà sur main par défaut
git checkout main

# Travailler normalement
git add .
git commit -m "Nouvelle fonctionnalité"
git push
```

### Consulter la Version Stable

```bash
# Basculer sur la version stable
git checkout stable-v1

# Regarder le code, tester...
# (NE PAS modifier sauf si c'est un correctif à backporter)

# Revenir au développement
git checkout main
```

### Voir Toutes les Branches

```bash
# Branches locales et distantes
git branch -a

# Résultat :
# * main
#   stable-v1
#   remotes/origin/main
#   remotes/origin/stable-v1
```

---

## 🔄 Scénarios Courants

### 1. Nouveau Repo à Partir de Stable

Si vous voulez créer un **nouveau projet** basé sur la version stable :

```bash
# Depuis un autre répertoire
cd /workspaces
git clone https://github.com/VOTRE-USERNAME/claude-api-playground.git nouveau-projet
cd nouveau-projet
git checkout stable-v1
git checkout -b main  # Créer une nouvelle branche main
```

### 2. Récupérer un Fichier de Stable

Si vous avez cassé quelque chose sur `main` et voulez récupérer depuis `stable-v1` :

```bash
# Depuis main
git checkout stable-v1 -- client/src/components/Chat.jsx
# Cela remplace le fichier actuel par la version stable
```

### 3. Créer une Nouvelle Version Stable

Quand votre `main` est prête pour une nouvelle sauvegarde :

```bash
git checkout main
git checkout -b stable-v2
git push -u origin stable-v2
git checkout main
```

---

## 🚨 Important

### ⚠️ Ne PAS faire sur stable-v1

- ❌ Développer de nouvelles features
- ❌ Expérimenter
- ❌ Modifier sauf correctifs critiques

### ✅ Faire sur main

- ✅ Toutes les nouvelles fonctionnalités
- ✅ Expérimentations
- ✅ Refactoring
- ✅ Tests

---

## 📊 État Actuel de Votre Setup

```
claude-api-playground/
├── main (branche active) ──────► Développement
└── stable-v1 ─────────────────► Backup sécurisé
    ├── Dark mode ✅
    ├── Tailwind ✅
    ├── Interface moderne ✅
    └── API fonctionnelle ✅
```

---

## 🎉 Prochaines Étapes

Vous pouvez maintenant :

1. **Continuer sur `main`** pour votre nouveau repo
2. **Expérimenter librement** sans risque
3. **Consulter `stable-v1`** si besoin de référence
4. **Créer `stable-v2`** quand vous aurez une nouvelle version stable

---

## 📞 Commandes de Référence Rapide

```bash
# Où suis-je ?
git branch

# Changer de branche
git checkout main
git checkout stable-v1

# Voir l'historique
git log --oneline --graph --all

# Voir les différences entre branches
git diff main..stable-v1
```

---

**Votre backup est maintenant sécurisé sur GitHub ! 🎯**