import { useState } from 'react';

type SecurityTab = 'encryption' | 'ram' | 'audit';

export default function SecurityView() {
  const [activeTab, setActiveTab] = useState<SecurityTab>('encryption');

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sécurité & Optimisation Mémoire</h2>
        <p className="text-gray-500 text-sm">Chiffrement SQLCipher, optimisation pour 8 Go RAM, requêtes FTS5 en &lt;100ms</p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        {[
          { label: 'Chiffrement', value: 'AES-256', icon: '🔐', color: 'bg-indigo/5 border-indigo/20' },
          { label: 'Hash MDP', value: 'Argon2id', icon: '🔑', color: 'bg-red-50 border-red-200' },
          { label: 'Recherche', value: '<100ms', icon: '⚡', color: 'bg-caribbean/5 border-caribbean/20' },
          { label: 'RAM Max', value: '2 Go', icon: '🧠', color: 'bg-sun/5 border-sun/20' },
        ].map((card, i) => (
          <div key={i} className={`${card.color} border rounded-xl p-4 text-center`}>
            <span className="text-xl block mb-1">{card.icon}</span>
            <p className="text-sm font-bold text-gray-800">{card.value}</p>
            <p className="text-[10px] text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        {[
          { id: 'encryption' as SecurityTab, label: 'Chiffrement SQLCipher', icon: '🔐' },
          { id: 'ram' as SecurityTab, label: 'Optimisation RAM', icon: '⚡' },
          { id: 'audit' as SecurityTab, label: 'Audit Sécurité', icon: '🛡️' },
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

      {/* Encryption Tab */}
      {activeTab === 'encryption' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* SQLCipher Config */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo/10 flex items-center justify-center text-xs">🔐</span>
              Configuration SQLCipher
            </h4>
            <div className="space-y-3">
              {[
                { param: 'cipher', value: 'aes-256', desc: 'Algorithme de chiffrement' },
                { param: 'key_length', value: '32 bytes (256 bits)', desc: 'Longueur de la clé' },
                { param: 'pbkdf2_iterations', value: '256 000', desc: 'Itérations dérivation clé' },
                { param: 'hmac_algorithm', value: 'HMAC-SHA512', desc: 'Intégrité des données' },
                { param: 'plaintext_header_size', value: '0', desc: 'Pas d\'en-tête en clair' },
                { param: 'kdf_algorithm', value: 'PBKDF2-HMAC-SHA512', desc: 'Fonction de dérivation' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-sand-light/50 rounded-lg">
                  <div>
                    <p className="text-xs font-mono font-medium text-indigo">{item.param}</p>
                    <p className="text-[9px] text-gray-400">{item.desc}</p>
                  </div>
                  <span className="text-xs font-mono text-caribbean bg-caribbean/5 px-2 py-0.5 rounded">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Encryption Code */}
          <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">database_init.dart</span>
              <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full">Dart</span>
            </div>
            <div className="p-4 bg-gray-950 overflow-x-auto max-h-[450px] overflow-y-auto">
              <pre className="code-block text-gray-300 whitespace-pre">{`import 'package:sqflite_sqlcipher/sqflite.dart';
import 'package:flutter_secure_storage/
    flutter_secure_storage.dart';

class DatabaseInitializer {
  static const String DB_NAME = 'legba_note.db';
  static const int DB_VERSION = 1;
  
  final FlutterSecureStorage _secureStorage = 
      const FlutterSecureStorage();

  /// Initialiser la base chiffrée SQLCipher
  Future<Database> initialize() async {
    final dbPath = await _getDatabasePath();
    
    // Récupérer/générer la clé de chiffrement
    final encryptionKey = await _getOrCreateKey();
    
    final db = await openDatabase(
      dbPath,
      version: DB_VERSION,
      password: encryptionKey,  // SQLCipher
      onCreate: _createTables,
      onConfigure: _configureCipher,
    );
    
    return db;
  }

  /// Configuration SQLCipher optimale
  Future<void> _configureCipher(Database db) async {
    await db.execute('''
      PRAGMA cipher_compatibility = 4;
    ''');
    // cipher_compatibility = 4 active :
    // - AES-256-CBC
    // - PBKDF2-HMAC-SHA512 (256k iterations)
    // - HMAC-SHA512
  }

  /// Récupérer ou créer la clé de chiffrement
  Future<String> _getOrCreateKey() async {
    // Tenter de lire depuis Secure Storage
    String? key = await _secureStorage.read(
      key: 'db_encryption_key',
    );
    
    if (key == null) {
      // Générer une clé aléatoire de 32 bytes
      final bytes = List<int>.generate(
        32, (_) => Random.secure().nextInt(256)
      );
      key = base64.encode(bytes);
      
      // Stocker de manière sécurisée
      await _secureStorage.write(
        key: 'db_encryption_key',
        value: key,
        aOptions: AndroidOptions(
          encryptedSharedPreferences: true,
        ),
        iOptions: IOSOptions(
          accessibility: 
            KeychainAccessibility
              .whenUnlockedThisDeviceOnly,
        ),
      );
    }
    
    return key;
  }

  /// Créer toutes les tables
  Future<void> _createTables(
    Database db, int version
  ) async {
    // Table users
    await db.execute('''
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        biometric_enabled INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    ''');

    // Table courses
    await db.execute('''
      CREATE TABLE courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT DEFAULT 'general',
        icon TEXT DEFAULT '📖',
        total_chapters INTEGER DEFAULT 0,
        total_chunks INTEGER DEFAULT 0,
        color TEXT DEFAULT '#0077B6',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    ''');

    // Table documents
    await db.execute('''
      CREATE TABLE documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL UNIQUE,
        file_size INTEGER NOT NULL,
        mime_type TEXT DEFAULT 'application/pdf',
        page_count INTEGER DEFAULT 0,
        text_extracted INTEGER DEFAULT 0,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id)
          ON DELETE CASCADE
      )
    ''');

    // Table chunks
    await db.execute('''
      CREATE TABLE chunks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        chunk_text TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        page_number INTEGER,
        chapter_title TEXT,
        char_start INTEGER,
        char_end INTEGER,
        word_count INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents(id)
          ON DELETE CASCADE
      )
    ''');

    // Table FTS5 (recherche plein texte)
    await db.execute('''
      CREATE VIRTUAL TABLE chunks_fts 
      USING fts5(
        chunk_text,
        document_id UNINDEXED,
        chapter_title UNINDEXED,
        chunk_index UNINDEXED,
        page_number UNINDEXED,
        tokenize='unicode61'
      )
    ''');

    // Table history
    await db.execute('''
      CREATE TABLE history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        source_chunks TEXT,
        sources_display TEXT,
        is_saved INTEGER DEFAULT 0,
        tokens_used INTEGER DEFAULT 0,
        latency_ms INTEGER DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    ''');
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* RAM Optimization Tab */}
      {activeTab === 'ram' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* RAM Budget */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Budget Mémoire — 8 Go RAM</h4>
            
            {/* Visual RAM allocation */}
            <div className="mb-4">
              <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-red-200 flex items-center justify-center" style={{width: '35%'}}>
                  <span className="text-[9px] font-medium text-red-700">OS + Services (2.8 Go)</span>
                </div>
                <div className="absolute inset-y-0 bg-indigo/70 flex items-center justify-center text-white" style={{left: '35%', width: '25%'}}>
                  <span className="text-[9px] font-medium">Legba Note (2 Go)</span>
                </div>
                <div className="absolute inset-y-0 bg-green-200 flex items-center justify-center" style={{left: '60%', width: '40%'}}>
                  <span className="text-[9px] font-medium text-green-700">Disponible (3.2 Go)</span>
                </div>
              </div>
            </div>

            {/* App RAM breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: 'UI Flutter', value: '400 Mo', percent: 20, color: 'bg-caribbean' },
                { label: 'SQLite + FTS', value: '300 Mo', percent: 15, color: 'bg-sun' },
                { label: 'Audio Buffer', value: '150 Mo', percent: 7.5, color: 'bg-indigo' },
                { label: 'Chunks mémoire', value: '150 Mo', percent: 7.5, color: 'bg-emerald-500' },
                { label: 'App Logic', value: '1 Go', percent: 50, color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="bg-sand-light rounded-xl p-3 text-center">
                  <div className={`w-full h-1.5 ${item.color} rounded-full mb-2 opacity-60`} style={{width: `${item.percent}%`, minWidth: '20px', margin: '0 auto 8px'}}></div>
                  <p className="text-sm font-bold text-gray-800">{item.value}</p>
                  <p className="text-[9px] text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Recherche FTS5 Optimisée',
                icon: '⚡',
                items: [
                  'Index FTS5 avec tokenizer unicode61',
                  'BM25 ranking natif SQLite',
                  'LIMIT 3 systématique',
                  'UNINDEXED sur colonnes non-recherche',
                  'Requêtes préparées (prepared statements)',
                  'Temps cible : < 100ms',
                ],
                color: 'border-caribbean/20 bg-caribbean/5',
              },
              {
                title: 'Gestion des Chunks en Mémoire',
                icon: '🧩',
                items: [
                  'Max 3 chunks chargés simultanément',
                  'Libération après envoi à Gemini',
                  'Pas de cache de tous les chunks',
                  'Stream reading pour gros documents',
                  'GC explicite après traitement PDF',
                  'Pool de connexions SQLite limité à 1',
                ],
                color: 'border-indigo/20 bg-indigo/5',
              },
              {
                title: 'Optimisation Audio',
                icon: '🎙️',
                items: [
                  'Buffer audio circulaire (fixe 2 Mo)',
                  'STT via service OS (pas de buffer app)',
                  'TTS segmenté (max 200 car./segment)',
                  'Release du micro après chaque question',
                  'Pas de stockage audio persistant',
                ],
                color: 'border-sun/20 bg-sun/5',
              },
              {
                title: 'Stratégie API Gemini',
                icon: '🤖',
                items: [
                  'Prompt max ~1500 tokens',
                  'Streaming réponse (token par token)',
                  'Timeout 30s avec retry (3 max)',
                  'Pas de stockage réponse brute longue',
                  'Compression gzip des requêtes',
                  'Connection pooling (1 connexion)',
                ],
                color: 'border-emerald-200 bg-emerald-50/50',
              },
            ].map((strategy, i) => (
              <div key={i} className={`rounded-xl p-4 border ${strategy.color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{strategy.icon}</span>
                  <span className="text-xs font-bold text-gray-700">{strategy.title}</span>
                </div>
                <ul className="space-y-1.5">
                  {strategy.items.map((item, j) => (
                    <li key={j} className="text-[10px] text-gray-600 flex items-center gap-2">
                      <svg className="w-3 h-3 text-caribbean flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Query Performance */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Performance des Requêtes</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-sand-dark/20">
                    <th className="text-left py-2 px-3 text-gray-500 font-semibold">Opération</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-semibold">Temps Cible</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-semibold">RAM</th>
                    <th className="text-left py-2 px-3 text-gray-500 font-semibold">Technique</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { op: 'Recherche FTS5 (top-3)', time: '< 50ms', ram: '~5 Mo', tech: 'BM25 + LIMIT 3' },
                    { op: 'Insertion 100 chunks', time: '< 500ms', ram: '~20 Mo', tech: 'Batch insert' },
                    { op: 'Extraction texte PDF (50p)', time: '< 3s', ram: '~80 Mo', tech: 'Stream page par page' },
                    { op: 'Chargement liste cours', time: '< 10ms', ram: '~2 Mo', tech: 'Index sur user_id' },
                    { op: 'Suppression cascade cours', time: '< 200ms', ram: '~10 Mo', tech: 'ON DELETE CASCADE' },
                    { op: 'Historique (20 entrées)', time: '< 15ms', ram: '~3 Mo', tech: 'Index timestamp DESC' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-sand-dark/10">
                      <td className="py-2.5 px-3 font-medium text-gray-700">{row.op}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-medium">{row.time}</span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-500">{row.ram}</td>
                      <td className="py-2.5 px-3 text-gray-500">{row.tech}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Security Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Security Checklist */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">🛡️ Checklist de Sécurité</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  category: 'Données au Repos',
                  items: [
                    { label: 'SQLCipher AES-256 activé', status: 'done' },
                    { label: 'Clé dans Secure Enclave/KeyStore', status: 'done' },
                    { label: 'Hash Argon2id (m=65536, t=3, p=4)', status: 'done' },
                    { label: 'Salt unique 16 bytes par utilisateur', status: 'done' },
                    { label: 'Fichiers PDF en répertoire isolé', status: 'done' },
                  ],
                },
                {
                  category: 'Données en Transit',
                  items: [
                    { label: 'HTTPS/TLS 1.3 pour Gemini API', status: 'done' },
                    { label: 'API key dans Secure Storage', status: 'done' },
                    { label: 'Pas de logs de données sensibles', status: 'done' },
                    { label: 'Certificate pinning (optionnel)', status: 'todo' },
                    { label: 'Seul le prompt sort de l\'appareil', status: 'done' },
                  ],
                },
                {
                  category: 'Authentification',
                  items: [
                    { label: 'Comparaison à temps constant', status: 'done' },
                    { label: 'Rate limiting (5 tentatives/15min)', status: 'done' },
                    { label: 'Lockout progressif', status: 'done' },
                    { label: 'Biométrie via local_auth', status: 'done' },
                    { label: 'Session en mémoire uniquement', status: 'done' },
                  ],
                },
                {
                  category: 'Architecture',
                  items: [
                    { label: 'Aucun serveur tiers (sauf Gemini)', status: 'done' },
                    { label: 'Pas de Firebase/Analytics', status: 'done' },
                    { label: 'Pas de telemetry/télémétrie', status: 'done' },
                    { label: 'Permissions minimales Android/iOS', status: 'todo' },
                    { label: 'Code obfusqué en release', status: 'todo' },
                  ],
                },
              ].map((section, i) => (
                <div key={i} className="bg-sand-light/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-700 mb-3">{section.category}</p>
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-[10px] text-gray-600">
                        {item.status === 'done' ? (
                          <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        )}
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Model */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Modèle de Menaces</h4>
            <div className="space-y-3">
              {[
                {
                  threat: 'Vol/perte du téléphone',
                  risk: 'Élevé',
                  mitigation: 'SQLCipher + clé dans Secure Enclave. Sans biométrie/PIN, données illisibles.',
                  riskColor: 'bg-red-100 text-red-600',
                },
                {
                  threat: 'Extraction physique de la mémoire',
                  risk: 'Moyen',
                  mitigation: 'AES-256 avec PBKDF2 (256k itérations). Coût computationnel prohibitif.',
                  riskColor: 'bg-amber-100 text-amber-600',
                },
                {
                  threat: 'Interception réseau (Gemini API)',
                  risk: 'Faible',
                  mitigation: 'TLS 1.3 obligatoire. Seul le prompt (sans documents bruts) transite.',
                  riskColor: 'bg-green-100 text-green-600',
                },
                {
                  threat: 'Application malveillante accédant aux fichiers',
                  risk: 'Faible',
                  mitigation: 'Sandboxing OS (Android/iOS). Répertoire privé non accessible aux autres apps.',
                  riskColor: 'bg-green-100 text-green-600',
                },
                {
                  threat: 'Brute-force du mot de passe',
                  risk: 'Faible',
                  mitigation: 'Argon2id (64MB RAM, 3 itérations). Rate limiting + lockout progressif.',
                  riskColor: 'bg-green-100 text-green-600',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-sand-light/50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium text-gray-700">{item.threat}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.riskColor}`}>{item.risk}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">{item.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-gradient-to-r from-indigo/5 to-caribbean/5 rounded-2xl p-6 border border-indigo/10">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Permissions Minimales Requises</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { perm: 'RECORD_AUDIO', reason: 'Speech-to-Text pour questions vocales', platform: 'Android' },
                { perm: 'USE_BIOMETRIC', reason: 'Authentification biométrique', platform: 'Android' },
                { perm: 'INTERNET', reason: 'Appels API Gemini uniquement', platform: 'Android/iOS' },
                { perm: 'READ_EXTERNAL_STORAGE', reason: 'Import de fichiers PDF', platform: 'Android' },
                { perm: 'NSFaceIDUsageDescription', reason: 'Face ID pour déverrouillage', platform: 'iOS' },
                { perm: 'NSMicrophoneUsageDescription', reason: 'Capture vocale questions', platform: 'iOS' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-sand-dark/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-medium text-indigo">{item.perm}</span>
                    <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{item.platform}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
