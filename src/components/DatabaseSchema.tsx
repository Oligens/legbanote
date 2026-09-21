import { useState } from 'react';

interface TableSchema {
  name: string;
  description: string;
  icon: string;
  color: string;
  columns: { name: string; type: string; constraint: string; description: string }[];
  indexes?: string[];
}

const tables: TableSchema[] = [
  {
    name: 'users',
    description: 'Comptes utilisateurs locaux',
    icon: '👤',
    color: 'border-red-200 bg-red-50/30',
    columns: [
      { name: 'id', type: 'INTEGER', constraint: 'PRIMARY KEY AUTOINCREMENT', description: 'Identifiant unique' },
      { name: 'username', type: 'TEXT', constraint: 'UNIQUE NOT NULL', description: 'Nom d\'utilisateur' },
      { name: 'password_hash', type: 'TEXT', constraint: 'NOT NULL', description: 'Hash Argon2id du mot de passe' },
      { name: 'salt', type: 'TEXT', constraint: 'NOT NULL', description: 'Salt base64 (16 bytes)' },
      { name: 'biometric_enabled', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Biométrie activée' },
      { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Date de création' },
      { name: 'last_login', type: 'TIMESTAMP', constraint: '', description: 'Dernière connexion' },
    ],
  },
  {
    name: 'courses',
    description: 'Métadonnées des cours de l\'utilisateur',
    icon: '📚',
    color: 'border-caribbean/20 bg-caribbean/5',
    columns: [
      { name: 'id', type: 'INTEGER', constraint: 'PRIMARY KEY AUTOINCREMENT', description: 'Identifiant unique' },
      { name: 'user_id', type: 'INTEGER', constraint: 'NOT NULL FK→users', description: 'Propriétaire du cours' },
      { name: 'title', type: 'TEXT', constraint: 'NOT NULL', description: 'Titre du cours' },
      { name: 'description', type: 'TEXT', constraint: '', description: 'Description optionnelle' },
      { name: 'category', type: 'TEXT', constraint: 'DEFAULT \'general\'', description: 'Catégorie (math, droit, etc.)' },
      { name: 'icon', type: 'TEXT', constraint: 'DEFAULT \'📖\'', description: 'Emoji icône' },
      { name: 'total_chapters', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Nombre de chapitres' },
      { name: 'total_chunks', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Nombre de chunks indexés' },
      { name: 'color', type: 'TEXT', constraint: 'DEFAULT \'#0077B6\'', description: 'Couleur de la carte' },
      { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Date d\'ajout' },
      { name: 'updated_at', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Dernière modification' },
    ],
    indexes: ['idx_courses_user ON courses(user_id)'],
  },
  {
    name: 'documents',
    description: 'Fichiers PDF/livres importés par l\'utilisateur',
    icon: '📄',
    color: 'border-sun/20 bg-sun/5',
    columns: [
      { name: 'id', type: 'INTEGER', constraint: 'PRIMARY KEY AUTOINCREMENT', description: 'Identifiant unique' },
      { name: 'course_id', type: 'INTEGER', constraint: 'NOT NULL FK→courses', description: 'Cours associé' },
      { name: 'file_name', type: 'TEXT', constraint: 'NOT NULL', description: 'Nom original du fichier' },
      { name: 'file_path', type: 'TEXT', constraint: 'NOT NULL UNIQUE', description: 'Chemin local sécurisé' },
      { name: 'file_size', type: 'INTEGER', constraint: 'NOT NULL', description: 'Taille en bytes' },
      { name: 'mime_type', type: 'TEXT', constraint: 'DEFAULT \'application/pdf\'', description: 'Type MIME' },
      { name: 'page_count', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Nombre de pages' },
      { name: 'text_extracted', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Texte extrait (0/1)' },
      { name: 'uploaded_at', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Date d\'import' },
    ],
    indexes: ['idx_documents_course ON documents(course_id)'],
  },
  {
    name: 'chunks',
    description: 'Segments de texte indexés pour la recherche RAG',
    icon: '✂️',
    color: 'border-indigo/20 bg-indigo/5',
    columns: [
      { name: 'id', type: 'INTEGER', constraint: 'PRIMARY KEY AUTOINCREMENT', description: 'Identifiant unique' },
      { name: 'document_id', type: 'INTEGER', constraint: 'NOT NULL FK→documents', description: 'Document source' },
      { name: 'chunk_text', type: 'TEXT', constraint: 'NOT NULL', description: 'Contenu du segment (2-4K car.)' },
      { name: 'chunk_index', type: 'INTEGER', constraint: 'NOT NULL', description: 'Position séquentielle' },
      { name: 'page_number', type: 'INTEGER', constraint: '', description: 'Page source estimée' },
      { name: 'chapter_title', type: 'TEXT', constraint: '', description: 'Chapitre détecté' },
      { name: 'char_start', type: 'INTEGER', constraint: '', description: 'Position début dans le texte' },
      { name: 'char_end', type: 'INTEGER', constraint: '', description: 'Position fin dans le texte' },
      { name: 'word_count', type: 'INTEGER', constraint: '', description: 'Nombre de mots' },
      { name: 'created_at', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Date de création' },
    ],
    indexes: ['idx_chunks_document ON chunks(document_id)', 'idx_chunks_index ON chunks(chunk_index)'],
  },
  {
    name: 'chunks_fts',
    description: 'Table virtuelle FTS5 pour la recherche plein texte rapide',
    icon: '🔍',
    color: 'border-emerald-200 bg-emerald-50/50',
    columns: [
      { name: 'chunk_text', type: 'TEXT', constraint: 'FTS5 column', description: 'Contenu indexé pour recherche' },
      { name: 'document_id', type: 'INTEGER', constraint: 'UNINDEXED', description: 'Référence document' },
      { name: 'chapter_title', type: 'TEXT', constraint: 'UNINDEXED', description: 'Chapitre (non indexé)' },
      { name: 'chunk_index', type: 'INTEGER', constraint: 'UNINDEXED', description: 'Position (non indexé)' },
      { name: 'page_number', type: 'INTEGER', constraint: 'UNINDEXED', description: 'Page (non indexé)' },
    ],
    indexes: ['VIRTUAL TABLE USING fts5(tokenize=\'unicode61\')'],
  },
  {
    name: 'history',
    description: 'Historique des questions/réponses de l\'utilisateur',
    icon: '📜',
    color: 'border-purple-200 bg-purple-50/30',
    columns: [
      { name: 'id', type: 'INTEGER', constraint: 'PRIMARY KEY AUTOINCREMENT', description: 'Identifiant unique' },
      { name: 'user_id', type: 'INTEGER', constraint: 'NOT NULL FK→users', description: 'Utilisateur' },
      { name: 'question', type: 'TEXT', constraint: 'NOT NULL', description: 'Question posée (transcrite)' },
      { name: 'answer', type: 'TEXT', constraint: 'NOT NULL', description: 'Réponse générée par Gemini' },
      { name: 'source_chunks', type: 'TEXT', constraint: '', description: 'JSON : IDs des chunks utilisés' },
      { name: 'sources_display', type: 'TEXT', constraint: '', description: 'JSON : sources affichées' },
      { name: 'is_saved', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Marqué comme favori' },
      { name: 'tokens_used', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Tokens API consommés' },
      { name: 'latency_ms', type: 'INTEGER', constraint: 'DEFAULT 0', description: 'Latence de la requête' },
      { name: 'timestamp', type: 'TIMESTAMP', constraint: 'DEFAULT CURRENT_TIMESTAMP', description: 'Date/heure' },
    ],
    indexes: ['idx_history_user ON history(user_id)', 'idx_history_timestamp ON history(timestamp DESC)'],
  },
];

export default function DatabaseSchema() {
  const [selectedTable, setSelectedTable] = useState<string>('courses');
  const [showSQL, setShowSQL] = useState(false);
  const activeTable = tables.find(t => t.name === selectedTable)!;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Schéma de Base de Données</h2>
        <p className="text-gray-500 text-sm">SQLite + SQLCipher (chiffré) + FTS5 (recherche plein texte). 6 tables principales.</p>
      </div>

      {/* ER Diagram Summary */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Relations entre Tables</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tables.map((table, i) => (
            <div key={table.name} className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTable(table.name)}
                className={`rounded-xl px-4 py-3 border-2 text-center transition-all duration-300 min-w-[100px] ${
                  selectedTable === table.name
                    ? `${table.color} shadow-md scale-105`
                    : 'bg-white border-sand-dark/10 hover:border-gray-300'
                }`}
              >
                <span className="text-lg block">{table.icon}</span>
                <span className="text-[10px] font-bold text-gray-700 block mt-0.5">{table.name}</span>
                <span className="text-[9px] text-gray-400">{table.columns.length} cols</span>
              </button>
              {i < tables.length - 1 && (
                <svg className="w-4 h-4 text-gray-200 hidden lg:block" viewBox="0 0 16 16">
                  <path d="M0 8h12m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-400">
            users → courses → documents → chunks → chunks_fts | users → history
          </p>
        </div>
      </div>

      {/* Table Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-1 space-y-2 animate-fade-in-left">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Tables</h3>
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => setSelectedTable(table.name)}
              className={`w-full text-left rounded-xl p-3.5 border-2 transition-all duration-300 ${
                selectedTable === table.name
                  ? `${table.color} shadow-sm`
                  : 'bg-white/50 border-transparent hover:bg-white hover:border-sand-dark/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{table.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-700">{table.name}</p>
                  <p className="text-[10px] text-gray-500">{table.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Table Schema */}
        <div className="lg:col-span-2 animate-fade-in-up">
          <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className={`px-5 py-4 border-b ${activeTable.color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeTable.icon}</span>
                  <div>
                    <h4 className="text-base font-bold text-gray-800">{activeTable.name}</h4>
                    <p className="text-xs text-gray-500">{activeTable.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSQL(!showSQL)}
                  className="text-[10px] bg-gray-900 text-gray-300 px-3 py-1.5 rounded-lg font-mono hover:bg-gray-800 transition-colors"
                >
                  {showSQL ? 'Tableau' : 'SQL'}
                </button>
              </div>
            </div>

            {/* Content */}
            {showSQL ? (
              <div className="p-4 bg-gray-950 overflow-x-auto max-h-[500px] overflow-y-auto">
                <pre className="code-block text-green-300 whitespace-pre">{generateSQL(activeTable)}</pre>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full schema-table">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 text-left">Colonne</th>
                      <th className="py-2 px-3 text-left">Type</th>
                      <th className="py-2 px-3 text-left">Contrainte</th>
                      <th className="py-2 px-3 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTable.columns.map((col, i) => (
                      <tr key={i} className="hover:bg-sand-light/50">
                        <td className="py-2 px-3 font-mono font-medium text-indigo">{col.name}</td>
                        <td className="py-2 px-3">
                          <span className="bg-caribbean/10 text-caribbean px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {col.type}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-500 font-mono text-[10px]">{col.constraint || '—'}</td>
                        <td className="py-2 px-3 text-gray-600">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Indexes */}
            {activeTable.indexes && activeTable.indexes.length > 0 && (
              <div className="px-5 py-3 bg-sand-light/50 border-t border-sand-dark/10">
                <p className="text-[10px] font-semibold text-gray-500 mb-1">Index :</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeTable.indexes.map((idx, i) => (
                    <span key={i} className="text-[10px] bg-indigo/10 text-indigo px-2 py-0.5 rounded-full font-mono">
                      {idx}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Relationships */}
          <div className="mt-4 bg-indigo/5 rounded-xl p-4 border border-indigo/10">
            <p className="text-xs font-semibold text-indigo mb-2">🔗 Relations Clés</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-gray-600">
              <p>• <strong>users.id</strong> → courses.user_id (1:N)</p>
              <p>• <strong>courses.id</strong> → documents.course_id (1:N)</p>
              <p>• <strong>documents.id</strong> → chunks.document_id (1:N)</p>
              <p>• <strong>chunks</strong> ↔ <strong>chunks_fts</strong> (contenu synchronisé)</p>
              <p>• <strong>users.id</strong> → history.user_id (1:N)</p>
              <p>• <strong>history.source_chunks</strong> → JSON array de chunks.id</p>
            </div>
          </div>
        </div>
      </div>

      {/* FTS5 Query Example */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Requête FTS5 — Recherche RAG</h3>
        <div className="bg-gray-950 rounded-xl p-4 overflow-x-auto">
          <pre className="code-block text-green-300 whitespace-pre">{`-- Recherche des 3 chunks les plus pertinents via BM25
-- Exécutée en < 100ms pour la pipeline RAG

SELECT 
  c.id,
  c.chunk_text,
  c.chapter_title,
  c.page_number,
  co.title AS course_title,
  bm25(chunks_fts, 10.0, 1.0, 5.0) AS relevance_score
FROM chunks_fts
JOIN chunks c ON c.document_id = chunks_fts.document_id 
              AND c.chunk_index = chunks_fts.chunk_index
JOIN courses co ON co.id = (
  SELECT course_id FROM documents WHERE id = c.document_id
)
WHERE chunks_fts MATCH :query
ORDER BY bm25(chunks_fts, 10.0, 1.0, 5.0)
LIMIT 3;

-- Poids BM25 : titre chapitre x10, texte x1, page x5
-- :query = mots-clés extraits de la question utilisateur`}</pre>
        </div>
      </div>
    </div>
  );
}

function generateSQL(table: TableSchema): string {
  if (table.name === 'chunks_fts') {
    return `CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts
USING fts5(
  chunk_text,
  document_id UNINDEXED,
  chapter_title UNINDEXED,
  chunk_index UNINDEXED,
  page_number UNINDEXED,
  tokenize='unicode61'
);`;
  }

  const cols = table.columns.map(col => {
    const parts = [`  ${col.name} ${col.type}`];
    if (col.constraint) parts.push(col.constraint);
    return parts.join(' ');
  }).join(',\n');

  let sql = `CREATE TABLE IF NOT EXISTS ${table.name} (\n${cols}\n);`;
  
  if (table.indexes) {
    sql += '\n\n';
    sql += table.indexes
      .filter(idx => !idx.includes('VIRTUAL') && !idx.includes('fts5'))
      .map(idx => `CREATE INDEX IF NOT EXISTS ${idx};`)
      .join('\n');
  }

  return sql;
}
