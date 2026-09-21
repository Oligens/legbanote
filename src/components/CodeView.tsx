import { useState } from 'react';

type Language = 'dart' | 'typescript' | 'sql';

interface CodeFile {
  id: string;
  name: string;
  language: Language;
  description: string;
  code: string;
}

const codeFiles: CodeFile[] = [
  {
    id: 'rag-service',
    name: 'rag_service.dart',
    language: 'dart',
    description: 'Service principal orchestrant le pipeline RAG',
    code: `import 'package:sqflite/sqflite.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

class RagService {
  final Database _db;
  final GenerativeModel _gemini;
  
  RagService(this._db, this._gemini);

  /// Pipeline complet : question → recherche → réponse IA
  Future<RagResponse> answerQuestion(String question) async {
    // 1. Recherche locale FTS5
    final chunks = await _searchLocalChunks(question, limit: 3);
    
    // 2. Construction du prompt
    final prompt = _buildPrompt(question, chunks);
    
    // 3. Appel Gemini Pro
    final response = await _callGemini(prompt);
    
    // 4. Sauvegarde en historique
    await _saveToHistory(question, response, chunks);
    
    return response;
  }

  /// Recherche FTS5 dans SQLite
  Future<List<TextChunk>> _searchLocalChunks(
    String question, {
    int limit = 3,
  }) async {
    // Extraction mots-clés simples
    final keywords = _extractKeywords(question);
    final ftsQuery = keywords.join(' OR ');
    
    final results = await _db.rawQuery('''
      SELECT ci.*, c.title as course_title
      FROM cours_index ci
      JOIN courses c ON ci.course_id = c.id
      WHERE cours_index MATCH ?
      ORDER BY bm25(cours_index)
      LIMIT ?
    ''', [ftsQuery, limit]);
    
    return results.map((row) => TextChunk.fromMap(row)).toList();
  }

  /// Construction du prompt structuré
  String _buildPrompt(String question, List<TextChunk> chunks) {
    final sources = chunks.map((c) => 
      '[\${c.courseTitle} - \${c.chapterTitle}]\\n"\${c.text}"'
    ).join('\\n\\n');
    
    return """
Tu es l'assistant académique 'Legba Note'.
Tu dois répondre en te basant exclusivement sur les notes 
de cours fournies ci-dessous.

Documents de référence :
$sources

Question : $question

Réponse :""";
  }

  /// Appel API Gemini avec retry
  Future<RagResponse> _callGemini(String prompt) async {
    for (int attempt = 0; attempt < 3; attempt++) {
      try {
        final response = await _gemini
            .generateContent([Content.text(prompt)])
            .timeout(const Duration(seconds: 30));
        
        return RagResponse(
          text: response.text!,
          sources: _extractSources(response.text!),
          timestamp: DateTime.now(),
        );
      } catch (e) {
        if (attempt == 2) rethrow;
        await Future.delayed(
          Duration(seconds: (attempt + 1) * 2)
        );
      }
    }
    throw Exception('Gemini API failed after 3 attempts');
  }
}`,
  },
  {
    id: 'pdf-processor',
    name: 'pdf_processor.dart',
    language: 'dart',
    description: 'Extraction et chunking des documents PDF',
    code: `import 'package:pdf_parse/pdf_parse.dart';

class PdfProcessor {
  static const int chunkSize = 3000; // caractères
  static const int chunkOverlap = 200;

  /// Traite un PDF uploadé et indexe ses chunks
  Future<void> processAndIndex(String filePath, int courseId) async {
    // 1. Extraction du texte
    final fullText = await _extractText(filePath);
    
    // 2. Découpage en chunks sémantiques
    final chunks = _createChunks(fullText);
    
    // 3. Insertion dans SQLite FTS5
    await _insertChunks(chunks, courseId);
    
    // 4. Mise à jour métadonnées du cours
    await _updateCourseMetadata(courseId, chunks.length);
  }

  /// Extraction du texte page par page
  Future<String> _extractText(String filePath) async {
    final pdf = await PdfParse.load(filePath);
    final buffer = StringBuffer();
    
    for (int i = 0; i < pdf.pageCount; i++) {
      final page = pdf.getPage(i);
      final text = page.getText();
      buffer.writeln(text);
    }
    
    return _cleanText(buffer.toString());
  }

  /// Découpage avec overlap pour préserver le contexte
  List<TextChunk> _createChunks(String text) {
    final chunks = <TextChunk>[];
    int start = 0;
    int index = 0;
    
    while (start < text.length) {
      int end = start + chunkSize;
      
      // Ajuster à la fin du paragraphe le plus proche
      if (end < text.length) {
        final nextBreak = text.indexOf('\\n\\n', end - 200);
        if (nextBreak != -1 && nextBreak < end + 500) {
          end = nextBreak;
        }
      }
      
      final chunkText = text.substring(start, end).trim();
      if (chunkText.isNotEmpty) {
        chunks.add(TextChunk(
          text: chunkText,
          chunkIndex: index,
          startChar: start,
          endChar: end,
        ));
      }
      
      start = end - chunkOverlap; // Overlap
      index++;
    }
    
    return chunks;
  }

  /// Insertion batch dans FTS5
  Future<void> _insertChunks(
    List<TextChunk> chunks, 
    int courseId
  ) async {
    final batch = _db.batch();
    
    for (final chunk in chunks) {
      batch.insert('cours_index', {
        'chunk_text': chunk.text,
        'course_id': courseId,
        'chapter_title': _detectChapter(chunk.text),
        'chunk_index': chunk.chunkIndex,
        'page_number': _estimatePage(chunk),
      });
    }
    
    await batch.commit(noResult: true);
  }
}`,
  },
  {
    id: 'db-schema',
    name: 'database_schema.sql',
    language: 'sql',
    description: 'Schéma complet de la base de données SQLite',
    code: `-- ============================================
-- Legba Note - Schéma de Base de Données
-- SQLite avec extension FTS5
-- ============================================

-- Table des cours (métadonnées)
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_hash TEXT,           -- Pour détecter les modifications
  total_chapters INTEGER DEFAULT 0,
  total_chunks INTEGER DEFAULT 0,
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table d'indexation plein texte (FTS5)
-- C'est le cœur de la recherche locale
CREATE VIRTUAL TABLE IF NOT EXISTS cours_index USING fts5(
  chunk_text,               -- Contenu du chunk
  course_id UNINDEXED,      -- Référence au cours
  chapter_title UNINDEXED,  -- Titre du chapitre
  chunk_index UNINDEXED,    -- Position séquentielle
  page_number UNINDEXED,    -- Page source estimée
  tokenize='unicode61'      -- Tokenizer adapté au français
);

-- Index pour les jointures rapides
CREATE INDEX IF NOT EXISTS idx_chunks_course 
  ON cours_index(course_id);

-- Table d'historique des conversations
CREATE TABLE IF NOT EXISTS conversation_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sources TEXT,             -- JSON array des sources
  is_saved INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de configuration utilisateur
CREATE TABLE IF NOT EXISTS user_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Vues utilitaires
-- ============================================

-- Vue : cours avec nombre de chunks
CREATE VIEW IF NOT EXISTS v_courses_summary AS
SELECT 
  c.id,
  c.title,
  c.total_chapters,
  COUNT(ci.rowid) as total_chunks,
  c.created_at
FROM courses c
LEFT JOIN cours_index ci ON ci.course_id = c.id
GROUP BY c.id;

-- ============================================
-- Requêtes principales
-- ============================================

-- Recherche FTS avec ranking BM25
-- Utilisée par le pipeline RAG pour trouver les chunks pertinents
-- SELECT 
--   ci.chunk_text,
--   ci.chapter_title,
--   c.title as course_title,
--   bm25(cours_index) as relevance_score
-- FROM cours_index ci
-- JOIN courses c ON ci.course_id = c.id
-- WHERE cours_index MATCH :query
-- ORDER BY bm25(cours_index)
-- LIMIT 3;`,
  },
  {
    id: 'speech-service',
    name: 'speech_service.dart',
    language: 'dart',
    description: 'Gestion du Speech-to-Text et Text-to-Speech natifs',
    code: `import 'package:speech_to_text/speech_to_text.dart';
import 'package:flutter_tts/flutter_tts.dart';

class SpeechService {
  final SpeechToText _stt = SpeechToText();
  final FlutterTts _tts = FlutterTts();
  
  bool _isInitialized = false;
  
  /// Initialisation des services audio natifs
  Future<void> initialize() async {
    // Speech-to-Text
    _isInitialized = await _stt.initialize(
      onStatus: (status) => _onSpeechStatus(status),
      onError: (error) => _onSpeechError(error),
    );
    
    // Text-to-Speech
    await _tts.setLanguage('fr-FR');
    await _tts.setSpeechRate(0.5);
    await _tts.setVolume(1.0);
    await _tts.setPitch(1.0);
  }

  /// Capture vocale → texte (streaming)
  Future<String> listenForQuestion({
    Duration timeout = const Duration(seconds: 30),
    void Function(String partial)? onPartialResult,
  }) async {
    if (!_isInitialized) {
      throw Exception('SpeechService not initialized');
    }
    
    final completer = Completer<String>();
    final buffer = StringBuffer();
    
    await _stt.listen(
      onResult: (result) {
        buffer.write(result.recognizedWords);
        onPartialResult?.call(buffer.toString());
        
        // Détection fin de parole (silence > 1.5s)
        if (result.finalResult) {
          completer.complete(buffer.toString());
        }
      },
      localeId: 'fr_FR',
      listenMode: ListenMode.confirmation,
      cancelOnError: true,
      partialResults: true,
    );
    
    // Timeout de sécurité
    Future.delayed(timeout, () {
      if (!completer.isCompleted) {
        _stt.stop();
        completer.complete(buffer.toString());
      }
    });
    
    return completer.future;
  }

  /// Lecture vocale de la réponse
  Future<void> speakResponse(String text) async {
    // Nettoyer le texte (retirer markdown, sources)
    final cleanText = _cleanForSpeech(text);
    
    // Découper si trop long (limite TTS natif)
    final segments = _splitIntoSegments(cleanText, maxLength: 200);
    
    for (final segment in segments) {
      await _tts.speak(segment);
      // Attendre la fin avant le segment suivant
      await _tts.awaitSpeakCompletion(Future.value(1));
    }
  }

  /// Arrêter la lecture en cours
  Future<void> stopSpeaking() async {
    await _tts.stop();
  }
}`,
  },
  {
    id: 'api-client',
    name: 'gemini_client.ts',
    language: 'typescript',
    description: 'Client API Gemini pour React Native (alternative)',
    code: `import { GoogleGenerativeAI } from '@google/generative-ai';

interface RagContext {
  question: string;
  chunks: TextChunk[];
}

interface TextChunk {
  text: string;
  courseTitle: string;
  chapterTitle: string;
  relevanceScore: number;
}

interface GeminiResponse {
  answer: string;
  sources: string[];
  confidence: number;
  tokensUsed: number;
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro' 
    });
  }

  /**
   * Génère une réponse contextuelle basée sur les chunks locaux
   */
  async generateAnswer(context: RagContext): Promise<GeminiResponse> {
    const prompt = this.buildPrompt(context);
    
    const startTime = Date.now();
    const result = await this.model.generateContent(prompt);
    const latency = Date.now() - startTime;
    
    const response = result.response;
    const text = response.text();
    
    return {
      answer: text,
      sources: this.extractSources(text, context.chunks),
      confidence: this.calculateConfidence(text, context.chunks),
      tokensUsed: response.usageMetadata?.totalTokenCount ?? 0,
    };
  }

  /**
   * Construction du prompt avec system instruction
   */
  private buildPrompt(context: RagContext): string {
    const sourcesText = context.chunks
      .map((chunk, i) => 
        \`[Source \${i + 1}: \${chunk.courseTitle} - \${chunk.chapterTitle}]\\n\${chunk.text}\`
      )
      .join('\\n\\n---\\n\\n');

    return \`Tu es l'assistant académique 'Legba Note'.
Tu dois répondre à la question de l'examen en te basant 
exclusivement sur les notes de cours fournies ci-dessous.

Si l'information n'est pas dans les documents, dis-le 
clairement au lieu d'inventer.

Documents de référence :
\${sourcesText}

---

Question : \${context.question}

Réponse (cite tes sources entre crochets) :\`;
  }

  /**
   * Extraction des sources mentionnées dans la réponse
   */
  private extractSources(
    answer: string, 
    chunks: TextChunk[]
  ): string[] {
    const sources: string[] = [];
    
    chunks.forEach((chunk, i) => {
      // Vérifier si le chunk est référencé dans la réponse
      const refPatterns = [
        \`Source \${i + 1}\`,
        \`[\${i + 1}]\`,
        chunk.courseTitle,
      ];
      
      if (refPatterns.some(p => answer.includes(p))) {
        sources.push(\`\${chunk.courseTitle} - \${chunk.chapterTitle}\`);
      }
    });
    
    return sources;
  }
}`,
  },
];

