import { useRef, useState } from 'react';
import { extractDocumentText } from '../lib/documentParser';
import type { StoredDocument } from '../lib/storage';

interface ImportDocumentModalProps {
  courseId: string;
  onClose: () => void;
  onImport: (courseId: string, document: StoredDocument) => void;
}

export default function ImportDocumentModal({ courseId, onClose, onImport }: ImportDocumentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!selectedFile || isProcessing) return;
    setIsProcessing(true);
    setStatus('Lecture et extraction du document…');

    try {
      const parsed = await extractDocumentText(selectedFile);
      const document: StoredDocument = {
        id: crypto.randomUUID(),
        name: selectedFile.name,
        text: parsed.text,
        createdAt: new Date().toISOString(),
        size: selectedFile.size,
        mimeType: selectedFile.type || 'application/octet-stream',
        extractionStatus: parsed.status,
        extractionMessage: parsed.message,
      };
      onImport(courseId, document);
      setStatus(parsed.message || (parsed.text.trim() ? 'Document importé et indexé.' : 'Fichier stocké ; ajoutez une description textuelle pour l’indexer.'));
    } catch (error) {
      // Last-resort guard: importing must never crash the UI.
      const document: StoredDocument = {
        id: crypto.randomUUID(),
        name: selectedFile.name,
        text: '',
        createdAt: new Date().toISOString(),
        size: selectedFile.size,
        mimeType: selectedFile.type || 'application/octet-stream',
        extractionStatus: 'failed',
        extractionMessage: 'Fichier stocké, description textuelle à compléter.',
      };
      onImport(courseId, document);
      setStatus(document.extractionMessage || 'Fichier stocké.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">Importer un document</h3>
            <p className="text-[10px] text-text-muted">PDF, Word, texte et formats inconnus — extraction locale avec fallback</p>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="w-8 h-8 rounded-full glass-card">×</button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,.csv,.json,.xml,.html,.htm,*/*"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />

        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full glass-card rounded-xl p-8 border-2 border-dashed border-white/20 text-center">
          {selectedFile ? (
            <>
              <p className="text-sm text-white break-all">{selectedFile.name}</p>
              <p className="text-[10px] text-text-muted mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </>
          ) : <p className="text-sm text-white/70">Choisir un fichier</p>}
        </button>

        {status && <p className="mt-3 text-xs text-cyan-200">{status}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} disabled={isProcessing} className="flex-1 glass-card rounded-xl py-3 text-sm">Annuler</button>
          <button onClick={handleImport} disabled={!selectedFile || isProcessing} className="flex-1 glass-button rounded-xl py-3 text-sm disabled:opacity-50">
            {isProcessing ? 'Importation…' : 'Importer'}
          </button>
        </div>
      </div>
    </div>
  );
}
