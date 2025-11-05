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
  apiKey: process.env.CLAUDE_API_KEY,
});

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

    // Valider les paramètres
    const validatedTemperature = typeof temperature === 'number' 
      ? Math.max(0, Math.min(2, temperature))  // Limite entre 0 et 2
      : 1.0;

    const validatedMaxTokens = typeof maxTokens === 'number'
      ? Math.max(256, Math.min(4096, maxTokens))  // Limite entre 256 et 4096
      : 1024;

    console.log('📨 Message reçu:', message);
    console.log('🌡️ Température:', validatedTemperature);
    console.log('📏 Max Tokens:', validatedMaxTokens);

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

    // Renvoyer la réponse au client
    res.json(response);
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
      min: 0,
      max: 2,
      default: 1.0,
      description: 'Contrôle la créativité des réponses'
    },
    maxTokens: {
      min: 256,
      max: 4096,
      default: 1024,
      description: 'Limite la longueur de la réponse'
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🔑 API Key configurée: ${process.env.CLAUDE_API_KEY ? '✅' : '❌'}`);
});