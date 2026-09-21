import { useState, useEffect } from 'react';
import LegbaIcon from './LegbaIcon';

type AIState = 'idle' | 'listening' | 'searching' | 'responding';

export default function ConversationScreen() {
  const [state, setState] = useState<AIState>('idle');
  const [showResponse, setShowResponse] = useState(false);
  const [inputMode, setInputMode] = useState<'voice' | 'keyboard'>('voice');
  const [questionText, setQuestionText] = useState('');

  // Simulate state transitions
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (state === 'listening') {
      timeout = setTimeout(() => {
        setQuestionText('Quels sont les facteurs déterminants de la croissance économique dans les pays en développement selon le Chapitre 4 ?');
        setState('searching');
      }, 3000);
    } else if (state === 'searching') {
      timeout = setTimeout(() => {
        setState('responding');
      }, 2500);
    } else if (state === 'responding') {
      timeout = setTimeout(() => {
        setShowResponse(true);
        setState('idle');
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [state]);

  const handleMicPress = () => {
    if (state !== 'idle') return;
    setShowResponse(false);
    setQuestionText('');
    setState('listening');
  };

  const handleReset = () => {
    setState('idle');
    setShowResponse(false);
    setQuestionText('');
  };

  return (
    <div className="h-full flex flex-col bg-sand-light">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 bg-white/80 backdrop-blur-sm border-b border-sand-dark/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
              <LegbaIcon className="w-5 h-5" color="#3D1E6D" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Legba Note IA</h2>
              <p className="text-[10px] text-gray-400">
                {state === 'idle' && !showResponse && 'Prêt à vous aider'}
                {state === 'listening' && 'Écoute en cours...'}
                {state === 'searching' && 'Recherche dans vos documents...'}
                {state === 'responding' && 'Rédaction de la réponse...'}
                {showResponse && 'Réponse générée'}
              </p>
            </div>
          </div>
          {showResponse && (
            <button onClick={handleReset} className="text-xs text-indigo font-medium bg-indigo/10 px-3 py-1.5 rounded-full">
              Nouvelle question
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* State: Listening */}
        {state === 'listening' && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-indigo/10 animate-pulse-ring"></div>
              <div className="absolute inset-2 w-20 h-20 rounded-full bg-indigo/20 animate-pulse-ring" style={{animationDelay: '0.5s'}}></div>
              {/* Center mic icon */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo to-indigo-light flex items-center justify-center shadow-lg shadow-indigo/30">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
            </div>
            <p className="mt-8 text-sm font-medium text-indigo">Écoute en cours...</p>
            <p className="text-xs text-gray-400 mt-1">Parlez maintenant</p>
            {/* Wave animation */}
            <div className="flex items-center gap-1 mt-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo/60 rounded-full animate-wave"
                  style={{ animationDelay: `${i * 0.15}s`, height: '8px' }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* State: Searching */}
        {state === 'searching' && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
            {/* Question text */}
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-sand-dark/10 mb-8 max-w-[90%]">
              <p className="text-xs text-gray-500 mb-1">Votre question :</p>
              <p className="text-sm text-gray-800">{questionText}</p>
            </div>
            
            {/* Searching animation */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-caribbean/10 flex items-center justify-center animate-breathe">
                <svg className="w-8 h-8 text-caribbean animate-spin-slow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-caribbean">Recherche dans mes documents...</p>
            <p className="text-xs text-gray-400 mt-1">Analyse de vos cours</p>
            
            {/* Document indicators */}
            <div className="flex items-center gap-2 mt-4">
              {['Économie', 'Chap.4', 'PIB'].map((doc, i) => (
                <span key={i} className="text-[10px] bg-caribbean/10 text-caribbean px-2 py-1 rounded-full animate-pulse" style={{animationDelay: `${i * 300}ms`}}>
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* State: Responding */}
        {state === 'responding' && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
            {/* AI Avatar animating */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo to-indigo-light flex items-center justify-center animate-breathe shadow-xl shadow-indigo/20">
                <LegbaIcon className="w-10 h-10" color="white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sun flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-indigo">Rédaction par Legba Note...</p>
            <p className="text-xs text-gray-400 mt-1">Synthèse en cours</p>
            
            {/* Loading dots */}
            <div className="flex items-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo/60 animate-bounce"
                  style={{ animationDelay: `${i * 200}ms` }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* State: Response Displayed */}
        {showResponse && (
          <div className="animate-fade-in-up space-y-4">
            {/* Question bubble */}
            <div className="bg-indigo/5 rounded-2xl rounded-tr-md px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-3 h-3 text-indigo" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                </svg>
                <span className="text-[10px] font-medium text-indigo">Vous</span>
              </div>
              <p className="text-sm text-gray-800">{questionText}</p>
            </div>

            {/* AI Response */}
            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-4 shadow-sm border border-sand-dark/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-indigo/10 flex items-center justify-center">
                  <LegbaIcon className="w-3 h-3" color="#3D1E6D" />
                </div>
                <span className="text-[10px] font-medium text-indigo">Legba Note IA</span>
              </div>
              
              <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                <p>
                  Selon le <strong>Chapitre 4 - Économie Globale</strong> de votre cours, les facteurs déterminants de la croissance économique dans les pays en développement incluent :
                </p>
                
                <div className="bg-sand/50 rounded-xl p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-caribbean/10 text-caribbean text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <p className="text-xs"><strong>L'accumulation du capital physique</strong> — Investissements en infrastructures et équipements productifs.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-caribbean/10 text-caribbean text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <p className="text-xs"><strong>Le capital humain</strong> — Éducation, formation et santé de la main-d'œuvre.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-caribbean/10 text-caribbean text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <p className="text-xs"><strong>Le progrès technologique</strong> — Innovation et transfert de technologie.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-caribbean/10 text-caribbean text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <p className="text-xs"><strong>Les institutions</strong> — Qualité de la gouvernance et stabilité politique.</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic">
                  Le modèle de Solow-Swan présenté en section 4.2 met l'accent sur la convergence conditionnelle entre pays développés et en développement.
                </p>
              </div>

              {/* Sources */}
              <div className="mt-4 pt-3 border-t border-sand-dark/20">
                <p className="text-[10px] text-gray-400 mb-2 font-medium">📚 Sources :</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-caribbean/10 text-caribbean px-2 py-1 rounded-full">Chapitre 4 - Économie Globale</span>
                  <span className="text-[10px] bg-caribbean/10 text-caribbean px-2 py-1 rounded-full">Section 4.2 - Modèle de Solow</span>
                  <span className="text-[10px] bg-caribbean/10 text-caribbean px-2 py-1 rounded-full">PDF: Macro_2024.pdf</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button className="flex-1 text-xs bg-indigo/10 text-indigo font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Sauvegarder
              </button>
              <button className="flex-1 text-xs bg-sun/10 text-sun-dark font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Approfondir
              </button>
            </div>
          </div>
        )}

        {/* Idle state - Welcome */}
        {state === 'idle' && !showResponse && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo/20 to-caribbean/20 flex items-center justify-center mb-4 animate-float">
              <LegbaIcon className="w-10 h-10" color="#3D1E6D" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Bonjour, Étudiant</h3>
            <p className="text-xs text-gray-400 text-center max-w-[250px]">
              Posez une question vocale ou écrite. Legba Note puisera dans vos cours pour vous répondre.
            </p>
            
            {/* Quick suggestions */}
            <div className="mt-6 w-full space-y-2">
              <p className="text-[10px] text-gray-400 text-center mb-2">Suggestions rapides :</p>
              {[
                'Explique le modèle de Solow',
                'Résume le chapitre 3 de Droit',
                'Quelles sont les causes de la Révolution Haïtienne ?',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuestionText(suggestion);
                    setShowResponse(true);
                  }}
                  className="w-full text-left text-xs bg-white rounded-xl px-4 py-2.5 border border-sand-dark/15 text-gray-600 hover:bg-indigo/5 hover:border-indigo/20 transition-colors"
                >
                  💡 {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className="px-5 pb-4 pt-2 bg-white/80 backdrop-blur-sm border-t border-sand-dark/10">
        {inputMode === 'keyboard' ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tapez votre question..."
              className="flex-1 bg-sand/50 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 border border-sand-dark/20 focus:outline-none focus:border-indigo/40"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  setQuestionText(e.currentTarget.value);
                  setShowResponse(true);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={() => setInputMode('voice')}
              className="w-10 h-10 rounded-full bg-sand/50 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button
              onClick={handleMicPress}
              disabled={state !== 'idle'}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                state === 'idle'
                  ? 'bg-gradient-to-br from-indigo to-indigo-light shadow-lg shadow-indigo/30 hover:scale-105 active:scale-95'
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </button>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-gray-400">
                {state === 'idle' ? 'Appuyez pour parler' : state === 'listening' ? 'Écoute...' : 'Traitement...'}
              </span>
              <button
                onClick={() => setInputMode('keyboard')}
                className="w-7 h-7 rounded-full bg-sand/50 flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
