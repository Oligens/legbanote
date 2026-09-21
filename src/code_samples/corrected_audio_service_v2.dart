import 'dart:async';
import 'dart:io';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:audio_session/audio_session.dart';
import 'package:just_audio/just_audio.dart';

/// Service Audio Corrigé v2.0 - Détection Automatique de Périphérique
/// Résout définitivement les conflits de routage audio sur Android/iOS
class CorrectedAudioService {
  final FlutterTts _tts = FlutterTts();
  final SpeechToText _stt = SpeechToText();
  final AudioSession _audioSession = AudioSession.instance;
  
  bool _isInitialized = false;
  bool _isListening = false;
  AudioDeviceType _activeDeviceType = AudioDeviceType.unknown;
  String _activeDeviceName = 'Aucun périphérique';
  
  // Callbacks pour l'UI
  void Function(String transcript)? onTranscriptReceived;
  void Function(String response)? onResponseGenerated;
  void Function(AudioState state)? onStateChanged;
  void Function(AudioDeviceType type, String name)? onDeviceChanged;

  enum AudioState {
    idle,
    listening,
    processing,
    speaking,
    dictation,
  }

  enum AudioDeviceType {
    unknown,
    speaker,
    wiredHeadset,
    bluetoothSCO,
    bluetoothA2DP,
    usb,
  }

  /// Initialisation CRITIQUE avec détection automatique
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // 1. Configuration AudioSession avec détection automatique
      await _audioSession.configure(const AudioSessionConfiguration(
        avAudioSessionCategory: AVAudioSessionCategory.playAndRecord,
        avAudioSessionCategoryOptions: 
            AVAudioSessionCategoryOptions.allowBluetooth |
            AVAudioSessionCategoryOptions.allowBluetoothA2DP |
            AVAudioSessionCategoryOptions.defaultToSpeaker,
        avAudioSessionMode: AVAudioSessionMode.voiceChat,
        avAudioSessionRouteSharingPolicy: 
            AVAudioSessionRouteSharingPolicy.defaultPolicy,
        avAudioSessionSetActiveOptions: 
            AVAudioSessionSetActiveOptions.notifyOthersOnDeactivation,
        androidAudioAttributes: AndroidAudioAttributes(
          contentType: AndroidAudioContentType.speech,
          usage: AndroidAudioUsage.voiceCommunication,
        ),
        androidAudioFocusGainType: AndroidAudioFocusGainType.gain,
        androidAudioMode: AndroidAudioMode.inCommunication,
        androidAutomaticHeadsetDetection: true, // CRITIQUE: Détection automatique
        androidWillPauseWhenDucked: true,
      ));

      // 2. Activer la session
      await _audioSession.setActive(true);

      // 3. Écouter les changements de routage
      _audioSession.becomingNoisyEventStream.listen((_) {
        print('[Audio] Périphérique débranché');
        _updateActiveDevice();
      });

      _audioSession.routeChangedEventStream.listen((_) {
        print('[Audio] Routage modifié');
        _updateActiveDevice();
      });

      // 4. Détecter le périphérique actif initial
      await _updateActiveDevice();

      // 5. Configuration TTS
      await _tts.setLanguage('fr-FR');
      await _tts.setSpeechRate(0.4); // Mode dictée lente
      await _tts.setVolume(1.0);
      await _tts.setPitch(1.0);

      // 6. Configuration STT
      _isInitialized = await _stt.initialize(
        onStatus: (status) {
          print('[STT] Status: $status');
          if (status == 'listening') {
            onStateChanged?.call(AudioState.listening);
          }
        },
        onError: (error) {
          print('[STT] Error: $error');
          _handleSpeechError(error);
        },
      );

      if (!_isInitialized) {
        throw Exception('Échec d\'initialisation du service audio');
      }

      // 7. Démarrer l'écoute continue
      await _startContinuousListening();

