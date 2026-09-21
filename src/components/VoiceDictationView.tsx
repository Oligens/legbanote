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

export default function VoiceDictationView() {
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

  // Exemple de réponse Gemini
  const responseText = "Le produit intérieur brut, ou PIB, représente la valeur totale de tous les biens et services produits dans un pays durant une période donnée. Il est calculé en additionnant la consommation, l'investissement, les dépenses publiques et les exportations nettes.";
  
  const sentences = responseText.match(/[^.!?]+[.!?]+/g) || [responseText];

  // Simulation du countdown de pause
  useEffect(() => {
    if (playbackState === 'pause' && pauseCountdown > 0) {
      const timer = setTimeout(() => {
        setPauseCountdown(pauseCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (playbackState === 'pause' && pauseCountdown === 0) {
      // Passer à la phrase suivante ou terminer
      if (currentSentenceIndex < sentences.length - 1) {
        setCurrentSentenceIndex(currentSentenceIndex + 1);
        setCurrentRepeat(0);
        setPlaybackState('repeating');
      } else {
        setPlaybackState('idle');
      }
    }
  }, [playbackState, pauseCountdown, currentSentenceIndex, sentences.length]);

  // Simulation de la répétition
  useEffect(() => {
    if (playbackState === 'repeating') {
      const timer = setTimeout(() => {
        if (currentRepeat < settings.repeatCount - 1) {
          setCurrentRepeat(currentRepeat + 1);
        } else {
          // Vérification orthographique si activée
          if (settings.spellingCheck && sentences[currentSentenceIndex].length > 50) {
            setPlaybackState('spelling-check');
          } else {
            setPlaybackState('pause');
            setPauseCountdown(settings.pauseDuration);
          }
        }
      }, 3000); // Simule la durée de lecture d'une phrase
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

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mode Dictée Vocale & Vérification Orthographique</h2>
        <p className="text-gray-500 text-sm">Lecture rythmée via casque Bluetooth avec répétition phrase par phrase et correction interactive</p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Configuration Vocale</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Settings */}
          <div className="space-y-4">
            {/* Dictation Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-sand-light/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Mode Dictée Lente</p>
                  <p className="text-[10px] text-gray-500">Lecture posée pour prise de notes</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({...settings, dictationMode: !settings.dictationMode})}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.dictationMode ? 'bg-indigo' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.dictationMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* Speech Rate Slider */}
            <div className="p-4 bg-sand-light/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Vitesse de Lecture</p>
                <span className="text-xs font-mono text-indigo">{settings.speechRate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => setSettings({...settings, speechRate: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                <span>Très lent</span>
                <span>Normal</span>
                <span>Rapide</span>
              </div>
            </div>

            {/* Bluetooth Routing */}
            <div className="flex items-center justify-between p-4 bg-sand-light/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-caribbean/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-caribbean" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Routage Bluetooth</p>
                  <p className="text-[10px] text-gray-500">Audio vers casque connecté</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({...settings, bluetoothRouting: !settings.bluetoothRouting})}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.bluetoothRouting ? 'bg-caribbean' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.bluetoothRouting ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Right: Repetition Settings */}
          <div className="space-y-4">
            {/* Spelling Check Toggle */}
            <div className="flex items-center justify-between p-4 bg-sand-light/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sun/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sun-dark" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Vérification Orthographique</p>
                  <p className="text-[10px] text-gray-500">Correction guidée après dictée</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({...settings, spellingCheck: !settings.spellingCheck})}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.spellingCheck ? 'bg-sun' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.spellingCheck ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* Repeat Count */}
            <div className="p-4 bg-sand-light/50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-3">Nombre de Répétitions</p>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSettings({...settings, repeatCount: count})}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.repeatCount === count
                        ? 'bg-indigo text-white shadow-md'
                        : 'bg-white text-gray-600 border border-sand-dark/20 hover:border-indigo/30'
                    }`}
                  >
                    {count}x
                  </button>
                ))}
              </div>
            </div>

            {/* Pause Duration */}
            <div className="p-4 bg-sand-light/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Durée de Pause</p>
                <span className="text-xs font-mono text-indigo">{settings.pauseDuration}s</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={settings.pauseDuration}
                onChange={(e) => setSettings({...settings, pauseDuration: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo"
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                <span>2s</span>
                <span>5s</span>
                <span>8s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playback Simulation */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Simulation de Lecture</h3>
        
        {/* Response Text Display */}
        <div className="bg-sand-light/50 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 mb-2">Réponse Gemini :</p>
          <div className="text-sm text-gray-700 leading-relaxed">
            {sentences.map((sentence, i) => (
              <span
                key={i}
                className={`transition-all duration-300 ${
                  i === currentSentenceIndex && playbackState !== 'idle'
                    ? 'bg-indigo/20 px-1 rounded font-medium'
                    : i < currentSentenceIndex
                    ? 'text-gray-400'
                    : ''
                }`}
              >
                {sentence}
              </span>
            ))}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {playbackState === 'idle' ? (
            <button
              onClick={startPlayback}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo to-indigo-light text-white shadow-lg shadow-indigo/30 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              className="w-16 h-16 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z"/>
              </svg>
            </button>
          )}
        </div>

        {/* Status Display */}
        {playbackState !== 'idle' && (
          <div className="bg-indigo/5 rounded-xl p-4 border border-indigo/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo">
                {playbackState === 'reading' && '🔊 Lecture en cours...'}
                {playbackState === 'repeating' && `🔁 Répétition ${currentRepeat + 1}/${settings.repeatCount}`}
                {playbackState === 'pause' && `⏸️ Pause (${pauseCountdown}s)`}
                {playbackState === 'spelling-check' && '✍️ Vérification orthographique'}
              </span>
              <span className="text-[10px] text-gray-500">
                Phrase {currentSentenceIndex + 1}/{sentences.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo transition-all duration-500"
                style={{width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%`}}
              ></div>
            </div>

            {/* Audio routing indicator */}
            {settings.bluetoothRouting && (
              <div className="flex items-center gap-2 mt-3">
                <svg className="w-4 h-4 text-caribbean" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
                </svg>
                <span className="text-[10px] text-caribbean">Audio routé vers casque Bluetooth</span>
              </div>
            )}
          </div>
        )}

        {/* Spelling Check Interface */}
        {playbackState === 'spelling-check' && (
          <div className="mt-4 bg-sun/5 rounded-xl p-4 border border-sun/20 animate-fade-in-up">
            <p className="text-xs font-medium text-sun-dark mb-3">
              ✍️ Voulez-vous épeler ou vérifier l'orthographe de cette notion ?
            </p>
            
            {!isListening ? (
              <div className="space-y-3">
                <button
                  onClick={() => setIsListening(true)}
                  className="w-full py-3 bg-sun text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-sun-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                  Dicter ma version (micro Bluetooth)
                </button>
                <button
                  onClick={() => {
                    setPlaybackState('pause');
                    setPauseCountdown(settings.pauseDuration);
                  }}
                  className="w-full py-2 bg-white text-gray-600 rounded-xl text-sm border border-sand-dark/20 hover:border-gray-300 transition-colors"
                >
                  Passer cette vérification
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3 border border-sun/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] text-gray-500">Écoute en cours via micro Bluetooth...</span>
                  </div>
                  <input
                    type="text"
                    value={userSpelling}
                    onChange={(e) => setUserSpelling(e.target.value)}
                    placeholder="Dictez ou tapez votre version..."
                    className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSpellingSubmit}
                    disabled={!userSpelling.trim()}
                    className="flex-1 py-2 bg-sun text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sun-dark transition-colors"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => {
                      setIsListening(false);
                      setUserSpelling('');
                    }}
                    className="px-4 py-2 bg-white text-gray-600 rounded-xl text-sm border border-sand-dark/20 hover:border-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Correction Display */}
            {showCorrection && (
              <div className="mt-3 bg-white rounded-xl p-3 border border-emerald-200 animate-fade-in-up">
                <p className="text-[10px] text-emerald-600 font-medium mb-1">✓ Correction Gemini :</p>
                <p className="text-xs text-gray-700">
                  Votre version : <span className="text-red-500 line-through">{userSpelling}</span>
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  Version correcte : <span className="text-emerald-600 font-medium">{sentences[currentSentenceIndex].trim()}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Implementation Code */}
      <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">voice_dictation_service.dart</span>
          <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full">Dart</span>
        </div>
        <div className="p-4 bg-gray-950 overflow-x-auto max-h-[500px] overflow-y-auto">
          <pre className="code-block text-gray-300 whitespace-pre">{`import 'package:flutter_tts/flutter_tts.dart';
import 'package:bluetooth/bluetooth.dart';
import 'package:speech_to_text/speech_to_text.dart';

class VoiceDictationService {
  final FlutterTts _tts = FlutterTts();
  final SpeechToText _stt = SpeechToText();
  
  VoiceSettings _settings;
  bool _isBluetoothConnected = false;

  VoiceDictationService(this._settings);

  /// Configurer le moteur TTS pour le mode dictée
  Future<void> configureTTS() async {
    await _tts.setLanguage('fr-FR');
    await _tts.setSpeechRate(_settings.speechRate);
    await _tts.setVolume(1.0);
    await _tts.setPitch(1.0);
    
    // Routage audio vers Bluetooth si activé
    if (_settings.bluetoothRouting) {
      await _routeAudioToBluetooth();
    }
  }

  /// Router l'audio vers le casque Bluetooth
  Future<void> _routeAudioToBluetooth() async {
    final devices = await Bluetooth.instance.getConnectedDevices();
    final audioDevice = devices.firstWhere(
      (d) => d.type == BluetoothDeviceType.audio,
      orElse: () => null,
    );
    
    if (audioDevice != null) {
      _isBluetoothConnected = true;
      // Forcer le routage audio vers le périphérique Bluetooth
      await AudioSession.instance.setCategory(
        AudioSessionCategory.playback,
        mode: AudioSessionMode.defaultMode,
        device: AudioDevice.bluetooth,
      );
    }
  }

  /// Lire la réponse en mode dictée avec répétition
  Future<void> readWithRepetition(String responseText) async {
    await configureTTS();
    
    // Découper en phrases
    final sentences = _splitIntoSentences(responseText);
    
    for (int i = 0; i < sentences.length; i++) {
      final sentence = sentences[i];
      
      // Répéter la phrase N fois
      for (int repeat = 0; repeat < _settings.repeatCount; repeat++) {
        await _tts.speak(sentence);
        await _tts.awaitSpeakCompletion(Future.value(1));
      }
      
      // Vérification orthographique si activée et phrase complexe
      if (_settings.spellingCheck && sentence.length > 50) {
        await _promptSpellingCheck(sentence);
      }
      
      // Pause entre les phrases
      if (i < sentences.length - 1) {
        await Future.delayed(
          Duration(seconds: _settings.pauseDuration)
        );
      }
    }
  }

  /// Découper le texte en phrases
  List<String> _splitIntoSentences(String text) {
    return text
        .split(RegExp(r'(?<=[.!?])\\s+'))
        .where((s) => s.trim().isNotEmpty)
        .toList();
  }

  /// Demander la vérification orthographique
  Future<void> _promptSpellingCheck(String sentence) async {
    // Annonce vocale
    await _tts.speak(
      'Voulez-vous épeler ou vérifier l\\'orthographe de cette notion ?'
    );
    await _tts.awaitSpeakCompletion(Future.value(1));
    
    // Attendre la réponse de l'utilisateur (via UI)
    final shouldCheck = await _waitForUserResponse();
    
    if (shouldCheck) {
      await _startSpellingCheck(sentence);
    }
  }

  /// Démarrer la vérification orthographique
  Future<void> _startSpellingCheck(String correctSentence) async {
    // Activer l'écoute du micro Bluetooth
    await _stt.listen(
      onResult: (result) async {
        final userVersion = result.recognizedWords;
        
        // Envoyer à Gemini pour correction
        final correction = await _geminiClient.correctSpelling(
          original: correctSentence,
          userVersion: userVersion,
        );
        
        // Lire la correction
        await _tts.speak(correction.feedback);
        await _tts.awaitSpeakCompletion(Future.value(1));
      },
      localeId: 'fr_FR',
      listenMode: ListenMode.dictation,
    );
  }

  /// Mise à jour des paramètres en temps réel
  void updateSettings(VoiceSettings newSettings) {
    _settings = newSettings;
    configureTTS(); // Reconfigurer avec les nouveaux paramètres
  }
}`}</pre>
        </div>
      </div>

      {/* Feature Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '400ms'}}>
        {[
          {
            title: 'Mode Dictée Lente',
            icon: '🐌',
            features: [
              'Vitesse ajustable (0.3x - 1.5x)',
              'Lecture posée et claire',
              'Idéal pour prise de notes',
              'Routage Bluetooth automatique',
            ],
            color: 'border-indigo/20 bg-indigo/5',
          },
          {
            title: 'Répétition Intelligente',
            icon: '🔁',
            features: [
              'Répétition configurable (1-4x)',
              'Pauses chronométrées (2-8s)',
              'Progression phrase par phrase',
              'Temps d\'assimilation optimal',
            ],
            color: 'border-caribbean/20 bg-caribbean/5',
          },
          {
            title: 'Vérification Orthographique',
            icon: '✍️',
            features: [
              'Détection phrases complexes',
              'Dictée via micro Bluetooth',
              'Correction Gemini interactive',
              'Feedback vocal immédiat',
            ],
            color: 'border-sun/20 bg-sun/5',
          },
        ].map((card, i) => (
          <div key={i} className={`rounded-xl p-4 border ${card.color}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-sm font-bold text-gray-700">{card.title}</span>
            </div>
            <ul className="space-y-1.5">
              {card.features.map((feature, j) => (
                <li key={j} className="text-[10px] text-gray-600 flex items-center gap-2">
                  <svg className="w-3 h-3 text-caribbean flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
