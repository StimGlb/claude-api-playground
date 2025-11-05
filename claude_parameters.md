## **Temperature** (0.0 - 1.0)
- **0.0 - 0.3** : Très déterministe, précis, idéal pour :
  - Code
  - Analyses techniques
  - Réponses factuelles
- **0.4 - 0.7** : Équilibré (recommandé pour usage général)
- **0.8 - 1.0** : Créatif, varié, pour :
  - Écriture créative
  - Brainstorming
  - Contenu original

## **Max_tokens**
- Limite la longueur de ma réponse
- 1 token ≈ 0.75 mot (approximatif)
- Exemples : 500 (court), 2000 (moyen), 4000+ (long)

## **System prompt**
Le plus puissant ! Définit mon comportement :
```json
{
  "system": "Tu es un assistant technique spécialisé en Python. Réponds de manière concise avec des exemples de code."
}
```

## **Top_p** (0.0 - 1.0)
- Alternative à temperature
- 0.9 : bon équilibre (recommandé)

## **Top_k**
- Limite le nombre de tokens considérés
- Rarement utilisé avec Claude
