import { useState } from 'react';
import { sendMessageToClaude } from '../services/api';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Préparer l'historique pour Claude
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Appeler l'API
      const data = await sendMessageToClaude(userMessage, conversationHistory);

      // Ajouter la réponse de Claude
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response 
      }]);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        💬 Chat avec Claude
      </h1>

      {/* Zone de messages */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        minHeight: '400px',
        maxHeight: '500px',
        overflowY: 'auto',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#999', textAlign: 'center' }}>
            Commencez une conversation avec Claude...
          </p>
        )}

        {messages.map((msg, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '15px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#fff',
              border: msg.role === 'user' ? '1px solid #2196f3' : '1px solid #ddd'
            }}
          >
            <strong style={{ 
              color: msg.role === 'user' ? '#1976d2' : '#f57c00',
              display: 'block',
              marginBottom: '5px'
            }}>
              {msg.role === 'user' ? '👤 Vous' : '🤖 Claude'}
            </strong>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ 
            padding: '12px', 
            color: '#666',
            fontStyle: 'italic' 
          }}>
            Claude est en train d'écrire...
          </div>
        )}

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px',
            color: '#c62828'
          }}>
            ⚠️ Erreur : {error}
          </div>
        )}
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isLoading ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? '...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}

export default Chat;