import { useState } from 'react';

type StorageTab = 'upload' | 'chunking' | 'filesystem';

export default function DocumentStorage() {
  const [activeTab, setActiveTab] = useState<StorageTab>('upload');

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Stockage Local des Documents</h2>
        <p className="text-gray-500 text-sm">Import PDF, extraction de texte, découpage sémantique (chunking) et indexation dans SQLite</p>
      </div>

      {/* Upload Pipeline Overview */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Pipeline d'Import de Document</h3>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {[
            { step: '1', label: 'Upload PDF', icon: '📤', detail: 'File picker natif', color: 'bg-caribbean' },
            { step: '2', label: 'Copie sécurisée', icon: '📁', detail: 'App Documents Dir', color: 'bg-caribbean-light' },
            { step: '3', label: 'Extraction texte', icon: '📝', detail: 'Parseur PDF local', color: 'bg-indigo' },
            { step: '4', label: 'Chunking', icon: '✂️', detail: 'Segments 2-4K car.', color: 'bg-indigo-light' },
            { step: '5', label: 'Indexation FTS5', icon: '🔍', detail: 'SQLite plein texte', color: 'bg-sun' },
            { step: '6', label: 'Métadonnées', icon: '📋', detail: 'Tables courses+docs', color: 'bg-emerald-500' },
          ].map((item, i, arr) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="flex-1 bg-sand-light rounded-xl p-3 text-center border border-sand-dark/10">
                <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center mx-auto mb-1`}>
                  <span className="text-[9px] font-bold text-white">{item.step}</span>
                </div>
                <span className="text-base block">{item.icon}</span>
                <span className="text-[10px] font-semibold text-gray-700 block">{item.label}</span>
                <span className="text-[9px] text-gray-400">{item.detail}</span>
              </div>
              {i < arr.length - 1 && (
                <svg className="w-3 h-3 text-gray-300 flex-shrink-0 hidden sm:block" viewBox="0 0 12 12">
                  <path d="M0 6h8m0 0l-2.5-2.5M8 6L5.5 8.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        {[
          { id: 'upload' as StorageTab, label: 'Upload & Extraction', icon: '📤' },
          { id: 'chunking' as StorageTab, label: 'Algorithme de Chunking', icon: '✂️' },
          { id: 'filesystem' as StorageTab, label: 'Structure Fichiers', icon: '📁' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-indigo text-white shadow-md shadow-indigo/20'
                : 'bg-white text-gray-500 border border-sand-dark/20 hover:border-indigo/30'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Upload Process */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Processus d'Upload</h4>
            <div className="space-y-3">
              {[
                {
                  title: 'Sélection du fichier',
                  desc: 'File picker natif (file_picker package). Formats acceptés : PDF, EPUB, TXT',
                  icon: '📱',
                },
                {
                  title: 'Validation & copie',
                  desc: 'Vérification taille max (50 Mo), copie vers getApplicationDocumentsDirectory/legba_docs/',
                  icon: '📋',
                },
                {
                  title: 'Extraction du texte',
                  desc: 'Parseur PDF local (pdfx). Extraction page par page, nettoyage des caractères spéciaux',
                  icon: '📝',
                },
                {
                  title: 'Détection de structure',
                  desc: 'Identification des titres de chapitres via regex (patterns "Chapitre X", "Section X.X")',
                  icon: '🏗️',
                },
                {
                  title: 'Enregistrement métadonnées',
                  desc: 'Insertion dans tables courses, documents. Mise à jour des compteurs',
                  icon: '💾',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-sand-light/50 rounded-xl">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{item.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Code */}
          <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">document_service.dart</span>
              <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full">Dart</span>
            </div>
            <div className="p-4 bg-gray-950 overflow-x-auto max-h-[450px] overflow-y-auto">
              <pre className="code-block text-gray-300 whitespace-pre">{`class DocumentService {
  final Database _db;
  final ChunkingService _chunker;

  /// Importer un nouveau document PDF
  Future<DocumentRecord> importDocument({
    required String filePath,
    required int courseId,
  }) async {
    // 1. Validation
    final file = File(filePath);
    if (!await file.exists()) {
      throw Exception('Fichier introuvable');
    }
    if (await file.length() > 50 * 1024 * 1024) {
      throw Exception('Fichier trop volumineux (max 50Mo)');
    }

    // 2. Copie vers répertoire sécurisé
    final appDir = await getApplicationDocumentsDirectory();
    final destDir = Directory(
      '\${appDir.path}/legba_docs/\$courseId'
    );
    await destDir.create(recursive: true);
    
    final destPath = '\${destDir.path}/\${file.uri.pathSegments.last}';
    await file.copy(destPath);

    // 3. Extraction du texte
    final pdfText = await _extractPdfText(destPath);
    final pageCount = await _getPageCount(destPath);

    // 4. Enregistrement en base
    final docId = await _db.insert('documents', {
      'course_id': courseId,
      'file_name': file.uri.pathSegments.last,
      'file_path': destPath,
      'file_size': await file.length(),
      'mime_type': 'application/pdf',
      'page_count': pageCount,
      'text_extracted': 1,
    });

    // 5. Chunking & Indexation
    await _chunker.processAndIndex(
      text: pdfText,
      documentId: docId,
    );

    // 6. Mise à jour compteur cours
    await _db.rawUpdate('''
      UPDATE courses 
      SET total_chunks = (
        SELECT COUNT(*) FROM chunks 
        WHERE document_id = ?
      ),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    ''', [docId, courseId]);

    return DocumentRecord(
      id: docId,
      fileName: file.uri.pathSegments.last,
      filePath: destPath,
      pageCount: pageCount,
    );
  }

  /// Extraction texte via parseur PDF
  Future<String> _extractPdfText(String path) async {
    final pdfDocument = await PdfDocument.openFile(path);
    final buffer = StringBuffer();

    for (int i = 0; i < pdfDocument.pageCount; i++) {
      final page = await pdfDocument.getPage(i + 1);
      final text = await page.extractTextContent();
      buffer.writeln(text);
      page.close();
    }

    pdfDocument.close();
    return _cleanExtractedText(buffer.toString());
  }

  /// Nettoyage du texte extrait
  String _cleanExtractedText(String text) {
    return text
      .replaceAll(RegExp(r'[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]'), '')
      .replaceAll(RegExp(r' {3,}'), '  ')
      .replaceAll(RegExp(r'\\n{3,}'), '\\n\\n')
      .trim();
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chunking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Chunking Algorithm */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Algorithme de Découpage Sémantique</h4>
            
            <div className="space-y-4">
              <div className="bg-indigo/5 rounded-xl p-4 border border-indigo/10">
                <p className="text-xs font-semibold text-indigo mb-2">📐 Paramètres de Chunking</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-indigo">3000</p>
                    <p className="text-[9px] text-gray-500">caractères/chunk</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-caribbean">200</p>
                    <p className="text-[9px] text-gray-500">caractères overlap</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-sun-dark">§</p>
                    <p className="text-[9px] text-gray-500">Split par paragraphe</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-emerald-600">FTS5</p>
                    <p className="text-[9px] text-gray-500">Index plein texte</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">Stratégie de découpage :</p>
                {[
                  'Priorité 1 : Couper aux limites de paragraphes (\\n\\n)',
                  'Priorité 2 : Couper aux limites de phrases (. ! ?)',
                  'Priorité 3 : Couper aux limites de mots',
                  'Overlap : 200 caractères partagés entre chunks adjacents',
                  'Détection auto des titres de chapitres (regex)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-indigo">{i + 1}</span>
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Visual chunking example */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-500 mb-2">Exemple visuel :</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="h-4 bg-caribbean/30 rounded-sm flex-1" style={{width: '85%'}}></div>
                    <span className="text-[9px] text-gray-400">Chunk 1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 bg-caribbean/10 rounded-sm" style={{width: '10%'}}></div>
                    <div className="h-4 bg-indigo/30 rounded-sm flex-1" style={{width: '75%'}}></div>
                    <span className="text-[9px] text-gray-400">Chunk 2</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 bg-indigo/10 rounded-sm" style={{width: '10%'}}></div>
                    <div className="h-4 bg-sun/30 rounded-sm flex-1" style={{width: '80%'}}></div>
                    <span className="text-[9px] text-gray-400">Chunk 3</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-3 h-3 bg-caribbean/20 rounded-sm border border-dashed border-caribbean/40"></div>
                    <span className="text-[9px] text-gray-400">= Zone d'overlap (200 car.)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chunking Code */}
          <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">chunking_service.dart</span>
              <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full">Dart</span>
            </div>
            <div className="p-4 bg-gray-950 overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="code-block text-gray-300 whitespace-pre">{`class ChunkingService {
  final Database _db;
  
  static const int CHUNK_SIZE = 3000;
  static const int OVERLAP = 200;
  static const int MIN_CHUNK = 200;

  /// Traiter un texte et indexer les chunks
  Future<void> processAndIndex({
    required String text,
    required int documentId,
  }) async {
    // 1. Découpage sémantique
    final chunks = _createSemanticChunks(text);
    
    // 2. Détection des chapitres
    final chapterMap = _detectChapters(text);
    
    // 3. Insertion batch en base
    final batch = _db.batch();
    
    for (int i = 0; i < chunks.length; i++) {
      final chunk = chunks[i];
      final chapter = _findChapterForPosition(
        chunk.startPos, chapterMap
      );
      
      // Table chunks (données complètes)
      batch.insert('chunks', {
        'document_id': documentId,
        'chunk_text': chunk.text,
        'chunk_index': i,
        'page_number': _estimatePage(
          chunk.startPos, text.length
        ),
        'chapter_title': chapter,
        'char_start': chunk.startPos,
        'char_end': chunk.endPos,
        'word_count': chunk.text.split(' ').length,
      });
      
      // Table FTS (index recherche)
      batch.insert('chunks_fts', {
        'chunk_text': chunk.text,
        'document_id': documentId,
        'chapter_title': chapter,
        'chunk_index': i,
        'page_number': _estimatePage(
          chunk.startPos, text.length
        ),
      });
    }
    
    await batch.commit(noResult: true);
  }

  /// Découpage sémantique avec overlap
  List<TextChunk> _createSemanticChunks(String text) {
    final chunks = <TextChunk>[];
    int start = 0;
    int index = 0;

    while (start < text.length) {
      int end = start + CHUNK_SIZE;
      
      if (end >= text.length) {
        end = text.length;
      } else {
        // Chercher un boundary naturel
        end = _findBestBreakPoint(text, end);
      }
      
      final chunkText = text.substring(start, end).trim();
      
      if (chunkText.length >= MIN_CHUNK) {
        chunks.add(TextChunk(
          text: chunkText,
          startPos: start,
          endPos: end,
        ));
      }
      
      // Avancer avec overlap
      start = end - OVERLAP;
      if (start <= (chunks.isNotEmpty 
          ? chunks.last.startPos : 0)) {
        start = end; // Éviter boucle infinie
      }
      index++;
    }
    
    return chunks;
  }

  /// Trouver le meilleur point de coupure
  int _findBestBreakPoint(String text, int target) {
    // Priorité 1 : double saut de ligne (paragraphe)
    final paraBreak = text.lastIndexOf('\\n\\n', target);
    if (paraBreak > target - 500) return paraBreak + 2;
    
    // Priorité 2 : fin de phrase
    final sentenceEnd = text.lastIndexOf(
      RegExp(r'[.!?]\\s'), target
    );
    if (sentenceEnd > target - 300) {
      return sentenceEnd + 2;
    }
    
    // Priorité 3 : fin de ligne
    final lineBreak = text.lastIndexOf('\\n', target);
    if (lineBreak > target - 200) return lineBreak + 1;
    
    // Fallback : position cible
    return target;
  }

  /// Détection des titres de chapitres
  Map<int, String> _detectChapters(String text) {
    final chapters = <int, String>{};
    final pattern = RegExp(
      r'(?:^|\\n)\\s*(?:Chapitre|Chapter|Section|Part)\\s*'
      r'(\\d+(?:\\.\\d+)*)(?:[:\\.\\-]\\s*(.+))?',
      caseSensitive: false,
      multiLine: true,
    );
    
    for (final match in pattern.allMatches(text)) {
      final title = match.group(0)?.trim() ?? '';
      chapters[match.start] = title;
    }
    
    return chapters;
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'filesystem' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* File Structure */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Structure des Fichiers</h4>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="code-block text-gray-300 whitespace-pre text-[11px]">{`📱 ApplicationDocumentsDirectory/
└── 📂 legba_note/
    ├── 📂 legba_docs/
    │   ├── 📂 course_1/
    │   │   ├── 📄 economie_globale.pdf
    │   │   ├── 📄 chapitre_4_notes.pdf
    │   │   └── 📄 macro_2024.pdf
    │   ├── 📂 course_2/
    │   │   ├── 📄 droit_const.pdf
    │   │   └── 📄 constitution_haiti.pdf
    │   └── 📂 course_3/
    │       └── 📄 histoire_revolution.pdf
    ├── 📂 cache/
    │   ├── 📄 recent_responses.json
    │   └── 📄 search_cache.db
    └── 📄 legba_note.db  (SQLCipher)

📱 TemporaryDirectory/
└── 📂 legba_temp/
    └── 📄 upload_staging/  (fichiers en cours)

🔐 Secure Enclave / Android KeyStore
├── 🔑 db_encryption_key
├── 🔑 gemini_api_key
└── 🔑 session_token`}</pre>
            </div>
          </div>

          {/* Storage Management */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Gestion du Stockage</h4>
            <div className="space-y-4">
              {/* Storage budget */}
              <div className="bg-sand-light rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-3">Budget Stockage</p>
                <div className="space-y-2">
                  {[
                    { label: 'Base de données (SQLCipher)', size: '~100 Mo', percent: 20, color: 'bg-indigo' },
                    { label: 'Documents PDF', size: '~300 Mo', percent: 60, color: 'bg-caribbean' },
                    { label: 'Cache & temp', size: '~50 Mo', percent: 10, color: 'bg-sun' },
                    { label: 'Libre', size: '~50 Mo', percent: 10, color: 'bg-emerald-500' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-gray-600">{item.label}</span>
                        <span className="text-[10px] font-medium text-gray-700">{item.size}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{width: `${item.percent}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 mt-2 text-center">Total alloué : ~500 Mo sur l'appareil</p>
              </div>

              {/* Cleanup strategy */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs font-semibold text-amber-700 mb-2">🧹 Stratégie de Nettoyage</p>
                <ul className="space-y-1.5 text-[10px] text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500">•</span>
                    Suppression auto des fichiers temp après 24h
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500">•</span>
                    Cache réponses : LRU, max 50 entrées
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500">•</span>
                    Alerte si stockage &gt; 450 Mo
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-500">•</span>
                    Option utilisateur : supprimer cours + fichiers associés
                  </li>
                </ul>
              </div>

              {/* Delete cascade */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <p className="text-xs font-semibold text-red-600 mb-2">🗑️ Suppression en Cascade</p>
                <p className="text-[10px] text-gray-600 mb-2">
                  Lors de la suppression d'un cours :
                </p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">course</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">documents</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">chunks</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded">fichiers PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
