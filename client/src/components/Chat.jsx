import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToClaude } from '../services/api';
import ApiSettings from './ApiSettings';
import SpellChecker from './SpellChecker';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [apiSettings, setApiSettings] = useState({
    temperature: 1.0,
    maxTokens: 1024
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Déclencher la vérification orthographique
    setPendingMessage(input.trim());
    setShowSpellCheck(true);
  };

  const handleSpellCheckConfirm = async () => {
    setShowSpellCheck(false);
    
    const userMessage = {
      role: 'user',
      content: pendingMessage,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setPendingMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToClaude(pendingMessage, apiSettings);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.content[0].text,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: `Erreur: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpellCheckCancel = () => {
    setShowSpellCheck(false);
    setPendingMessage('');
    // L'utilisateur peut corriger son texte
  };

  const handleSettingsChange = (newSettings) => {
    setApiSettings(newSettings);
    console.log('Nouveaux paramètres API:', newSettings);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header avec paramètres */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Claude API Playground
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Propulsé par Claude Sonnet 4.5 • Vérification orthographique activée
            </p>
          </div>
          
          {/* Paramètres API */}
          <ApiSettings 
            onSettingsChange={handleSettingsChange}
            initialSettings={apiSettings}
          />
        </div>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Commencez une conversation
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Posez une question ou demandez de l'aide à Claude
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-700 rounded-lg text-sm text-blue-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Vérification orthographique automatique</span>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : message.isError
                    ? 'bg-red-900/50 text-red-200 border border-red-700'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {message.role === 'user' ? (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                        C
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className="text-xs mt-2 opacity-60">
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-gray-800 border border-gray-700 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                    C
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              disabled={isLoading}
              className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de vérification orthographique */}
      {showSpellCheck && (
        <SpellChecker
          text={pendingMessage}
          onConfirm={handleSpellCheckConfirm}
          onCancel={handleSpellCheckCancel}
        />
      )}
    </div>
  );
};

export default Chat;