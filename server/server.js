import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser le client Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Limites de l'API Claude (officielles)
const API_LIMITS = {
  temperature: { min: 0, max: 1 },  // Claude API limite à 1.0 max
  maxTokens: { min: 1, max: 4096 }
};

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Route principale pour le chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, temperature, maxTokens } = req.body;

    // Validation
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Valider et limiter les paramètres selon les limites de l'API Claude
    const validatedTemperature = typeof temperature === 'number' 
      ? Math.max(API_LIMITS.temperature.min, Math.min(API_LIMITS.temperature.max, temperature))
      : 1.0;

    const validatedMaxTokens = typeof maxTokens === 'number'
      ? Math.max(API_LIMITS.maxTokens.min, Math.min(API_LIMITS.maxTokens.max, maxTokens))
      : 1024;

    console.log('📨 Message reçu:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));
    console.log('🌡️ Température demandée:', temperature, '→ validée:', validatedTemperature);
    console.log('📏 Max Tokens demandé:', maxTokens, '→ validé:', validatedMaxTokens);

    // Avertir si les paramètres ont été ajustés
    if (temperature !== validatedTemperature) {
      console.warn('⚠️ Température ajustée aux limites de l\'API Claude (max 1.0)');
    }

    // Appel à l'API Claude avec les paramètres
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: validatedMaxTokens,
      temperature: validatedTemperature,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    console.log('✅ Réponse reçue de Claude');

    // Renvoyer la réponse au client avec info sur les paramètres utilisés
    res.json({
      ...response,
      _meta: {
        requestedTemperature: temperature,
        usedTemperature: validatedTemperature,
        requestedMaxTokens: maxTokens,
        usedMaxTokens: validatedMaxTokens,
        adjusted: temperature !== validatedTemperature || maxTokens !== validatedMaxTokens
      }
    });
  } catch (error) {
    console.error('❌ Erreur:', error);

    // Gestion des erreurs spécifiques
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'API Key invalide. Vérifiez votre configuration.' 
      });
    }

    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Limite de requêtes atteinte. Réessayez plus tard.' 
      });
    }

    if (error.status === 400) {
      return res.status(400).json({ 
        error: 'Paramètres invalides : ' + (error.message || 'Vérifiez vos paramètres')
      });
    }

    if (error.status === 500) {
      return res.status(500).json({ 
        error: 'Erreur du serveur Anthropic. Réessayez plus tard.' 
      });
    }

    // Erreur générique
    res.status(500).json({ 
      error: error.message || 'Erreur interne du serveur' 
    });
  }
});

// Route pour obtenir les limites de l'API
app.get('/api/limits', (req, res) => {
  res.json({
    temperature: {
      ...API_LIMITS.temperature,
      default: 1.0,
      description: 'Contrôle la créativité des réponses (max 1.0 pour Claude API)'
    },
    maxTokens: {
      ...API_LIMITS.maxTokens,
      default: 1024,
      description: 'Limite la longueur de la réponse'
    },
    note: 'L\'API Claude limite la température à 1.0 maximum. Les valeurs supérieures seront automatiquement ajustées.'
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🔑 API Key configurée: ${process.env.ANTHROPIC_API_KEY ? '✅' : '❌'}`);
  console.log(`⚠️ Note: Température limitée à ${API_LIMITS.temperature.max} (limite API Claude)`);
});