import { useState } from 'react';
import type { Screen } from '../App';
import EmptyState from './EmptyState';
import CreateCourseModal from './CreateCourseModal';
import ImportDocumentModal from './ImportDocumentModal';
import type { StoredCourse, StoredDocument } from '../lib/storage';

interface LibraryScreenProps {
  onNavigate: (screen: Screen) => void;
  courses: StoredCourse[];
  setCourses: React.Dispatch<React.SetStateAction<StoredCourse[]>>;
}

export default function LibraryScreen({ onNavigate, courses, setCourses }: LibraryScreenProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleCreateCourse = (title: string, icon: string) => {
    setCourses((items) => [
      ...items,
      { id: crypto.randomUUID(), title, icon, documents: [], createdAt: new Date().toISOString() },
    ]);
    setShowCreateModal(false);
  };

  const handleImportDocument = (courseId: string, document: StoredDocument) => {
    setCourses((items) => items.map((course) =>
      course.id === courseId
        ? { ...course, documents: [...course.documents, document] }
        : course
    ));
    setShowImportModal(false);
    setSelectedCourseId(null);
  };

  return (
    <div className="h-full overflow-y-auto px-4 pb-4">
      <button onClick={() => onNavigate('live')} className="w-full glass-card glass-card-hover rounded-2xl px-4 py-3.5 flex items-center gap-3 mb-5 transition-all">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-neon/30 to-metallic-gold/30 flex items-center justify-center text-cyan-neon">🎙️</div>
        <div className="flex-1 text-left">
          <p className="text-sm text-white font-medium">Legba Live</p>
          <p className="text-[10px] text-text-muted">Conversation vocale mains libres</p>
        </div>
        <span className="text-[10px] font-medium text-cyan-neon">ACTIF</span>
      </button>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Mes Cours</h2>
        <span className="text-xs text-cyan-neon font-medium">{courses.length} cours</span>
      </div>

      {courses.length === 0 ? (
        <EmptyState onCreateCourse={() => setShowCreateModal(true)} />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {courses.map((course) => (
            <div key={course.id} className="glass-card rounded-2xl p-4 border border-white/10 relative">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-3">{course.icon}</div>
              <h3 className="text-xs font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-[10px] text-text-muted">{course.documents.length} document(s) indexé(s)</p>
              <button
                onClick={() => { setSelectedCourseId(course.id); setShowImportModal(true); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                aria-label="Importer un document"
              >+</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setShowCreateModal(true)} className="w-full mt-4 glass-card rounded-2xl p-4 border border-dashed border-white/20">
        <span className="text-sm text-white/70">+ Ajouter un cours</span>
      </button>

      {showCreateModal && <CreateCourseModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateCourse} />}

      {showImportModal && selectedCourseId && (
        <ImportDocumentModal
          courseId={selectedCourseId}
          onClose={() => { setShowImportModal(false); setSelectedCourseId(null); }}
          onImport={handleImportDocument}
        />
      )}
    </div>
  );
}
