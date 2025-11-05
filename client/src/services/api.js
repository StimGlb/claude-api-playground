/**
 * Service API pour communiquer avec le backend
 * Gère l'envoi des messages et des paramètres API à Claude
 */

const API_BASE_URL = '/api';

/**
 * Envoie un message à Claude avec les paramètres configurés
 * @param {string} message - Le message de l'utilisateur
 * @param {Object} settings - Paramètres API (temperature, maxTokens)
 * @returns {Promise<Object>} - La réponse de Claude
 */
export const sendMessageToClaude = async (message, settings = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        temperature: settings.temperature || 1.0,
        maxTokens: settings.maxTokens || 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Erreur HTTP: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'appel API:', error);
    throw error;
  }
};

/**
 * Vérifie si l'API est accessible
 * @returns {Promise<boolean>}
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API non accessible:', error);
    return false;
  }
};