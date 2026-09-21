import { useState, useEffect } from 'react';
import LegbaIcon from './LegbaIcon';

type AIState = 'idle' | 'listening' | 'searching' | 'responding' | 'complete';

export default function ChatScreen() {
  const [state, setState] = useState<AIState>('idle');
  const [question, setQuestion] = useState('');
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (state === 'listening') {
      timeout = setTimeout(() => {
        setQuestion('Quels sont les facteurs déterminants de la croissance économique selon le Chapitre 4 ?');
        setState('searching');
      }, 2500);
    } else if (state === 'searching') {
      timeout = setTimeout(() => setState('responding'), 2000);
    } else if (state === 'responding') {
      timeout = setTimeout(() => {
        setState('complete');
        setShowResponse(true);
      }, 2500);
    }

    return () => clearTimeout(timeout);
  }, [state]);

  const handleMicPress = () => {
    if (state !== 'idle' && state !== 'complete') return;
    setShowResponse(false);
    setQuestion('');
    setState('listening');
  };

  const handleReset = () => {
    setState('idle');
    setShowResponse(false);
    setQuestion('');
  };

  return (
    <div className="h-full flex flex-col px-4">
      {/* State Indicator */}
      <div className="glass-card rounded-2xl p-3 mb-4 flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${
          state === 'idle' ? 'bg-gray-400' :
          state === 'listening' ? 'bg-red-500 animate-pulse' :
          state === 'searching' ? 'bg-cyan-neon animate-pulse' :
          state === 'responding' ? 'bg-metallic-gold animate-pulse' :
          'bg-emerald-500'
        }`}></div>
        <span className="text-xs text-text-secondary flex-1">
          {state === 'idle' && 'Prêt à vous aider'}
          {state === 'listening' && 'Écoute en cours...'}
          {state === 'searching' && 'Recherche dans vos cours...'}
          {state === 'responding' && 'Génération par Gemini...'}
          {state === 'complete' && 'Réponse générée'}
        </span>
        {showResponse && (
          <button onClick={handleReset} className="text-[10px] text-cyan-neon font-medium bg-cyan-neon/10 px-2 py-1 rounded-full border border-cyan-neon/20">
            Nouvelle
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto mb-4">
        {/* Idle State */}
        {state === 'idle' && !showResponse && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center mb-4 animate-float">
              <LegbaIcon className="w-12 h-12" color="#00FFFF" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Bonjour, Étudiant</h3>
            <p className="text-xs text-text-muted max-w-[250px] mb-6">
              Posez une question vocale ou écrite. Legba Note puisera dans vos cours pour vous répondre.
            </p>
            
            {/* Quick Suggestions */}
            <div className="w-full space-y-2">
              {[
                'Explique le modèle de Solow',
                'Résume le chapitre 3 de Droit',
                'Causes de la Révolution Haïtienne ?',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => { setQuestion(suggestion); setShowResponse(true); setState('complete'); }}
                  className="w-full glass-card glass-card-hover rounded-xl px-4 py-3 text-left text-xs text-text-secondary border border-white/10 hover:border-cyan-neon/30 transition-all"
                >
                  💡 {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Listening State */}
        {state === 'listening' && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 w-28 h-28 rounded-full bg-cyan-neon/10 animate-pulse-glow"></div>
              <div className="relative w-20 h-20 rounded-full glass-card flex items-center justify-center border border-cyan-neon/30">
                <svg className="w-10 h-10 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
            </div>
            <p className="mt-8 text-sm font-medium text-cyan-neon">Écoute en cours...</p>
            <p className="text-xs text-text-muted mt-1">Parlez maintenant</p>
            <div className="flex items-center gap-1 mt-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-1 bg-cyan-neon/60 rounded-full animate-wave" style={{animationDelay: `${i * 0.15}s`}}></div>
              ))}
            </div>
          </div>
        )}

        {/* Searching State */}
        {state === 'searching' && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="glass-card rounded-2xl px-4 py-3 mb-6 max-w-[90%] border border-cyan-neon/20">
              <p className="text-[10px] text-text-muted mb-1">Votre question :</p>
              <p className="text-xs text-white">{question}</p>
            </div>
            
            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center animate-spin-slow border border-cyan-neon/30">
              <svg className="w-8 h-8 text-cyan-neon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="mt-6 text-sm font-medium text-cyan-neon">Recherche dans mes documents...</p>
            <p className="text-xs text-text-muted mt-1">Analyse de vos cours</p>
            
            <div className="flex items-center gap-2 mt-4">
              {['Économie', 'Chap.4', 'PIB'].map((doc, i) => (
                <span key={i} className="text-[10px] bg-cyan-neon/10 text-cyan-neon px-2 py-1 rounded-full border border-cyan-neon/20 animate-pulse" style={{animationDelay: `${i * 300}ms`}}>
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Responding State */}
        {state === 'responding' && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center animate-pulse-glow border border-metallic-gold/30">
                <LegbaIcon className="w-10 h-10" color="#FFD700" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-neon to-metallic-gold flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-metallic-gold">Rédaction par Legba Note...</p>
            <p className="text-xs text-text-muted mt-1">Synthèse en cours</p>
            
            <div className="flex items-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-metallic-gold/60 animate-bounce" style={{animationDelay: `${i * 200}ms`}}></div>
              ))}
            </div>
          </div>
        )}

        {/* Complete State - Response */}
        {showResponse && (
          <div className="animate-fade-in-up space-y-4">
            {/* Question */}
            <div className="glass-card rounded-2xl rounded-tr-md px-4 py-3 border border-cyan-neon/20">
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-3 h-3 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                </svg>
                <span className="text-[10px] font-medium text-cyan-neon">Vous</span>
              </div>
              <p className="text-xs text-white">{question}</p>
            </div>

            {/* AI Response */}
            <div className="glass-card rounded-2xl rounded-tl-md px-4 py-4 border border-metallic-gold/20 bg-gradient-to-br from-metallic-gold/5 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-metallic-gold/20 flex items-center justify-center">
                  <LegbaIcon className="w-3 h-3" color="#FFD700" />
                </div>
                <span className="text-[10px] font-medium text-metallic-gold">Legba Note IA</span>
              </div>
              
              <div className="text-xs text-text-secondary leading-relaxed space-y-3">
                <p>
                  Selon le <strong className="text-white">Chapitre 4 - Économie Globale</strong> de votre cours, les facteurs déterminants incluent :
                </p>
                
                <div className="glass-card rounded-xl p-3 space-y-2 border border-white/10">
                  {[
                    { num: '1', text: 'L\'accumulation du capital physique', detail: 'Investissements en infrastructures' },
                    { num: '2', text: 'Le capital humain', detail: 'Éducation et formation' },
                    { num: '3', text: 'Le progrès technologique', detail: 'Innovation et transfert' },
                    { num: '4', text: 'Les institutions', detail: 'Gouvernance et stabilité' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-neon/20 text-cyan-neon text-[10px] font-bold flex items-center justify-center flex-shrink-0">{item.num}</span>
                      <div>
                        <p className="text-xs text-white font-medium">{item.text}</p>
                        <p className="text-[10px] text-text-muted">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-[10px] text-text-muted mb-2 font-medium">📚 Sources :</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-cyan-neon/10 text-cyan-neon px-2 py-1 rounded-full border border-cyan-neon/20">Chapitre 4 - Économie</span>
                  <span className="text-[10px] bg-cyan-neon/10 text-cyan-neon px-2 py-1 rounded-full border border-cyan-neon/20">Section 4.2 - Solow</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 glass-button rounded-xl py-2.5 text-xs font-medium flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Sauvegarder
              </button>
              <button className="flex-1 glass-button-gold rounded-xl py-2.5 text-xs font-medium flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Approfondir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input */}
      <div className="pb-2">
        <div className="flex flex-col items-center">
          <button
            onClick={handleMicPress}
            disabled={state !== 'idle' && state !== 'complete'}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              state === 'idle' || state === 'complete'
                ? 'glass-button shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95'
                : 'glass-card cursor-not-allowed opacity-50'
            }`}
          >
            <svg className="w-7 h-7 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          <span className="text-[10px] text-text-muted mt-2">
            {state === 'idle' || state === 'complete' ? 'Appuyez pour parler' : 'Traitement...'}
          </span>
        </div>
      </div>
    </div>
  );
}
