import { useCallback, useRef, useState } from 'react';
import LiveOrb, { OrbState } from './LiveOrb';
import LegbaIcon from './LegbaIcon';
import WebEnvironmentWarning from './WebEnvironmentWarning';
import { useEnvironment, isWebEnvironment } from '../hooks/useEnvironment';

type HistoryItem = {
  question: string;
  answer: string;
  sources: string[];
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{
      isFinal: boolean;
      0: { transcript: string };
      length: number;
    }>;
  }) => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export default function LegbaLiveScreen() {
  const env = useEnvironment();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // IMPORTANT: the Live screen is deliberately passive on mount.
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [history] = useState<HistoryItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [isBluetoothConnected] = useState(false);
  const [showWebWarning, setShowWebWarning] = useState(true);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setOrbState('idle');
  }, []);

  const startListening = useCallback(() => {
    // No microphone access, simulation, API call, or question generation occurs
    // until this handler is explicitly invoked by the user.
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceError(
        "La reconnaissance vocale n'est pas disponible dans ce navigateur."
      );
      return;
    }

    setVoiceError('');
    setCurrentTranscript('');
    setCurrentResponse('');
    setSources([]);
    setOrbState('listening');

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      setIsListening(true);
      setOrbState('listening');
    };

    recognition.onresult = (event) => {
      let transcript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript.trim()) {
        setCurrentTranscript(transcript.trim());
      }

      // Deliberately do NOT call an API or generate a question here.
      // A real final transcript is only displayed; application processing
      // must be triggered by the existing explicit conversation action.
    };

    recognition.onerror = (event) => {
      setVoiceError(
        event.error
          ? `Microphone / reconnaissance vocale : ${event.error}`
          : 'Impossible de démarrer la reconnaissance vocale.'
      );
      setIsListening(false);
      setOrbState('idle');
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
      setOrbState('idle');
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setOrbState('idle');
      setVoiceError("Impossible d'activer le microphone.");
    }
  }, []);

  const clearCurrentConversation = () => {
    stopListening();
    setCurrentTranscript('');
    setCurrentResponse('');
    setSources([]);
    setVoiceError('');
    setOrbState('idle');
  };

  const getStatusText = () => {
    switch (orbState) {
      case 'listening':
        return 'Écoute active';
      case 'processing':
        return 'Recherche dans vos cours...';
      case 'speaking':
        return 'Réponse vocale';
      case 'dictation':
        return 'Mode dictée lente';
      default:
        return 'Veille — en attente de votre voix';
    }
  };

  const getStatusColor = () => {
    switch (orbState) {
      case 'listening':
        return 'text-cyan-neon';
      case 'processing':
      case 'dictation':
        return 'text-metallic-gold';
      case 'speaking':
        return 'text-emerald-400';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-neon/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-metallic-gold/5 blur-[100px]" />
      </div>

      <div className="relative z-10 px-4 pt-2 pb-4">
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                orbState === 'idle'
                  ? 'bg-white/40'
                  : orbState === 'listening'
                    ? 'bg-cyan-neon animate-pulse'
                    : orbState === 'processing'
                      ? 'bg-metallic-gold animate-pulse'
                      : orbState === 'speaking'
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-metallic-gold animate-pulse'
              }`}
            />
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {isBluetoothConnected && !isWebEnvironment(env) && (
            <span className="text-[10px] text-cyan-neon">Casque connecté</span>
          )}
        </div>
      </div>

      {isWebEnvironment(env) && showWebWarning && (
        <div className="relative z-10 px-4 pb-2">
          <WebEnvironmentWarning onDismiss={() => setShowWebWarning(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <div className="mb-8">
          <LiveOrb state={orbState} size={220} />
        </div>

        {!currentTranscript && !currentResponse && (
          <div className="w-full max-w-md text-center">
            <p className="text-sm text-white/70 mb-4">
              Legba Live est en veille. Aucune question ne sera lancée
              automatiquement.
            </p>
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className="w-full glass-button rounded-xl py-3 text-sm font-medium"
            >
              {isListening ? 'Arrêter l’écoute' : '🎙️ Démarrer l’écoute'}
            </button>
          </div>
        )}

        {currentTranscript && (
          <div className="w-full max-w-md mb-4 animate-fade-in">
            <div className="glass-card rounded-2xl px-4 py-3 border border-cyan-neon/20 bg-cyan-neon/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-cyan-neon font-medium">
                  Vous
                </span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                {currentTranscript}
              </p>
            </div>
          </div>
        )}

        {currentResponse && (
          <div className="w-full max-w-md mb-4 animate-fade-in">
            <div className="glass-card rounded-2xl px-4 py-3 border border-metallic-gold/20 bg-metallic-gold/5">
              <div className="flex items-center gap-2 mb-1">
                <LegbaIcon className="w-3 h-3" color="#FFD700" />
                <span className="text-[10px] text-metallic-gold font-medium">
                  Legba Note
                </span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                {currentResponse}
              </p>

              {sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/10">
                  <p className="text-[10px] text-white/50 mb-1.5">
                    Sources :
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sources.map((source, i) => (
                      <span
                        key={`${source}-${i}`}
                        className="text-[10px] bg-cyan-neon/10 text-cyan-neon px-2 py-1 rounded-full border border-cyan-neon/20"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {voiceError && (
          <div className="w-full max-w-md mb-4 glass-card rounded-xl px-4 py-3 border border-red-400/20 bg-red-500/5">
            <p className="text-xs text-red-300">{voiceError}</p>
          </div>
        )}

        {(currentTranscript || currentResponse || voiceError) && (
          <button
            type="button"
            onClick={clearCurrentConversation}
            className="text-[10px] text-white/50 hover:text-white/80"
          >
            Effacer la session
          </button>
        )}
      </div>

      {/* Intentionally empty on first render. No demo/test item is inserted. */}
      {history.length > 0 && (
        <div className="absolute bottom-24 right-4 z-20">
          <div className="glass-card rounded-2xl p-3 border border-white/10 max-w-xs">
            <p className="text-[10px] text-white/50 mb-2 font-medium">
              Historique récent
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.slice(-3).reverse().map((item, i) => (
                <div
                  key={`${item.question}-${i}`}
                  className="glass-card rounded-lg p-2 border border-white/5 bg-white/5"
                >
                  <p className="text-[10px] text-white/70 line-clamp-2">
                    {item.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 px-4 pb-4">
        <div className="glass-card rounded-2xl px-4 py-3 border border-white/10">
          <div className="flex items-center justify-between text-[10px] text-white/50">
            <span>Conversation continue • Mains libres</span>
            <span>SQLite local actif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