export default function CodeView() {
  const [activeFile, setActiveFile] = useState<string>('rag-service');
  const activeCodeFile = codeFiles.find(f => f.id === activeFile)!;

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Implémentation</h2>
        <p className="text-gray-500 text-sm">Code source des composants clés du pipeline RAG</p>
      </div>

      {/* File Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        {codeFiles.map((file) => (
          <button
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-300 ${
              activeFile === file.id
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-500 border border-sand-dark/20 hover:border-gray-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              file.language === 'dart' ? 'bg-blue-400' :
              file.language === 'typescript' ? 'bg-blue-600' : 'bg-amber-400'
            }`}></span>
            {file.name}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden">
          {/* File Header */}
          <div className="bg-gray-900 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-xs text-gray-400 font-mono">{activeCodeFile.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeCodeFile.language === 'dart' ? 'bg-blue-400/20 text-blue-300' :
                activeCodeFile.language === 'typescript' ? 'bg-blue-600/20 text-blue-300' : 'bg-amber-400/20 text-amber-300'
              }`}>
                {activeCodeFile.language}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 py-3 bg-sand-light border-b border-sand-dark/10">
            <p className="text-xs text-gray-600">{activeCodeFile.description}</p>
          </div>

          {/* Code Content */}
          <div className="p-5 bg-gray-950 overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="code-block text-gray-300 text-xs leading-relaxed whitespace-pre">
              {activeCodeFile.code}
            </pre>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className="bg-white rounded-2xl p-5 border border-sand-dark/15 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📋</span> Checklist d'Implémentation
          </h4>
          <ul className="space-y-2">
            {[
              'Initialiser SQLite avec FTS5 au premier lancement',
              'Implémenter le PdfProcessor avec gestion d\'erreurs',
              'Créer le RagService comme singleton',
              'Configurer Gemini API key en secure storage',
              'Implémenter SpeechService avec permissions',
              'Ajouter le cache en mémoire (LRU, 50 entrées)',
              'Tests unitaires pour chaque composant',
              'Tests d\'intégration du pipeline complet',
            ].map((item, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-indigo focus:ring-indigo" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-sand-dark/15 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📦</span> Dépendances Principales
          </h4>
          <div className="space-y-2">
            {[
              { name: 'sqflite', version: '^2.3.0', purpose: 'Base de données locale' },
              { name: 'google_generative_ai', version: '^0.4.0', purpose: 'API Gemini Pro' },
              { name: 'pdf_parse', version: '^1.0.0', purpose: 'Extraction texte PDF' },
              { name: 'speech_to_text', version: '^6.6.0', purpose: 'Speech-to-Text natif' },
              { name: 'flutter_tts', version: '^3.8.0', purpose: 'Text-to-Speech natif' },
              { name: 'path_provider', version: '^2.1.0', purpose: 'Répertoires fichiers' },
              { name: 'flutter_secure_storage', version: '^9.0.0', purpose: 'Stockage API key' },
              { name: 'connectivity_plus', version: '^5.0.0', purpose: 'Détection réseau' },
            ].map((dep, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-sand-dark/10 last:border-0">
                <div>
                  <span className="text-xs font-mono font-medium text-indigo">{dep.name}</span>
                  <span className="text-[10px] text-gray-400 ml-2">{dep.version}</span>
                </div>
                <span className="text-[10px] text-gray-500">{dep.purpose}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
