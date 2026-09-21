import { useState, useRef } from 'react';

interface ImportDocumentModalProps {
  courseId: number;
  onClose: () => void;
  onImport: (courseId: number, fileName: string) => void;
}

export default function ImportDocumentModal({ courseId, onClose, onImport }: ImportDocumentModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    addLog(`📄 Fichier sélectionné: ${file.name}`);
    addLog(`📏 Taille: ${(file.size / 1024).toFixed(2)} KB`);
    addLog(`🔍 Type MIME: ${file.type || 'inconnu'}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setLogs([]);

    // Simulate the import pipeline
    const steps = [
      { msg: '📥 Copie vers répertoire sécurisé...', delay: 500 },
      { msg: '⚙️ Extraction du texte...', delay: 800 },
      { msg: '✂️ Chunking sémantique (2000-4000 car.)...', delay: 600 },
      { msg: '🔍 Indexation FTS5 dans SQLite...', delay: 700 },
      { msg: '✅ Document importé avec succès!', delay: 400 },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));
      addLog(steps[i].msg);
      setProgress(((i + 1) / steps.length) * 100);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    onImport(courseId, selectedFile.name);
  };

  const supportedFormats = [
    { ext: 'PDF', icon: '📄', color: 'text-red-400' },
    { ext: 'DOCX', icon: '📝', color: 'text-blue-400' },
    { ext: 'XLSX', icon: '📊', color: 'text-green-400' },
    { ext: 'TXT', icon: '📃', color: 'text-gray-400' },
    { ext: 'Images', icon: '🖼️', color: 'text-purple-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md border border-white/20 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Importer un Document</h3>
            <p className="text-[10px] text-text-muted">Tous formats supportés</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drop Zone */}
        {!isProcessing && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-card rounded-xl p-8 border-2 border-dashed cursor-pointer transition-all mb-4 ${
              isDragging
                ? 'border-cyan-neon bg-cyan-neon/10'
                : selectedFile
                ? 'border-emerald-400/50 bg-emerald-500/5'
                : 'border-white/20 hover:border-white/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              accept=".pdf,.docx,.xlsx,.xls,.csv,.txt,.md,.png,.jpg,.jpeg,.zip,.tar"
            />

            <div className="text-center">
              {selectedFile ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{selectedFile.name}</p>
                  <p className="text-[10px] text-text-muted">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full glass-card flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-cyan-neon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white mb-1">
                    {isDragging ? 'Déposez le fichier ici' : 'Cliquez ou glissez un fichier'}
                  </p>
                  <p className="text-[10px] text-text-muted">PDF, Word, Excel, Images, Archives</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Supported Formats */}
        {!isProcessing && !selectedFile && (
          <div className="mb-4">
            <p className="text-[10px] text-text-muted mb-2">Formats supportés :</p>
            <div className="flex flex-wrap gap-2">
              {supportedFormats.map((format) => (
                <div key={format.ext} className="glass-card rounded-lg px-2 py-1 flex items-center gap-1.5">
                  <span className="text-xs">{format.icon}</span>
                  <span className={`text-[10px] ${format.color}`}>{format.ext}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="mb-4">
            {/* Progress Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-cyan-neon to-metallic-gold transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Logs */}
            <div className="bg-black/30 rounded-xl p-3 max-h-40 overflow-y-auto">
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <p key={i} className="text-[10px] text-white/70 font-mono animate-fade-in">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isProcessing && (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 glass-card rounded-xl py-3 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedFile}
              className="flex-1 glass-button rounded-xl py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Importer
            </button>
          </div>
        )}

        {/* Note */}
        {!isProcessing && (
          <div className="mt-4 glass-card rounded-xl p-3 border border-metallic-gold/20 bg-metallic-gold/5">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-metallic-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p className="text-[10px] text-white/70 leading-relaxed">
                <strong className="text-white/90">Note :</strong> En version web, l'importation est simulée. 
                Sur mobile natif (Android/iOS), le fichier sera copié dans le stockage sécurisé, 
                le texte extrait, découpé en chunks et indexé dans SQLite.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