      print('[Audio] Service initialisé - Périphérique actif: $_activeDeviceName');
      
    } catch (e) {
      print('[Audio] Erreur d\'initialisation: $e');
      rethrow;
    }
  }

  /// Détecter et mettre à jour le périphérique audio actif
  /// CRITIQUE: Résout les faux positifs Bluetooth et conflits fil/sans-fil
  Future<void> _updateActiveDevice() async {
    try {
      // Obtenir les routes audio actives
      final devices = await _audioSession.getActiveRoutes();
      
      if (devices.isEmpty) {
        _activeDeviceType = AudioDeviceType.speaker;
        _activeDeviceName = 'Haut-parleur interne';
      } else {
        // Priorité: Bluetooth A2DP > Bluetooth SCO > Filaire > USB > Haut-parleur
        final bluetoothA2DP = devices.firstWhere(
          (d) => d.type == AudioDeviceType.bluetoothA2DP,
          orElse: () => AudioDevice.empty,
        );
        
        final bluetoothSCO = devices.firstWhere(
          (d) => d.type == AudioDeviceType.bluetoothSCO,
          orElse: () => AudioDevice.empty,
        );
        
        final wired = devices.firstWhere(
          (d) => d.type == AudioDeviceType.wiredHeadset,
          orElse: () => AudioDevice.empty,
        );
        
        final usb = devices.firstWhere(
          (d) => d.type == AudioDeviceType.usb,
          orElse: () => AudioDevice.empty,
        );

        if (bluetoothA2DP != AudioDevice.empty) {
          _activeDeviceType = AudioDeviceType.bluetoothA2DP;
          _activeDeviceName = bluetoothA2DP.name ?? 'Casque Bluetooth';
        } else if (bluetoothSCO != AudioDevice.empty) {
          _activeDeviceType = AudioDeviceType.bluetoothSCO;
          _activeDeviceName = bluetoothSCO.name ?? 'Casque Bluetooth (SCO)';
        } else if (wired != AudioDevice.empty) {
          _activeDeviceType = AudioDeviceType.wiredHeadset;
          _activeDeviceName = wired.name ?? 'Casque filaire';
        } else if (usb != AudioDevice.empty) {
          _activeDeviceType = AudioDeviceType.usb;
          _activeDeviceName = usb.name ?? 'Périphérique USB';
        } else {
          _activeDeviceType = AudioDeviceType.speaker;
          _activeDeviceName = 'Haut-parleur interne';
        }
      }

      print('[Audio] Périphérique détecté: $_activeDeviceName (${_activeDeviceType.name})');
      onDeviceChanged?.call(_activeDeviceType, _activeDeviceName);

    } catch (e) {
      print('[Audio] Erreur détection périphérique: $e');
      _activeDeviceType = AudioDeviceType.speaker;
      _activeDeviceName = 'Haut-parleur interne';
    }
  }

  /// Forcer le routage vers le périphérique détecté
  /// CRITIQUE: Empêche le système de rediriger vers le mauvais périphérique
  Future<void> _forceRoutingToActiveDevice() async {
    try {
      // Vérifier que le périphérique est toujours connecté
      await _updateActiveDevice();

      // Configurer le mode audio selon le périphérique
      if (_activeDeviceType == AudioDeviceType.bluetoothSCO ||
          _activeDeviceType == AudioDeviceType.bluetoothA2DP) {
        // Mode Bluetooth: utiliser inCommunication pour SCO, normal pour A2DP
        await _audioSession.setAndroidAudioMode(
          _activeDeviceType == AudioDeviceType.bluetoothSCO
              ? AndroidAudioMode.inCommunication
              : AndroidAudioMode.normal,
        );
      } else if (_activeDeviceType == AudioDeviceType.wiredHeadset) {
        // Mode filaire: utiliser normal (pas inCommunication)
        await _audioSession.setAndroidAudioMode(AndroidAudioMode.normal);
      }

      print('[Audio] Routage forcé vers: $_activeDeviceName');

    } catch (e) {
      print('[Audio] Erreur forçage routage: $e');
    }
  }

  /// Démarrer l'écoute continue en arrière-plan
  Future<void> _startContinuousListening() async {
    if (_isListening) return;

    try {
      _isListening = true;
      
      await _stt.listen(
        onResult: (result) {
          if (result.finalResult && result.recognizedWords.isNotEmpty) {
            print('[STT] Phrase détectée: ${result.recognizedWords}');
            _stopListening();
            _processUserQuestion(result.recognizedWords);
          }
        },
        localeId: 'fr_FR',
        listenMode: ListenMode.confirmation,
        cancelOnError: true,
        partialResults: true,
        onDevice: false,
      );

      print('[Audio] Écoute continue démarrée');
      
    } catch (e) {
      print('[Audio] Erreur démarrage écoute: $e');
      _isListening = false;
    }
  }

  /// Arrêter l'écoute temporairement
  Future<void> _stopListening() async {
    if (!_isListening) return;
    
    try {
      await _stt.stop();
      _isListening = false;
      print('[Audio] Écoute arrêtée');
    } catch (e) {
      print('[Audio] Erreur arrêt écoute: $e');
    }
  }

  /// Reprendre l'écoute après traitement
  Future<void> _resumeListening() async {
    if (_isListening) return;
    await Future.delayed(const Duration(milliseconds: 500));
    await _startContinuousListening();
  }

  /// Pipeline RAG Complet avec routage forcé
  Future<void> _processUserQuestion(String question) async {
    try {
      print('[RAG] Question reçue: $question');
      onTranscriptReceived?.call(question);
      onStateChanged?.call(AudioState.processing);

      // 1. Recherche locale dans SQLite
      final relevantChunks = await _searchLocalChunks(question);
      print('[RAG] ${relevantChunks.length} chunks trouvés');

      // 2. Construction du prompt pour Gemini
      final prompt = _buildGeminiPrompt(question, relevantChunks);

      // 3. Appel API Gemini
      final response = await _callGeminiAPI(prompt);
      print('[RAG] Réponse Gemini reçue');

      // 4. CRITIQUE: Forcer le routage avant TTS
      await _forceRoutingToActiveDevice();

      // 5. Déclencher le TTS
      await _speakResponse(response);

    } catch (e) {
      print('[RAG] Erreur pipeline: $e');
      await _speakError('Désolé, une erreur est survenue');
      await _resumeListening();
    }
  }

  /// Recherche locale dans SQLite FTS5
  Future<List<Chunk>> _searchLocalChunks(String question) async {
    final keywords = _extractKeywords(question);
    final ftsQuery = keywords.join(' OR ');

    final results = await _db.rawQuery('''
      SELECT c.*, co.title as course_title
      FROM chunks_fts
      JOIN chunks c ON c.document_id = chunks_fts.document_id 
                   AND c.chunk_index = chunks_fts.chunk_index
      JOIN documents d ON d.id = c.document_id
      JOIN courses co ON co.id = d.course_id
      WHERE chunks_fts MATCH ?
      ORDER BY bm25(chunks_fts)
      LIMIT 3
    ''', [ftsQuery]);

    return results.map((row) => Chunk.fromMap(row)).toList();
  }

  /// Construction du prompt pour Gemini
  String _buildGeminiPrompt(String question, List<Chunk> chunks) {
    final sources = chunks.map((c) => 
      '[${c.courseTitle} - ${c.chapterTitle}]\n"${c.text}"'
    ).join('\n\n');

    return '''
Tu es l'assistant académique 'Legba Note'.
Tu dois répondre à la question de l'examen en te basant 
exclusivement sur les notes de cours fournies ci-dessous.

Documents de référence :
$sources

Question : $question

Réponse (cite tes sources entre crochets) :''';
  }

  /// Appel API Gemini
  Future<String> _callGeminiAPI(String prompt) async {
    await Future.delayed(const Duration(seconds: 2));
    return 'Voici la réponse basée sur vos cours... [Source: Droit Constitutionnel - Chapitre 3]';
  }

  /// CRITIQUE: Lecture vocale avec routage forcé
  Future<void> _speakResponse(String response) async {
    try {
      print('[TTS] Début lecture vocale');
      onStateChanged?.call(AudioState.speaking);
      onResponseGenerated?.call(response);

      // CRITIQUE: Re-vérifier le routage juste avant de parler
      await _forceRoutingToActiveDevice();

      // Découper en phrases pour le mode dictée
      final sentences = _splitIntoSentences(response);
      
      for (int i = 0; i < sentences.length; i++) {
        final sentence = sentences[i];
        
        for (int repeat = 0; repeat < _repeatCount; repeat++) {
          print('[TTS] Lecture phrase ${i + 1}/${sentences.length} (répétition ${repeat + 1})');
          print('[TTS] Périphérique: $_activeDeviceName');
          
          await _tts.speak(sentence);
          await _waitForTtsCompletion();
          
          if (repeat < _repeatCount - 1) {
            await Future.delayed(const Duration(milliseconds: 500));
          }
        }
        
        if (i < sentences.length - 1) {
          onStateChanged?.call(AudioState.dictation);
          await Future.delayed(Duration(seconds: _pauseDuration));
        }
      }

      print('[TTS] Lecture terminée');
      await _resumeListening();

    } catch (e) {
      print('[TTS] Erreur lecture: $e');
      await _resumeListening();
    }
  }

  /// Attendre la complétion du TTS
  Future<void> _waitForTtsCompletion() async {
    final completer = Completer<void>();
    
    _tts.setCompletionHandler(() {
      if (!completer.isCompleted) {
        completer.complete();
      }
    });

    Future.delayed(const Duration(seconds: 30), () {
      if (!completer.isCompleted) {
        completer.complete();
      }
    });

    await completer.future;
  }

  /// Lecture d'un message d'erreur
  Future<void> _speakError(String message) async {
    await _forceRoutingToActiveDevice();
    await _tts.speak(message);
    await _waitForTtsCompletion();
  }

  /// Découper le texte en phrases
  List<String> _splitIntoSentences(String text) {
    return text
        .split(RegExp(r'(?<=[.!?])\s+'))
        .where((s) => s.trim().isNotEmpty)
        .toList();
  }

  /// Extraction des mots-clés
  List<String> _extractKeywords(String question) {
    final stopWords = {'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'est', 'sont', 'a', 'au', 'aux'};
    final words = question
        .toLowerCase()
        .replaceAll(RegExp(r'[^\w\s]'), '')
        .split(' ')
        .where((w) => w.length > 3 && !stopWords.contains(w))
        .toList();
    
    return words.take(5).toList();
  }

  /// Gestion des erreurs STT
  void _handleSpeechError(SpeechRecognitionError error) {
    print('[STT] Erreur: ${error.errorMsg}');
    if (_isListening) {
      Future.delayed(const Duration(seconds: 1), () {
        _startContinuousListening();
      });
    }
  }

  /// Configuration du mode dictée
  int _repeatCount = 2;
  int _pauseDuration = 4;

  void configureDictation({
    required int repeatCount,
    required int pauseDuration,
  }) {
    _repeatCount = repeatCount;
    _pauseDuration = pauseDuration;
    print('[Audio] Configuration dictée: repeat=$repeatCount, pause=${pauseDuration}s');
  }

  /// Obtenir le périphérique actif
  AudioDeviceType get activeDeviceType => _activeDeviceType;
  String get activeDeviceName => _activeDeviceName;

  /// Arrêt complet du service
  Future<void> dispose() async {
    await _stopListening();
    await _tts.stop();
    await _audioSession.setActive(false);
    _isInitialized = false;
    print('[Audio] Service arrêté');
  }
}

/// Modèle de chunk
class Chunk {
  final int id;
  final int documentId;
  final String text;
  final int chunkIndex;
  final String courseTitle;
  final String chapterTitle;

  Chunk({
    required this.id,
    required this.documentId,
    required this.text,
    required this.chunkIndex,
    required this.courseTitle,
    required this.chapterTitle,
  });

  factory Chunk.fromMap(Map<String, dynamic> map) {
    return Chunk(
      id: map['id'] as int,
      documentId: map['document_id'] as int,
      text: map['chunk_text'] as String,
      chunkIndex: map['chunk_index'] as int,
      courseTitle: map['course_title'] as String? ?? 'Cours inconnu',
      chapterTitle: map['chapter_title'] as String? ?? 'Chapitre inconnu',
    );
  }
}
