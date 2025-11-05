# 📝 Support Markdown - Guide d'Installation

Ajouter le formatage Markdown complet aux réponses de Claude !

---

## 🎯 Ce Qui Sera Formaté

### ✅ Texte
- **Gras** → `**texte**`
- *Italique* → `*texte*`
- ~~Barré~~ → `~~texte~~`

### ✅ Titres
```markdown
# Titre 1
## Titre 2
### Titre 3
```

### ✅ Listes
```markdown
- Item 1
- Item 2

1. Premier
2. Deuxième
```

### ✅ Code
```markdown
Code inline : `const x = 5;`

Bloc de code :
```javascript
function hello() {
  console.log("Hello!");
}
```
```

### ✅ Citations
```markdown
> Citation importante
```

### ✅ Liens
```markdown
[Texte du lien](https://example.com)
```

### ✅ Tableaux
```markdown
| Colonne 1 | Colonne 2 |
|-----------|-----------|
| A         | B         |
```

---

## ⚡ Installation

### Étape 1 : Installer les Packages NPM

```bash
cd /workspaces/claude-api-playground/client

# Installer react-markdown et syntax highlighter
npm install react-markdown react-syntax-highlighter

# Installer les types (si vous utilisez TypeScript)
npm install --save-dev @types/react-syntax-highlighter
```

**Temps d'installation** : ~30 secondes

---

### Étape 2 : Copier les Fichiers

```bash
cd /workspaces/claude-api-playground/client/src/components

# 1. Créer MessageContent.jsx
# Copiez le contenu de MessageContent.jsx (fourni)

# 2. Remplacer Chat.jsx
# Copiez le contenu de Chat-with-markdown.jsx → Chat.jsx
```

---

### Étape 3 : Redémarrer le Client

```bash
cd /workspaces/claude-api-playground/client
npm run dev
```

---

## 🧪 Test Rapide

### Test 1 : Formatage de Base

Envoyez ce message à Claude :
```
Écris-moi un exemple avec du **gras**, de l'*italique* et du `code`
```

Vous devriez voir :
- **gras** en blanc bold
- *italique* en italique
- `code` avec fond gris foncé

---

### Test 2 : Liste et Titres

Demandez à Claude :
```
Donne-moi une liste de 3 fruits avec un titre
```

Claude pourrait répondre :
```markdown
## Fruits

- Pomme
- Banane
- Orange
```

Vous devriez voir :
- Titre en gros et blanc
- Liste avec puces

---

### Test 3 : Code

Demandez :
```
Écris-moi une fonction JavaScript qui dit bonjour
```

Claude répondra avec un bloc de code coloré :
```javascript
function direBonjour(nom) {
  console.log(`Bonjour ${nom} !`);
}
```

Vous verrez la **coloration syntaxique** automatique ! 🎨

---

### Test 4 : Tableau

Demandez :
```
Crée un tableau comparant Python et JavaScript
```

Vous verrez un **vrai tableau** formaté avec bordures !

---

## 🎨 Styles Appliqués

### Messages Utilisateur (Bleu)
- Fond : Gradient bleu
- Code inline : Fond blanc semi-transparent
- Texte : Blanc

### Messages Claude (Gris Foncé)
- Fond : Gris foncé
- Code inline : Fond noir + texte bleu
- Blocs de code : Thème VS Code Dark Plus
- Liens : Bleu clair cliquable

---

## 🔧 Personnalisation

### Changer le Thème de Code

Dans `MessageContent.jsx`, ligne ~4 :

```javascript
// Thèmes disponibles :
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
```

### Modifier les Couleurs

Dans `MessageContent.jsx`, modifiez les classes Tailwind :

```javascript
// Exemple : changer la couleur des liens
a: ({ node, ...props }) => (
  <a
    className="text-purple-400 hover:text-purple-300 underline"  // ← Changez ici
    {...props}
  />
),
```

---

## 📦 Packages Installés

| Package | Taille | Utilité |
|---------|--------|---------|
| **react-markdown** | ~50KB | Parser Markdown |
| **react-syntax-highlighter** | ~150KB | Coloration code |

**Total** : ~200KB ajoutés au bundle

---

## 🐛 Dépannage

### Erreur : "Cannot find module 'react-markdown'"

```bash
cd /workspaces/claude-api-playground/client
npm install react-markdown
```

### Erreur : "Cannot find module 'react-syntax-highlighter'"

```bash
cd /workspaces/claude-api-playground/client
npm install react-syntax-highlighter
```

### Le Markdown ne s'affiche pas

1. Vérifiez que `MessageContent.jsx` existe dans `src/components/`
2. Vérifiez que Chat.jsx importe bien MessageContent :
   ```javascript
   import MessageContent from './MessageContent';
   ```
3. Redémarrez le serveur de dev : `npm run dev`

### Les Blocs de Code Sont Trop Larges

Dans `MessageContent.jsx`, ajoutez :
```javascript
<SyntaxHighlighter
  style={vscDarkPlus}
  language={match[1]}
  PreTag="div"
  className="rounded-lg text-sm overflow-x-auto max-w-full"  // ← Ajoutez ceci
>
```

---

## ✅ Checklist d'Installation

- [ ] Packages NPM installés (`react-markdown`, `react-syntax-highlighter`)
- [ ] `MessageContent.jsx` créé dans `src/components/`
- [ ] `Chat.jsx` mis à jour (importe MessageContent)
- [ ] Client redémarré
- [ ] Test avec texte **gras** → Fonctionne
- [ ] Test avec `code` → Fonctionne
- [ ] Test avec liste → Fonctionne
- [ ] Test avec bloc de code → Coloration syntaxique visible

---

## 🎉 Exemple Complet

Demandez à Claude :
```
Explique-moi comment créer une fonction en Python avec un exemple de code
```

Claude répondra quelque chose comme :

---

**Voici comment créer une fonction en Python :**

## Syntaxe de Base

Pour créer une fonction, utilisez le mot-clé `def` suivi du nom de la fonction et de parenthèses.

### Exemple Simple

```python
def ma_fonction():
    print("Bonjour depuis ma fonction !")
    
# Appel de la fonction
ma_fonction()
```

### Fonction avec Paramètres

```python
def additionner(a, b):
    resultat = a + b
    return resultat

# Utilisation
somme = additionner(5, 3)
print(f"La somme est : {somme}")
```

**Points Importants :**

- Les fonctions doivent être *définies* avant d'être appelées
- L'indentation est **obligatoire** en Python
- Utilisez `return` pour renvoyer une valeur

> Conseil : Donnez des noms clairs à vos fonctions !

---

Et tout ça sera **magnifiquement formaté** ! 🎨✨

---

## 🚀 Aller Plus Loin

### Ajouter le Support LaTeX (Maths)

```bash
npm install remark-math rehype-katex
```

Puis dans `MessageContent.jsx` :
```javascript
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

<ReactMarkdown
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
  // ...
>
```

### Ajouter les Emojis

```bash
npm install remark-emoji
```

---

**Votre chat supporte maintenant le Markdown complet ! 🎉**
