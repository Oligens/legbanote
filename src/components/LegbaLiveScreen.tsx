import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LiveOrb, { OrbState } from './LiveOrb';
import LegbaIcon from './LegbaIcon';
import WebEnvironmentWarning from './WebEnvironmentWarning';
import { useEnvironment, isWebEnvironment } from '../hooks/useEnvironment';
import { loadHistory, saveHistory, type StoredCourse, type StoredHistoryItem } from '../lib/storage';
import { retrieveRelevantChunks, type RagChunk } from '../lib/rag';
import { loadVoiceSettings } from '../lib/voice';

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{ isFinal: boolean; 0: { transcript: string }; length: number }>;
  }) => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

interface LegbaLiveScreenProps {
  courses: StoredCourse[];
}

export default function LegbaLiveScreen({ courses }: LegbaLiveScreenProps) {
  const env = useEnvironment();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const silenceTimerRef = useRef<number | null>(null);
  const activeRef = useRef(true);
  const processingRef = useRef(false);
  const ttsRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [history, setHistory] = useState<StoredHistoryItem[]>(() => loadHistory());
  const [voiceError, setVoiceError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showWebWarning, setShowWebWarning] = useState(true);
  const voiceSettings = useMemo(() => loadVoiceSettings(), []);

  useEffect(() => saveHistory(history), [history]);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = voiceSettings.speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    ttsRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const processQuestion = useCallback(async (questionOverride?: string) => {
    const question = (questionOverride ?? finalTranscriptRef.current).trim();
    if (!question || processingRef.current) return;

    processingRef.current = true;
    stopListening();
    setOrbState('processing');
    setVoiceError('');
    setCurrentResponse('');

    try {
      const context: RagChunk[] = retrieveRelevantChunks(courses, question, 6);
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Gemini n’a pas pu répondre.');

      const answer = String(data.answer || '').trim();
      if (!answer) throw new Error('Gemini a retourné une réponse vide.');

      setCurrentResponse(answer);
      setSources(Array.isArray(data.sources) ? data.sources : []);
      setHistory((items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          question,
          answer,
          sources: Array.isArray(data.sources) ? data.sources : [],
          createdAt: new Date().toISOString(),
        },
      ]);
      speak(answer);
    } catch (error) {
      setVoiceError(error instanceof Error ? error.message : 'Erreur pendant la réponse Gemini.');
    } finally {
      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      setTextInput('');
      processingRef.current = false;
      setOrbState('idle');

      if (activeRef.current && !('speechSynthesis' in window && window.speechSynthesis.speaking)) {
        window.setTimeout(() => {
          if (activeRef.current) startRecognition();
        }, 250);
      }
    }
  }, [courses, speak, stopListening, voiceSettings.speechRate]);

  const scheduleSilenceProcessing = useCallback(() => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = window.setTimeout(() => {
      silenceTimerRef.current = null;
      if (finalTranscriptRef.current.trim() && !processingRef.current) {
        void processQuestion();
      }
    }, voiceSettings.silenceMs);
  }, [processQuestion]);

  const startRecognition = useCallback(async () => {
    if (!activeRef.current || processingRef.current || recognitionRef.current) return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError('La reconnaissance vocale Web Speech API n’est pas disponible dans ce navigateur.');
      return;
    }

    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: voiceSettings.echoCancellation,
            noiseSuppression: voiceSettings.noiseSuppression,
            autoGainControl: voiceSettings.autoGainControl,
            channelCount: 1,
          },
        });
      }

      const recognition = new Recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = 'fr-FR';

      recognition.onstart = () => {
        setIsListening(true);
        setOrbState('listening');
      };

      recognition.onresult = (event) => {
        let finalText = finalTranscriptRef.current;
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal) finalText += result[0].transcript + ' ';
          else interimText += result[0].transcript;
        }

        finalTranscriptRef.current = finalText.trim();
        interimTranscriptRef.current = interimText.trim();

        const visible = [finalTranscriptRef.current, interimTranscriptRef.current].filter(Boolean).join(' ');
        if (visible) {
          setCurrentTranscript(visible);
          scheduleSilenceProcessing();
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Accès microphone refusé. Autorisez le microphone pour utiliser le mode mains libres.');
        } else if (event.error !== 'aborted') {
          setVoiceError(`Reconnaissance vocale : ${event.error || 'erreur inconnue'}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        setIsListening(false);
        if (activeRef.current && !processingRef.current && finalTranscriptRef.current.trim()) {
          void processQuestion();
        } else if (activeRef.current && !processingRef.current) {
          window.setTimeout(() => {
            if (activeRef.current) startRecognition();
          }, 150);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      setVoiceError(error instanceof Error ? error.message : 'Impossible d’activer le microphone.');
      setIsListening(false);
    }
  }, [processQuestion, scheduleSilenceProcessing, voiceSettings]);

  useEffect(() => {
    activeRef.current = true;
    void startRecognition();

    return () => {
      activeRef.current = false;
      if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      window.speechSynthesis?.cancel();
    };
  }, [startRecognition]);

  useEffect(() => {
    if (!textInput.trim()) return;
    const timer = window.setTimeout(() => {
      if (!processingRef.current) void processQuestion(textInput.trim());
    }, SILENCE_MS);
    return () => window.clearTimeout(timer);
  }, [textInput, processQuestion, voiceSettings.silenceMs]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-neon/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-metallic-gold/5 blur-[100px]" />
      </div>

      <div className="relative z-10 px-4 pt-2 pb-4">
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between border border-white/10">
          <span className="text-xs font-medium text-cyan-neon">
            {orbState === 'processing' ? 'Gemini + RAG en traitement…' : isListening ? 'Écoute mains libres' : 'Veille vocale'}
          </span>
          <span className="text-[10px] text-white/40">{courses.reduce((sum, c) => sum + c.documents.length, 0)} documents locaux</span>
        </div>
      </div>

      {isWebEnvironment(env) && showWebWarning && (
        <div className="relative z-10 px-4 pb-2">
          <WebEnvironmentWarning onDismiss={() => setShowWebWarning(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 overflow-y-auto">
        <div className="mb-6"><LiveOrb state={orbState} size={220} /></div>

        <div className="w-full max-w-md space-y-3">
          <div className="glass-card rounded-2xl px-4 py-3 border border-white/10">
            <p className="text-[10px] text-white/40 mb-1">Transcription</p>
            <p className="text-sm text-white/90 min-h-6">{currentTranscript || 'Parlez normalement. Le traitement démarre après un court silence.'}</p>
          </div>

          <input
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
            placeholder="Ou écrivez votre question…"
            className="w-full glass-input rounded-xl px-4 py-3 text-sm"
            aria-label="Question textuelle"
          />

          {currentResponse && (
            <div className="glass-card rounded-2xl px-4 py-3 border border-metallic-gold/20 bg-metallic-gold/5">
              <div className="flex items-center gap-2 mb-1">
                <LegbaIcon className="w-3 h-3" color="#FFD700" />
                <span className="text-[10px] text-metallic-gold font-medium">Legba Note • Gemini</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{currentResponse}</p>
              {sources.length > 0 && <p className="mt-2 text-[10px] text-cyan-neon">Notes utilisées : {sources.join(', ')}</p>}
            </div>
          )}

          {voiceError && <div className="glass-card rounded-xl px-4 py-3 border border-red-400/20"><p className="text-xs text-red-300">{voiceError}</p></div>}

          {history.length > 0 && (
            <div className="glass-card rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-white/40 mb-2">Historique persistant</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {history.slice(-5).reverse().map((item) => (
                  <div key={item.id} className="text-[10px] text-white/70">
                    <span className="text-cyan-neon">Vous :</span> {item.question}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4">
        <div className="glass-card rounded-2xl px-4 py-3 border border-white/10 text-[10px] text-white/40 text-center">
          Mode mains libres • détection de silence • RAG local • Gemini • TTS
        </div>
      </div>
    </div>
  );
}
