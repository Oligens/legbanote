import { useState } from 'react';

interface FileFormat {
  name: string;
  extension: string;
  icon: string;
  color: string;
  description: string;
  method: string;
}

const supportedFormats: FileFormat[] = [
  {
    name: 'PDF',
    extension: '.pdf',
    icon: '📄',
    color: 'from-red-500/20 to-red-600/20',
    description: 'Documents PDF avec extraction page par page',
    method: 'pdfx / flutter_pdf_text',
  },
  {
    name: 'Word',
    extension: '.docx',
    icon: '📝',
    color: 'from-blue-500/20 to-blue-600/20',
    description: 'Documents Word avec parsing XML',
    method: 'archive + XML parser',
  },
  {
    name: 'Excel',
    extension: '.xlsx',
    icon: '📊',
    color: 'from-green-500/20 to-green-600/20',
    description: 'Tableurs Excel avec toutes les feuilles',
    method: 'excel package',
  },
  {
    name: 'CSV',
    extension: '.csv',
    icon: '📋',
    color: 'from-yellow-500/20 to-yellow-600/20',
    description: 'Fichiers CSV convertis en texte',
    method: 'Lecture directe',
  },
  {
    name: 'Texte',
    extension: '.txt, .md',
    icon: '📃',
    color: 'from-gray-500/20 to-gray-600/20',
    description: 'Fichiers texte simples et Markdown',
    method: 'Lecture directe',
  },
  {
    name: 'Images',
    extension: '.png, .jpg',
    icon: '🖼️',
    color: 'from-purple-500/20 to-purple-600/20',
    description: 'OCR local avec Google ML Kit',
    method: 'google_mlkit_text_recognition',
  },
  {
    name: 'Archives',
    extension: '.zip, .tar',
    icon: '📦',
    color: 'from-orange-500/20 to-orange-600/20',
    description: 'Extraction récursive de tous les documents',
    method: 'archive + extraction récursive',
  },
];

export default function UniversalImportDemo() {
  const [selectedFormat, setSelectedFormat] = useState<FileFormat | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importLogs, setImportLogs] = useState<string[]>([]);

  const simulateImport = async (format: FileFormat) => {
    setImporting(true);
    setImportProgress(0);
    setImportLogs([]);
    setSelectedFormat(format);

    const logs = [
      `📥 Détection du format: ${format.name} (${format.extension})`,
      `🔍 MIME type: application/${format.extension.replace('.', '')}`,
      `📁 Copie vers répertoire sécurisé: legba_docs/course_1/`,
      `⚙️ Extraction du texte via: ${format.method}`,
    ];

    if (format.name === 'Images') {
      logs.push('🔍 OCR Google ML Kit initialisé');
      logs.push('👁️ Analyse de l\'image en cours...');
      logs.push('✅ Texte reconnu: 847 caractères');
    } else if (format.name === 'Archives') {
      logs.push('📦 Décompression de l\'archive...');
      logs.push('📄 Fichier 1 trouvé: cours1.pdf');
      logs.push('📄 Fichier 2 trouvé: notes.docx');
      logs.push('📄 Fichier 3 trouvé: data.xlsx');
      logs.push('✅ 3 documents extraits et traités');
    } else {
      logs.push(`✅ Texte extrait: ${Math.floor(Math.random() * 5000 + 2000)} caractères`);
    }

    logs.push('✂️ Chunking sémantique: 2000-4000 caractères par chunk');
    logs.push(`✅ ${Math.floor(Math.random() * 15 + 5)} chunks créés`);
    logs.push('🔍 Indexation FTS5 dans SQLite...');
    logs.push('✅ Document importé et indexé avec succès');

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setImportLogs(prev => [...prev, logs[i]]);
      setImportProgress(((i + 1) / logs.length) * 100);
    }

    setImporting(false);
  };

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 space-y-4">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-metallic-gold/10 to-orange-500/5 border border-metallic-gold/20 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-metallic-gold/20 flex items-center justify-center border border-metallic-gold/30">
            <svg className="w-5 h-5 text-metallic-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Importation Universelle</h3>
            <p className="text-[10px] text-text-muted">Tous les formats de documents supportés</p>
          </div>
        </div>
      </div>

      {/* Supported Formats Grid */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        {supportedFormats.map((format) => (
          <button
            key={format.name}
            onClick={() => !importing && simulateImport(format)}
            disabled={importing}
            className={`glass-card rounded-xl p-3 border border-white/10 bg-gradient-to-br ${format.color} transition-all hover:scale-[1.02] hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{format.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-white">{format.name}</p>
                <p className="text-[9px] text-text-muted">{format.extension}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Import Progress */}
      {importing && selectedFormat && (
        <div className="glass-card rounded-2xl p-4 border border-cyan-neon/20 bg-cyan-neon/5 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{selectedFormat.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">Importation en cours</p>
              <p className="text-[10px] text-text-muted">{selectedFormat.name} {selectedFormat.extension}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-cyan-neon">{Math.round(importProgress)}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-cyan-neon to-metallic-gold transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            />
          </div>

          {/* Logs */}
          <div className="bg-black/30 rounded-xl p-3 max-h-40 overflow-y-auto">
            <div className="space-y-1">
              {importLogs.map((log, i) => (
                <p key={i} className="text-[10px] text-white/70 font-mono leading-relaxed animate-fade-in">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Import Complete */}
      {!importing && importLogs.length > 0 && selectedFormat && (
        <div className="glass-card rounded-2xl p-4 border border-emerald-400/20 bg-emerald-500/5 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs font-bold text-emerald-400">Importation réussie !</span>
          </div>
          <div className="bg-black/30 rounded-xl p-3 max-h-40 overflow-y-auto">
            <div className="space-y-1">
              {importLogs.map((log, i) => (
                <p key={i} className="text-[10px] text-white/70 font-mono leading-relaxed">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <h4 className="text-xs font-bold text-white mb-3">Pipeline d'Importation</h4>
        <div className="space-y-2">
          {[
            { step: '1', label: 'Détection du format', icon: '🔍', detail: 'MIME type + extension' },
            { step: '2', label: 'Copie sécurisée', icon: '📁', detail: 'legba_docs/course_X/' },
            { step: '3', label: 'Extraction texte', icon: '⚙️', detail: 'Parseur spécifique au format' },
            { step: '4', label: 'Chunking sémantique', icon: '✂️', detail: '2000-4000 caractères' },
            { step: '5', label: 'Indexation FTS5', icon: '🔍', detail: 'SQLite plein texte' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-cyan-neon/20 flex items-center justify-center text-[10px] font-bold text-cyan-neon">
                {item.step}
              </div>
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-white">{item.label}</p>
                <p className="text-[9px] text-text-muted">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OCR Special Case */}
      <div className="glass-card rounded-2xl p-4 border border-purple-400/20 bg-purple-500/5 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className="flex items-start gap-2">
          <span className="text-xl">🖼️</span>
          <div>
            <p className="text-[10px] text-purple-400 font-bold mb-1">OCR Local pour Images</p>
            <p className="text-[9px] text-white/60 leading-relaxed">
              Google ML Kit Text Recognition extrait le texte des images PNG/JPG directement sur l'appareil. 
              Aucun envoi cloud - 100% local et privé. Supporte le français, l'anglais et le créole.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
