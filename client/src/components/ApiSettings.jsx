import React, { useState } from 'react';

/**
 * Composant de paramétrage de l'API Claude avec verrouillage
 * Contrôle la température et les max_tokens
 */
const ApiSettings = ({ onSettingsChange, initialSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [temperature, setTemperature] = useState(initialSettings?.temperature || 1.0);
  const [maxTokens, setMaxTokens] = useState(initialSettings?.maxTokens || 1024);
  
  // 🔐 Mot de passe admin (à changer !)
  const ADMIN_PASSWORD = 'j5';
  
  // 🔒 Limites pour usage verrouillé
  const LOCKED_LIMITS = {
    temperature: { min: 0.5, max: 0.8 },
    maxTokens: { min: 512, max: 1280 }
  };

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLocked(false);
      setShowPasswordPrompt(false);
      setPassword('');
    } else {
      alert('❌ Mot de passe incorrect');
      setPassword('');
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    // Réinitialiser aux valeurs sûres
    setTemperature(1.0);
    setMaxTokens(1024);
    onSettingsChange({ temperature: 1.0, maxTokens: 1024 });
  };

  const handleTemperatureChange = (e) => {
    const value = parseFloat(e.target.value);
    setTemperature(value);
    onSettingsChange({ temperature: value, maxTokens });
  };

  const handleMaxTokensChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxTokens(value);
    onSettingsChange({ temperature, maxTokens: value });
  };

  const getTemperatureLimits = () => {
    return isLocked ? LOCKED_LIMITS.temperature : { min: 0, max: 2 };
  };

  const getMaxTokensLimits = () => {
    return isLocked ? LOCKED_LIMITS.maxTokens : { min: 256, max: 4096 };
  };

  return (
    <div className="relative">
      {/* Bouton paramètres avec indicateur de verrouillage */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
        title="Paramètres de l'API"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm font-medium">Paramètres</span>
        {isLocked && (
          <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full">🔒</span>
        )}
      </button>

      {/* Panel de paramètres */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-gray-800 rounded-lg shadow-xl p-6 z-50 border border-gray-700">
          <div className="space-y-6">
            {/* Titre avec statut */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Paramètres API</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {isLocked ? '🔒 Mode limité' : '🔓 Mode administrateur'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Bouton verrouillage/déverrouillage */}
            <div className="pt-2 border-t border-gray-700">
              {isLocked ? (
                <button
                  onClick={() => setShowPasswordPrompt(true)}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  🔓 Déverrouiller les paramètres avancés
                </button>
              ) : (
                <button
                  onClick={handleLock}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  🔒 Verrouiller les paramètres
                </button>
              )}
            </div>

            {/* Prompt mot de passe */}
            {showPasswordPrompt && (
              <div className="p-4 bg-gray-900 rounded-lg border border-yellow-500">
                <label className="block text-sm font-medium text-white mb-2">
                  Mot de passe administrateur
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="Entrez le mot de passe"
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-yellow-500 focus:outline-none text-sm"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleUnlock}
                    className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPassword('');
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Température */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Température
                </label>
                <span className="text-sm font-mono bg-gray-900 px-2 py-1 rounded text-blue-400">
                  {temperature.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={getTemperatureLimits().min}
                max={getTemperatureLimits().max}
                step="0.1"
                value={temperature}
                onChange={handleTemperatureChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{getTemperatureLimits().min} (Précis)</span>
                <span>{((getTemperatureLimits().min + getTemperatureLimits().max) / 2).toFixed(1)} (Équilibré)</span>
                <span>{getTemperatureLimits().max} (Créatif)</span>
              </div>
              {isLocked && (
                <p className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
                  ⚠️ Limité à {LOCKED_LIMITS.temperature.min} - {LOCKED_LIMITS.temperature.max} en mode verrouillé
                </p>
              )}
              <p className="text-xs text-gray-400 leading-relaxed">
                Contrôle la créativité. Des valeurs basses donnent des réponses plus déterministes.
              </p>
            </div>

            {/* Max Tokens */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Max Tokens
                </label>
                <span className="text-sm font-mono bg-gray-900 px-2 py-1 rounded text-blue-400">
                  {maxTokens}
                </span>
              </div>
              <input
                type="range"
                min={getMaxTokensLimits().min}
                max={getMaxTokensLimits().max}
                step="256"
                value={maxTokens}
                onChange={handleMaxTokensChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{getMaxTokensLimits().min}</span>
                <span>{Math.floor((getMaxTokensLimits().min + getMaxTokensLimits().max) / 2)}</span>
                <span>{getMaxTokensLimits().max}</span>
              </div>
              {isLocked && (
                <p className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded">
                  ⚠️ Limité à {LOCKED_LIMITS.maxTokens.min} - {LOCKED_LIMITS.maxTokens.max} tokens en mode verrouillé
                </p>
              )}
              <p className="text-xs text-gray-400 leading-relaxed">
                Limite la longueur de la réponse. Plus élevé = plus de texte généré.
              </p>
            </div>

            {/* Presets rapides (seulement si déverrouillé) */}
            {!isLocked && (
              <div className="pt-4 border-t border-gray-700">
                <p className="text-xs font-medium text-gray-400 mb-3">Presets rapides</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setTemperature(0.3);
                      setMaxTokens(1024);
                      onSettingsChange({ temperature: 0.3, maxTokens: 1024 });
                    }}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
                  >
                    🎯 Précis
                  </button>
                  <button
                    onClick={() => {
                      setTemperature(1.0);
                      setMaxTokens(2048);
                      onSettingsChange({ temperature: 1.0, maxTokens: 2048 });
                    }}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
                  >
                    ⚖️ Équilibré
                  </button>
                  <button
                    onClick={() => {
                      setTemperature(1.5);
                      setMaxTokens(3072);
                      onSettingsChange({ temperature: 1.5, maxTokens: 3072 });
                    }}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
                  >
                    🎨 Créatif
                  </button>
                  <button
                    onClick={() => {
                      setTemperature(0.7);
                      setMaxTokens(4096);
                      onSettingsChange({ temperature: 0.7, maxTokens: 4096 });
                    }}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white transition-colors"
                  >
                    📝 Long
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiSettings;