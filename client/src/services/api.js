const API_URL = 'http://localhost:3001';

export const sendMessageToClaude = async (message, conversationHistory = []) => {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, conversationHistory })
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la communication avec le serveur');
  }

  return response.json();
};