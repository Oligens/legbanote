import { useRef, useState } from 'react';
import type { StoredDocument } from '../lib/storage';

interface ImportDocumentModalProps {
  courseId: string;
  onClose: () => void;
  onImport: (courseId: string, document: StoredDocument) => void;
}

function extractPdfText(bytes: Uint8Array): string {
  const binary = new TextDecoder('latin1').decode(bytes);
  const matches = [...binary.matchAll(/\(([^()]*)\)\s*Tj/g)];
  return matches
    .map((match) => match[1])
    .join(' ')
    .replace(/\\([()\\])/g, '$1')
    .replace(/\\n/g, ' ')
    .trim();
}

async function extractText(file: File): Promise<string> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.csv') || lower.endsWith('.json')) {
    return file.text();
  }
  if (lower.endsWith('.pdf')) {
    return extractPdfText(new Uint8Array(await file.arrayBuffer()));
  }
  throw new Error('Format non indexable dans cette version web. Utilisez TXT, MD, CSV, JSON ou un PDF textuel.');
}

export default function ImportDocumentModal({ courseId, onClose, onImport }: ImportDocumentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError('');

    try {
      const text = (await extractText(selectedFile)).trim();
      if (text.length < 20) {
        throw new Error('Aucun texte exploitable n’a été trouvé dans ce document.');
      }

      const document: StoredDocument = {
        id: crypto.randomUUID(),
        name: selectedFile.name,
        text,
        createdAt: new Date().toISOString(),
      };

      onImport(courseId, document);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’indexer le document.');
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
            <p className="text-[10px] text-text-muted">Extraction locale puis indexation RAG</p>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="w-8 h-8 rounded-full glass-card">×</button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.csv,.json,.pdf"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full glass-card rounded-xl p-8 border-2 border-dashed border-white/20 text-center"
        >
          {selectedFile ? (
            <>
              <p className="text-sm text-white">{selectedFile.name}</p>
              <p className="text-[10px] text-text-muted mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <p className="text-sm text-white/70">Choisir un fichier</p>
          )}
        </button>

        {error && <p className="mt-3 text-xs text-red-300">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} disabled={isProcessing} className="flex-1 glass-card rounded-xl py-3 text-sm">Annuler</button>
          <button onClick={handleImport} disabled={!selectedFile || isProcessing} className="flex-1 glass-button rounded-xl py-3 text-sm disabled:opacity-50">
            {isProcessing ? 'Indexation…' : 'Importer et indexer'}
          </button>
        </div>
      </div>
    </div>
  );
}
