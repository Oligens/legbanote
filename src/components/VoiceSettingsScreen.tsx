import { useState, useEffect } from 'react';

type PlaybackState = 'idle' | 'reading' | 'repeating' | 'pause' | 'spelling-check';

interface VoiceSettings {
  dictationMode: boolean;
  speechRate: number;
  bluetoothRouting: boolean;
  spellingCheck: boolean;
  repeatCount: number;
  pauseDuration: number;
}

export default function VoiceSettingsScreen() {
  const [settings, setSettings] = useState<VoiceSettings>({
    dictationMode: true,
    speechRate: 0.5,
    bluetoothRouting: true,
    spellingCheck: true,
    repeatCount: 2,
    pauseDuration: 4,
  });

  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [pauseCountdown, setPauseCountdown] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userSpelling, setUserSpelling] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);

  const responseText = "Le produit intérieur brut, ou PIB, représente la valeur totale de tous les biens et services produits dans un pays durant une période donnée. Il est calculé en additionnant la consommation, l'investissement, les dépenses publiques et les exportations nettes.";
  const sentences = responseText.match(/[^.!?]+[.!?]+/g) || [responseText];

  useEffect(() => {
    if (playbackState === 'pause' && pauseCountdown > 0) {
      const timer = setTimeout(() => setPauseCountdown(pauseCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (playbackState === 'pause' && pauseCountdown === 0) {
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setCurrentRepeat(0);
        setPlaybackState('repeating');
      } else {
        setPlaybackState('idle');
      }
    }
  }, [playbackState, pauseCountdown, currentSentenceIndex, sentences.length]);

  useEffect(() => {
    if (playbackState === 'repeating') {
      const timer = setTimeout(() => {
        if (currentRepeat < settings.repeatCount - 1) {
          setCurrentRepeat(currentRepeat + 1);
        } else {
          if (settings.spellingCheck && sentences[currentSentenceIndex].length > 50) {
            setPlaybackState('spelling-check');
          } else {
            setPlaybackState('pause');
            setPauseCountdown(settings.pauseDuration);
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [playbackState, currentRepeat, settings.repeatCount, settings.spellingCheck, currentSentenceIndex, sentences, settings.pauseDuration]);

  const startPlayback = () => {
    setCurrentSentenceIndex(0);
    setCurrentRepeat(0);
    setPlaybackState(settings.dictationMode ? 'repeating' : 'reading');
  };

  const stopPlayback = () => {
    setPlaybackState('idle');
    setCurrentSentenceIndex(0);
    setCurrentRepeat(0);
    setPauseCountdown(0);
  };

  const handleSpellingSubmit = () => {
    setShowCorrection(true);
    setTimeout(() => {
      setShowCorrection(false);
      setUserSpelling('');
      setPlaybackState('pause');
      setPauseCountdown(settings.pauseDuration);
    }, 2000);
  };

  const Toggle = ({ enabled, onChange, activeColor = 'cyan' }: { enabled: boolean; onChange: () => void; activeColor?: string }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled
          ? activeColor === 'cyan' ? 'bg-cyan-neon/30 border border-cyan-neon/50' : 'bg-metallic-gold/30 border border-metallic-gold/50'
          : 'bg-white/10 border border-white/20'
      }`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
        enabled
          ? activeColor === 'cyan' ? 'bg-cyan-neon translate-x-6 shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-metallic-gold translate-x-6 shadow-[0_0_10px_rgba(255,215,0,0.5)]'
          : 'bg-white/50 translate-x-0.5'
      }`}></div>
    </button>
  );

  return (
    <div className="h-full overflow-y-auto px-4 pb-4">
      {/* Header Card */}
      <div className="glass-card rounded-2xl p-4 mb-4 bg-gradient-to-r from-cyan-neon/10 to-metallic-gold/5 border border-cyan-neon/20 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-neon/10 flex items-center justify-center border border-cyan-neon/20">
            <svg className="w-6 h-6 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Configuration Vocale</h3>
            <p className="text-[10px] text-text-muted">Dictée automatique & mains libres</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3 mb-5 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        {/* Dictation Mode */}
        <div className="glass-card rounded-xl p-4 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-neon/10 flex items-center justify-center border border-cyan-neon/20">
              <svg className="w-4 h-4 text-cyan-neon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Mode Dictée Lente</p>
              <p className="text-[10px] text-text-muted">Lecture posée pour prise de notes</p>
            </div>
          </div>
          <Toggle enabled={settings.dictationMode} onChange={() => setSettings({...settings, dictationMode: !settings.dictationMode})} />
        </div>

        {/* Speech Rate */}
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-neon/10 flex items-center justify-center border border-cyan-neon/20">
                <svg className="w-4 h-4 text-cyan-neon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-white">Vitesse de Lecture</p>
                <p className="text-[10px] text-cyan-neon font-mono">{settings.speechRate.toFixed(1)}x</p>
              </div>
            </div>
          </div>
          <input
            type="range"
            min="0.3"
            max="1.5"
            step="0.1"
            value={settings.speechRate}
            onChange={(e) => setSettings({...settings, speechRate: parseFloat(e.target.value)})}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
          />
          <div className="flex justify-between text-[9px] text-text-muted mt-1">
            <span>Très lent</span>
            <span>Normal</span>
            <span>Rapide</span>
          </div>
        </div>

        {/* Bluetooth */}
        <div className="glass-card rounded-xl p-4 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-neon/10 flex items-center justify-center border border-cyan-neon/20">
              <svg className="w-4 h-4 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Routage Bluetooth</p>
              <p className="text-[10px] text-text-muted">Audio vers casque connecté</p>
            </div>
          </div>
          <Toggle enabled={settings.bluetoothRouting} onChange={() => setSettings({...settings, bluetoothRouting: !settings.bluetoothRouting})} />
        </div>

        {/* Spelling Check */}
        <div className="glass-card rounded-xl p-4 flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-metallic-gold/10 flex items-center justify-center border border-metallic-gold/20">
              <svg className="w-4 h-4 text-metallic-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Vérification Orthographique</p>
              <p className="text-[10px] text-text-muted">Correction guidée après dictée</p>
            </div>
          </div>
          <Toggle enabled={settings.spellingCheck} onChange={() => setSettings({...settings, spellingCheck: !settings.spellingCheck})} activeColor="gold" />
        </div>

        {/* Repeat Count */}
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <p className="text-xs font-medium text-white mb-3">Nombre de Répétitions</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setSettings({...settings, repeatCount: count})}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  settings.repeatCount === count
                    ? 'bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                    : 'bg-white/5 text-text-muted border border-white/10 hover:border-cyan-neon/20'
                }`}
              >
                {count}x
              </button>
            ))}
          </div>
        </div>

        {/* Pause Duration */}
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-white">Durée de Pause</p>
            <span className="text-xs font-mono text-cyan-neon">{settings.pauseDuration}s</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={settings.pauseDuration}
            onChange={(e) => setSettings({...settings, pauseDuration: parseInt(e.target.value)})}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
          />
        </div>
      </div>

      {/* Playback Simulation */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <h4 className="text-xs font-semibold text-white mb-3">Dictée Automatique (Sans Bouton)</h4>
        
        {/* Response Text */}
        <div className="glass-card rounded-xl p-3 mb-4 border border-white/10 bg-white/5">
          <p className="text-[10px] text-text-muted mb-2">Réponse Gemini :</p>
          <div className="text-xs text-text-secondary leading-relaxed">
            {sentences.map((sentence, i) => (
              <span
                key={i}
                className={`transition-all duration-300 ${
                  i === currentSentenceIndex && playbackState !== 'idle'
                    ? 'bg-cyan-neon/20 px-1 rounded text-white font-medium'
                    : i < currentSentenceIndex
                    ? 'text-text-muted'
                    : ''
                }`}
              >
                {sentence}
              </span>
            ))}
          </div>
        </div>

        {/* Status Indicator - No buttons, fully automatic */}
        <div className="flex items-center justify-center mb-3">
          <div className="glass-card rounded-full px-4 py-2 border border-cyan-neon/20 bg-cyan-neon/5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                playbackState === 'idle' ? 'bg-white/40' :
                playbackState === 'reading' ? 'bg-cyan-neon animate-pulse' :
                playbackState === 'repeating' ? 'bg-metallic-gold animate-pulse' :
                playbackState === 'pause' ? 'bg-white/60' :
                'bg-metallic-gold animate-pulse'
              }`} />
              <span className="text-[10px] text-white/70">
                {playbackState === 'idle' && 'En attente'}
                {playbackState === 'reading' && 'Lecture automatique'}
                {playbackState === 'repeating' && 'Répétition'}
                {playbackState === 'pause' && 'Pause'}
                {playbackState === 'spelling-check' && 'Vérification'}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        {playbackState !== 'idle' && (
          <div className="glass-card rounded-xl p-3 border border-cyan-neon/20 bg-cyan-neon/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium text-cyan-neon">
                {playbackState === 'reading' && '🔊 Lecture...'}
                {playbackState === 'repeating' && `🔁 Répétition ${currentRepeat + 1}/${settings.repeatCount}`}
                {playbackState === 'pause' && `⏸️ Pause (${pauseCountdown}s)`}
                {playbackState === 'spelling-check' && '✍️ Vérification'}
              </span>
              <span className="text-[10px] text-text-muted">
                {currentSentenceIndex + 1}/{sentences.length}
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-neon to-metallic-gold transition-all duration-500" style={{width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%`}}></div>
            </div>
            {settings.bluetoothRouting && (
              <div className="flex items-center gap-1.5 mt-2">
                <svg className="w-3 h-3 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29z"/>
                </svg>
                <span className="text-[9px] text-cyan-neon">Casque Bluetooth connecté</span>
              </div>
            )}
          </div>
        )}

        {/* Info note */}
        <div className="mt-4 glass-card rounded-xl p-3 border border-white/10 bg-white/5">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-metallic-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <div>
              <p className="text-[10px] text-white/80 font-medium mb-1">Fonctionnement 100% automatique</p>
              <p className="text-[9px] text-white/60 leading-relaxed">
                Aucun bouton à presser. L'écoute est continue en arrière-plan. Dès que vous parlez, 
                Legba transcrit, recherche dans vos cours, et répond vocalement via le casque Bluetooth.
              </p>
            </div>
          </div>
        </div>

        {/* Spelling Check */}
        {playbackState === 'spelling-check' && (
          <div className="mt-3 glass-card rounded-xl p-3 border border-metallic-gold/20 bg-metallic-gold/5 animate-fade-in-up">
            <p className="text-[10px] font-medium text-metallic-gold mb-2">✍️ Vérifier l'orthographe ?</p>
            {!isListening ? (
              <button
                onClick={() => setIsListening(true)}
                className="w-full glass-button-gold rounded-lg py-2.5 text-xs font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
                Dicter via micro Bluetooth
              </button>
            ) : (
              <div className="space-y-2">
                <div className="glass-card rounded-lg p-2 border border-metallic-gold/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[9px] text-text-muted">Écoute...</span>
                  </div>
                  <input
                    type="text"
                    value={userSpelling}
                    onChange={(e) => setUserSpelling(e.target.value)}
                    placeholder="Dictez votre version..."
                    className="w-full text-xs text-white bg-transparent placeholder-text-muted/50 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSpellingSubmit}
                    disabled={!userSpelling.trim()}
                    className="flex-1 glass-button-gold rounded-lg py-2 text-xs font-medium disabled:opacity-50"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => { setIsListening(false); setUserSpelling(''); }}
                    className="px-3 glass-card rounded-lg py-2 text-xs text-text-secondary border border-white/10"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
            {showCorrection && (
              <div className="mt-2 glass-card rounded-lg p-2 border border-emerald-400/20 bg-emerald-500/5 animate-fade-in">
                <p className="text-[9px] text-emerald-400 font-medium mb-1">✓ Correction :</p>
                <p className="text-[10px] text-text-secondary">
                  Votre version : <span className="text-red-400 line-through">{userSpelling}</span>
                </p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Correct : <span className="text-emerald-400 font-medium">{sentences[currentSentenceIndex].trim()}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
