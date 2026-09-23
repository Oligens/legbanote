import { useState } from 'react';
import type { Screen } from '../App';
import EmptyState from './EmptyState';
import CreateCourseModal from './CreateCourseModal';
import ImportDocumentModal from './ImportDocumentModal';
import type { StoredCourse, StoredDocument } from '../lib/storage';

interface LibraryScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface LibraryScreenProps {
  onNavigate: (screen: Screen) => void;
  courses: StoredCourse[];
  setCourses: React.Dispatch<React.SetStateAction<StoredCourse[]>>;
}


export default function LibraryScreen({ onNavigate, courses, setCourses }: LibraryScreenProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleCreateCourse = (title: string, icon: string) => {
    const newCourse: StoredCourse = {
      id: crypto.randomUUID(),
      title,
      icon,
      documents: [],
      createdAt: new Date().toISOString(),
    };
    setCourses((items) => [...items, newCourse]);
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

  const openImportModal = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShowImportModal(true);
  };


  return (
    <div className="h-full overflow-y-auto px-4 pb-4">
      {/* Live Conversation Access */}
      <button
        onClick={() => onNavigate('live')}
        className="w-full glass-card glass-card-hover rounded-2xl px-4 py-3.5 flex items-center gap-3 mb-5 transition-all"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-neon/30 to-metallic-gold/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-neon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            </svg>
          </div>
          <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-neon/20 to-metallic-gold/20 animate-ping opacity-20" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm text-white font-medium">Legba Live</p>
          <p className="text-[10px] text-text-muted">Conversation vocale continue</p>
        </div>
        <div className="flex items-center gap-1.5 bg-cyan-neon/10 px-2.5 py-1 rounded-full border border-cyan-neon/20">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-pulse"></div>
          <span className="text-[10px] font-medium text-cyan-neon">Actif</span>
        </div>
      </button>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Mes Cours</h2>
        <span className="text-xs text-cyan-neon font-medium">{courses.length} cours</span>
      </div>

      {/* Empty State or Course Grid */}
      {courses.length === 0 ? (
        <EmptyState onCreateCourse={() => setShowCreateModal(true)} />
      ) : (
        <>
          {/* Course Cards Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className={`glass-card glass-card-hover rounded-2xl p-4 bg-gradient-to-br ${course.gradient} border ${course.border} transition-all animate-fade-in-up relative`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-3 backdrop-blur-sm">
                  {course.icon}
                </div>
                <h3 className="text-xs font-semibold text-white mb-1 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[10px] text-text-muted">{course.documents.length} docs</span>
                </div>
                
                {/* Import Button */}
                <button
                  onClick={() => openImportModal(course.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add Course Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full glass-card rounded-2xl p-4 border border-dashed border-white/20 hover:border-cyan-neon/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 text-cyan-neon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-white/70">Ajouter un cours</span>
          </button>
        </>
      )}

      {/* Floating Add Button */}
      {courses.length > 0 && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-28 right-5 w-14 h-14 glass-button-gold rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center justify-center hover:scale-110 transition-transform z-50"
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCourse}
        />
      )}

      {showImportModal && selectedCourseId && (
        <ImportDocumentModal
          courseId={selectedCourseId}
          onClose={() => {
            setShowImportModal(false);
            setSelectedCourseId(null);
          }}
          onImport={handleImportDocument}
        />
      )}
    </div>
  );
}
