const API_URL = ''; // Vide ! Vite va proxifier

export const sendMessageToClaude = async (message, conversationHistory = []) => {
  const response = await fetch(`/api/chat`, { // Chemin relatif
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