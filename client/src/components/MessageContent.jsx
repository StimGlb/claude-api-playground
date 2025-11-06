import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Composant pour afficher le contenu des messages avec formatage Markdown
 */
const MessageContent = ({ content, isUser }) => {
  // Remplacer les espaces avant ponctuation française par des espaces insécables
  const formatFrenchPunctuation = (text) => {
    return text
      .replace(/\s+([?!:;»])/g, '\u00A0$1')  // Espace insécable avant ? ! : ; »
      .replace(/([«])\s+/g, '$1\u00A0');      // Espace insécable après «
  };

  const formattedContent = formatFrenchPunctuation(content);

  return (
    <ReactMarkdown
      components={{
        // Titres
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mb-3 mt-4 text-white" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold mb-2 mt-3 text-white" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-bold mb-2 mt-2 text-white" {...props} />
        ),
        
        // Paragraphes
        p: ({ node, ...props }) => (
          <p className="mb-2 leading-relaxed" {...props} />
        ),
        
        // Listes
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="ml-2" {...props} />
        ),
        
        // Code inline
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          
          return !inline && match ? (
            // Bloc de code avec coloration syntaxique
            <div className="my-3">
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            // Code inline
            <code
              className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                isUser 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-900 text-blue-400'
              }`}
              {...props}
            >
              {children}
            </code>
          );
        },
        
        // Citations
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-blue-500 pl-4 italic my-2 text-gray-300"
            {...props}
          />
        ),
        
        // Liens
        a: ({ node, ...props }) => (
          <a
            className="text-blue-400 hover:text-blue-300 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        
        // Texte en gras
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-white" {...props} />
        ),
        
        // Texte en italique
        em: ({ node, ...props }) => (
          <em className="italic" {...props} />
        ),
        
        // Ligne horizontale
        hr: ({ node, ...props }) => (
          <hr className="my-4 border-gray-600" {...props} />
        ),
        
        // Tableaux
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-3">
            <table className="min-w-full border-collapse border border-gray-600" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-600 px-3 py-2 bg-gray-700 font-bold text-left" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-600 px-3 py-2" {...props} />
        ),
      }}
    >
      {formattedContent}
    </ReactMarkdown>
  );
};

export default MessageContent;