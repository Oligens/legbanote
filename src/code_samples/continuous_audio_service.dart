import 'dart:async';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:speech_to_text/speech_to_text.dart';
import 'package:just_audio/just_audio.dart';
import 'package:audio_session/audio_session.dart';

/// Service Audio Corrigé - Pipeline Complet Mains Libres
/// Résout le bug critique : l'IA ne répondait pas vocalement
class ContinuousAudioService {
  final FlutterTts _tts = FlutterTts();
  final SpeechToText _stt = SpeechToText();
  final AudioSession _audioSession = AudioSession.instance;
  
  bool _isInitialized = false;
  bool _isListening = false;
  bool _isBluetoothConnected = false;
  
  // Callbacks pour l'UI
  void Function(String transcript)? onTranscriptReceived;
  void Function(String response)? onResponseGenerated;
  void Function(AudioState state)? onStateChanged;
  
  enum AudioState {
    idle,
    listening,
    processing,
    speaking,
    dictation,
  }

  /// Initialisation CRITIQUE - Configuration AudioSession
  /// C'est ici que se résout le bug audio
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // 1. Configuration AudioSession pour Bluetooth
      // CRITIQUE : playAndRecord + allowBluetooth = true
      await _audioSession.configure(const AudioSessionConfiguration(
        avAudioSessionCategory: AVAudioSessionCategory.playAndRecord,
        avAudioSessionCategoryOptions: 
            AVAudioSessionCategoryOptions.allowBluetooth |
            AVAudioSessionCategoryOptions.allowBluetoothA2DP |
            AVAudioSessionCategoryOptions.mixWithOthers,
        avAudioSessionMode: AVAudioSessionMode.spokenAudio,
        avAudioSessionRouteSharingPolicy: 
            AVAudioSessionRouteSharingPolicy.defaultPolicy,
        avAudioSessionSetActiveOptions: 
            AVAudioSessionSetActiveOptions.notifyOthersOnDeactivation,
        androidAudioAttributes: AndroidAudioAttributes(
          contentType: AndroidAudioContentType.speech,
          usage: AndroidAudioUsage.assistant,
        ),
        androidAudioFocusGainType: AndroidAudioFocusGainType.gain,
        androidAudioMode: AndroidAudioMode.normal,
        androidWillPauseWhenDucked: true,
      ));

      // 2. Forcer le routage vers Bluetooth si disponible
      await _forceBluetoothRouting();

      // 3. Configuration TTS
      await _tts.setLanguage('fr-FR');
      await _tts.setSpeechRate(0.5); // Mode dictée lente par défaut
      await _tts.setVolume(1.0);
      await _tts.setPitch(1.0);
      
      // CRITIQUE : Handler de complétion TTS
      _tts.setCompletionHandler(() {
        print('[TTS] Lecture terminée');
        onStateChanged?.call(AudioState.idle);
      });

      // 4. Configuration STT
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

      // 5. Démarrer l'écoute continue
      await _startContinuousListening();

