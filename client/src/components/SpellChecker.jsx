import React, { useState } from 'react';

/**
 * Composant de vérification orthographique OBLIGATOIRE
 * L'utilisateur DOIT corriger les erreurs avant d'envoyer
 */
const SpellChecker = ({ text, onConfirm, onCancel }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [errors, setErrors] = useState([]);

  // Vérification basique côté client (patterns français communs)
  const basicSpellCheck = (text) => {
    const commonErrors = [
      { pattern: /\ba\s+(?:été|est|était)\b/gi, suggestion: 'Confusion a/à ? (a été → a été ✓ / à été ✗)' },
      { pattern: /\bou\s+(?:est|était|sont)\b/gi, suggestion: 'Confusion ou/où ? (ou est → ou est ✓ / où est ?)' },
      { pattern: /\bce\s+(?:était|est|sont)\b/gi, suggestion: 'Confusion ce/se ? (ce était → c\'était)' },
      { pattern: /\bsa\s+(?:été|est)\b/gi, suggestion: 'Confusion sa/ça ? (sa été → ça a été)' },
      { pattern: /\bson\s+(?:est|était)\b/gi, suggestion: 'Confusion son/sont ? (son est → sont)' },
      { pattern: /\b(?:ses|ces)\s+(?:moi|toi|lui)\b/gi, suggestion: 'Confusion ses/ces/c\'est ?' },
      { pattern: /\bpeu\s+(?:être|etre)\b/gi, suggestion: 'Confusion peu être/peut-être ?' },
      { pattern: /\b(?:a|as)\s+faite?\b/gi, suggestion: 'Accord du participe passé ? (a fait/a faite)' },
      { pattern: /\btous\s+les?\s+jours?\b/gi, suggestion: 'Vérifier : tous les jours (correct) / tout les jours (incorrect)' },
    ];

    const detectedErrors = [];
    
    commonErrors.forEach(({ pattern, suggestion }) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          detectedErrors.push({
            text: match,
            suggestion: suggestion,
            type: 'warning'
          });
        });
      }
    });

    // Vérifier les doubles espaces
    if (text.includes('  ')) {
      detectedErrors.push({
        text: 'Doubles espaces',
        suggestion: 'Espaces multiples détectés',
        type: 'minor'
      });
    }

    // Vérifier ponctuation
    if (text.match(/\s[,;]/g)) {
      detectedErrors.push({
        text: 'Espaces avant ponctuation',
        suggestion: 'Pas d\'espace avant , et ;',
        type: 'minor'
      });
    }

    // Vérifier majuscule en début de phrase
    if (text.length > 0 && text[0] === text[0].toLowerCase() && /[a-zàâäéèêëïîôùûüÿæœç]/.test(text[0])) {
      detectedErrors.push({
        text: 'Pas de majuscule',
        suggestion: 'Le texte devrait commencer par une majuscule',
        type: 'minor'
      });
    }

    return detectedErrors;
  };

  const checkSpelling = async () => {
    setIsChecking(true);
    
    // Vérification basique locale
    const localErrors = basicSpellCheck(text);
    
    // Optionnel : Appel à une API externe (LanguageTool gratuit)
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          language: 'fr',
          enabledOnly: 'false'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const apiErrors = data.matches.slice(0, 10).map(match => ({
          text: match.context.text.substring(match.context.offset, match.context.offset + match.context.length),
          suggestion: match.message,
          type: match.rule.issueType === 'misspelling' ? 'error' : 'warning'
        }));
        
        setErrors([...localErrors, ...apiErrors]);
      } else {
        // Si l'API échoue, utiliser seulement les vérifications locales
        setErrors(localErrors);
      }
    } catch (error) {
      console.warn('API LanguageTool non disponible, utilisation vérification locale uniquement');
      setErrors(localErrors);
    }
    
    setIsChecking(false);
  };

  // Lancer la vérification automatiquement
  React.useEffect(() => {
    checkSpelling();
  }, []);

  // Envoyer automatiquement si aucune erreur détectée
  React.useEffect(() => {
    if (!isChecking && errors.length === 0) {
      // Petit délai pour que l'utilisateur voit "Aucune erreur" (optionnel)
      const timer = setTimeout(() => {
        onConfirm();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isChecking, errors, onConfirm]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className={`px-6 py-4 ${errors.length > 0 ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>
          <div className="flex items-center gap-3">
            {errors.length > 0 ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {errors.length > 0 ? '🚫 Correction Obligatoire' : '✅ Vérification Orthographique'}
              </h3>
              <p className="text-sm text-white/80">
                {errors.length > 0 
                  ? 'Veuillez corriger les erreurs avant de continuer' 
                  : 'Votre message est prêt à être envoyé'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {isChecking ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyse en cours...</span>
              </div>
            </div>
          ) : errors.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Aucune erreur détectée</h4>
              <p className="text-gray-400 text-sm">Votre texte est correct, vous pouvez l'envoyer !</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">
                  {errors.length} problème{errors.length > 1 ? 's' : ''} à corriger
                </h4>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-700 rounded-full text-xs text-red-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                  <span>Envoi bloqué</span>
                </div>
              </div>
              
              {errors.map((error, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    error.type === 'error' 
                      ? 'bg-red-900/20 border-red-700' 
                      : error.type === 'warning'
                      ? 'bg-yellow-900/20 border-yellow-700'
                      : 'bg-blue-900/20 border-blue-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {error.type === 'error' ? (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono bg-gray-900/50 px-2 py-1 rounded text-white mb-2">
                        "{error.text}"
                      </p>
                      <p className="text-sm text-gray-300">
                        {error.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Message d'aide */}
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-1">💡 Astuce</p>
                    <p>Cliquez sur "Corriger" pour modifier votre message et corrigez les erreurs signalées. Une fois corrigées, vous pourrez l'envoyer.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            ✏️ Corriger mon message
          </button>
          
          {errors.length === 0 ? (
            <button
              onClick={onConfirm}
              disabled={isChecking}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              ✅ Envoyer le message
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-2 bg-gray-700 text-gray-500 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
              title="Corrigez les erreurs avant d'envoyer"
            >
              🚫 Envoi bloqué
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpellChecker;