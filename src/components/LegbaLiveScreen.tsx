import { useState, useEffect } from 'react';
import LiveOrb, { OrbState } from './LiveOrb';
import LegbaIcon from './LegbaIcon';
import WebEnvironmentWarning from './WebEnvironmentWarning';
import { useEnvironment, isWebEnvironment } from '../hooks/useEnvironment';

export default function LegbaLiveScreen() {
  const env = useEnvironment();
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{ question: string; answer: string; sources: string[] }>>([]);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(true);
  const [showWebWarning, setShowWebWarning] = useState(true);

  // Simulate continuous listening and conversation flow
  useEffect(() => {
    const conversationFlow = async () => {
      // Start in idle
      await delay(2000);
      
      // Transition to listening (user starts speaking)
      setOrbState('listening');
      await delay(1000);
      
      // Simulate user speaking
      const question = "Quels sont les principes fondamentaux du droit constitutionnel haïtien ?";
      let partialText = '';
      for (let i = 0; i < question.length; i++) {
        partialText += question[i];
        setCurrentTranscript(partialText);
        await delay(50);
      }
      
      await delay(500);
      
      // Transition to processing
      setOrbState('processing');
      await delay(1500);
      
      // Simulate finding sources
      setSources(['Droit Constitutionnel - Chapitre 1', 'Constitution d\'Haïti - Article 1']);
      
      // Transition to speaking
      setOrbState('speaking');
      const response = "Les principes fondamentaux du droit constitutionnel haïtien incluent la souveraineté nationale, la séparation des pouvoirs, et les droits fondamentaux des citoyens tels que garantis par la Constitution de 1987.";
      let responseText = '';
      for (let i = 0; i < response.length; i++) {
        responseText += response[i];
        setCurrentResponse(responseText);
        await delay(30);
      }
      
      await delay(2000);
      
      // Add to history
      setHistory(prev => [...prev, { question, answer: response, sources: ['Droit Constitutionnel - Chapitre 1'] }]);
      
      // Transition to dictation mode (slow repetition)
      setOrbState('dictation');
      await delay(3000);
      
      // Back to listening
      setOrbState('listening');
      setCurrentTranscript('');
      setCurrentResponse('');
      setSources([]);
      
      await delay(2000);
      setOrbState('idle');
    };

    conversationFlow();
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getStatusText = () => {
    switch (orbState) {
      case 'idle':
        return 'En attente...';
      case 'listening':
        return 'Écoute active';
      case 'processing':
        return 'Recherche dans vos cours...';
      case 'speaking':
        return 'Réponse vocale';
      case 'dictation':
        return 'Mode dictée lente';
    }
  };

  const getStatusColor = () => {
    switch (orbState) {
      case 'idle':
        return 'text-white/60';
      case 'listening':
        return 'text-cyan-neon';
      case 'processing':
        return 'text-metallic-gold';
      case 'speaking':
        return 'text-emerald-400';
      case 'dictation':
        return 'text-metallic-gold';
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-neon/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-metallic-gold/5 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Top status bar */}
      <div className="relative z-10 px-4 pt-2 pb-4">
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              orbState === 'idle' ? 'bg-white/40' :
              orbState === 'listening' ? 'bg-cyan-neon animate-pulse' :
              orbState === 'processing' ? 'bg-metallic-gold animate-pulse' :
              orbState === 'speaking' ? 'bg-emerald-400 animate-pulse' :
              'bg-metallic-gold animate-pulse'
            }`} />
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          {isBluetoothConnected && !isWebEnvironment(env) && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
              </svg>
              <span className="text-[10px] text-cyan-neon">Casque connecté</span>
            </div>
          )}
        </div>
      </div>

      {/* Web Environment Warning */}
      {isWebEnvironment(env) && showWebWarning && (
        <div className="relative z-10 px-4 pb-2">
          <WebEnvironmentWarning onDismiss={() => setShowWebWarning(false)} />
        </div>
      )}

      {/* Main orb area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        {/* Live Orb */}
        <div className="mb-8">
          <LiveOrb state={orbState} size={220} />
        </div>

        {/* Transcript area */}
        {currentTranscript && (
          <div className="w-full max-w-md mb-4 animate-fade-in">
            <div className="glass-card rounded-2xl px-4 py-3 border border-cyan-neon/20 bg-cyan-neon/5">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-3 h-3 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                </svg>
                <span className="text-[10px] text-cyan-neon font-medium">Vous</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{currentTranscript}</p>
            </div>
          </div>
        )}

        {/* Response area */}
        {currentResponse && (
          <div className="w-full max-w-md mb-4 animate-fade-in">
            <div className="glass-card rounded-2xl px-4 py-3 border border-metallic-gold/20 bg-metallic-gold/5">
              <div className="flex items-center gap-2 mb-1">
                <LegbaIcon className="w-3 h-3" color="#FFD700" />
                <span className="text-[10px] text-metallic-gold font-medium">Legba Note</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{currentResponse}</p>
              
              {/* Sources */}
              {sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/10">
                  <p className="text-[10px] text-white/50 mb-1.5">Sources :</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sources.map((source, i) => (
                      <span key={i} className="text-[10px] bg-cyan-neon/10 text-cyan-neon px-2 py-1 rounded-full border border-cyan-neon/20">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History sidebar (collapsible) */}
      {history.length > 0 && (
        <div className="absolute bottom-24 right-4 z-20">
          <div className="glass-card rounded-2xl p-3 border border-white/10 max-w-xs">
            <p className="text-[10px] text-white/50 mb-2 font-medium">Historique récent</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.slice(-3).reverse().map((item, i) => (
                <div key={i} className="glass-card rounded-lg p-2 border border-white/5 bg-white/5">
                  <p className="text-[10px] text-white/70 line-clamp-2">{item.question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="relative z-10 px-4 pb-4">
        <div className="glass-card rounded-2xl px-4 py-3 border border-white/10">
          <div className="flex items-center justify-between text-[10px] text-white/50">
            <span>Conversation continue • Mains libres</span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SQLite local actif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
