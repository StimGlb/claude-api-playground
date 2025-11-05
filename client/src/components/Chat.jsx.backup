import { useState, useRef, useEffect } from 'react';
import { sendMessageToClaude } from '../services/api';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le bas quand un nouveau message arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar gauche (optionnelle, pour futures features) */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Claude Chat</h1>
          <p className="text-sm text-gray-500 mt-2">Playground API</p>
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">Claude Assistant</h2>
                <p className="text-xs text-gray-500">Sonnet 4.5</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoading && (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  En train d'écrire...
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Zone de messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Commencez une conversation
              </h3>
              <p className="text-gray-500 max-w-md">
                Posez n'importe quelle question à Claude. Il est là pour vous aider !
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex gap-3 animate-slide-up ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-purple-600'
              }`}>
                <span className="text-white text-sm">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </span>
              </div>

              {/* Message */}
              <div className={`flex-1 max-w-2xl ${
                msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}>
                <div className={`px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'chat-bubble-user' 
                    : 'chat-bubble-assistant'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex gap-3 animate-slide-up">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="mx-auto max-w-2xl">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-red-800">Une erreur est survenue</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="border-t border-gray-200 bg-white px-4 py-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Écrivez votre message... (Enter pour envoyer, Shift+Enter pour nouvelle ligne)"
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:bg-gray-100 disabled:cursor-not-allowed
                           resize-none overflow-hidden"
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                         rounded-2xl font-medium transition-all duration-200
                         hover:from-blue-600 hover:to-blue-700 
                         disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         shadow-lg hover:shadow-xl
                         flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Envoyer</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Claude peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;