      print('[Audio] Service initialisé avec succès');
      
    } catch (e) {
      print('[Audio] Erreur d\'initialisation: $e');
      rethrow;
    }
  }

  /// Forcer le routage audio vers Bluetooth
  /// CRITIQUE pour résoudre le bug "pas de son dans le casque"
  Future<void> _forceBluetoothRouting() async {
    try {
      // Vérifier si un périphérique Bluetooth est connecté
      final devices = await _audioSession.getActiveRoutes();
      final bluetoothDevice = devices.firstWhere(
        (device) => device.type == AudioDeviceType.bluetooth ||
                    device.type == AudioDeviceType.bluetoothA2DP,
        orElse: () => AudioDevice.empty,
      );

      if (bluetoothDevice != AudioDevice.empty) {
        _isBluetoothConnected = true;
        
        // CRITIQUE : Forcer le routage vers Bluetooth
        await _audioSession.setPreferredDevice(bluetoothDevice);
        
        print('[Audio] Routage forcé vers: ${bluetoothDevice.name}');
      } else {
        _isBluetoothConnected = false;
        print('[Audio] Aucun périphérique Bluetooth détecté');
      }
    } catch (e) {
      print('[Audio] Erreur routage Bluetooth: $e');
      _isBluetoothConnected = false;
    }
  }

  /// Démarrer l'écoute continue en arrière-plan
  /// CRITIQUE : Pas de bouton push-to-talk, écoute permanente
  Future<void> _startContinuousListening() async {
    if (_isListening) return;

    try {
      _isListening = true;
      
      await _stt.listen(
        onResult: (result) {
          // CRITIQUE : Dès qu'une phrase est détectée
          if (result.finalResult && result.recognizedWords.isNotEmpty) {
            print('[STT] Phrase détectée: ${result.recognizedWords}');
            
            // Arrêter temporairement l'écoute
            _stopListening();
            
            // Déclencher le pipeline RAG
            _processUserQuestion(result.recognizedWords);
          }
        },
        localeId: 'fr_FR',
        listenMode: ListenMode.confirmation,
        cancelOnError: true,
        partialResults: true,
        onDevice: false, // Utilise le service cloud pour meilleure qualité
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
    
    // Petit délai pour éviter les conflits audio
    await Future.delayed(const Duration(milliseconds: 500));
    
    await _startContinuousListening();
  }

  /// Pipeline RAG Complet
  /// CRITIQUE : Doit IMPÉRATIVEMENT déclencher le TTS à la fin
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
      onStateChanged?.call(AudioState.processing);
      final response = await _callGeminiAPI(prompt);
      print('[RAG] Réponse Gemini reçue (${response.length} car.)');

      // 4. CRITIQUE : Déclencher le TTS IMMÉDIATEMENT
      // C'est ici que se résout le bug "pas de réponse vocale"
      await _speakResponse(response);

    } catch (e) {
      print('[RAG] Erreur pipeline: $e');
      await _speakError('Désolé, une erreur est survenue');
      await _resumeListening();
    }
  }

  /// Recherche locale dans SQLite FTS5
  Future<List<Chunk>> _searchLocalChunks(String question) async {
    // Extraction des mots-clés
    final keywords = _extractKeywords(question);
    final ftsQuery = keywords.join(' OR ');

    // Requêtes FTS5 avec BM25 ranking
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
    // Utilise google_generative_ai package
    // final response = await _gemini.generateContent([Content.text(prompt)]);
    // return response.text!;
    
    // Simulation pour démonstration
    await Future.delayed(const Duration(seconds: 2));
    return 'Voici la réponse basée sur vos cours... [Source: Droit Constitutionnel - Chapitre 3]';
  }

  /// CRITIQUE : Lecture vocale de la réponse
  /// C'est la fonction qui résout le bug "pas de son"
  Future<void> _speakResponse(String response) async {
    try {
      print('[TTS] Début lecture vocale');
      onStateChanged?.call(AudioState.speaking);
      onResponseGenerated?.call(response);

      // CRITIQUE : Vérifier et forcer le routage Bluetooth avant chaque lecture
      await _forceBluetoothRouting();

      // Découper en phrases pour le mode dictée
      final sentences = _splitIntoSentences(response);
      
      for (int i = 0; i < sentences.length; i++) {
        final sentence = sentences[i];
        
        // Répéter selon la configuration
        for (int repeat = 0; repeat < _repeatCount; repeat++) {
          print('[TTS] Lecture phrase ${i + 1}/${sentences.length} (répétition ${repeat + 1})');
          
          // CRITIQUE : speak() doit être appelé et attendre la complétion
          await _tts.speak(sentence);
          
          // Attendre que la lecture soit terminée
          await _waitForTtsCompletion();
          
          // Pause entre répétitions
          if (repeat < _repeatCount - 1) {
            await Future.delayed(Duration(milliseconds: 500));
          }
        }
        
        // Pause entre phrases
        if (i < sentences.length - 1) {
          onStateChanged?.call(AudioState.dictation);
          await Future.delayed(Duration(seconds: _pauseDuration));
        }
      }

      print('[TTS] Lecture terminée');
      
      // CRITIQUE : Reprendre l'écoute après la réponse
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

    // Timeout de sécurité
    Future.delayed(const Duration(seconds: 30), () {
      if (!completer.isCompleted) {
        completer.complete();
      }
    });

    await completer.future;
  }

  /// Lecture d'un message d'erreur
  Future<void> _speakError(String message) async {
    await _forceBluetoothRouting();
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
    // Supprimer les mots communs
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
    
    // Redémarrer l'écoute après une erreur
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

  /// Arrêt complet du service
  Future<void> dispose() async {
    await _stopListening();
    await _tts.stop();
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
