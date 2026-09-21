import { useState } from 'react';

interface CreateCourseModalProps {
  onClose: () => void;
  onCreate: (title: string, icon: string) => void;
}

const iconOptions = ['📚', '📊', '⚖️', '🏛️', '🧠', '💼', '🔬', '📐', '🎨', '💻', '🌍', '📖'];

export default function CreateCourseModal({ onClose, onCreate }: CreateCourseModalProps) {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim(), selectedIcon);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-2xl p-6 w-full max-w-sm border border-white/20 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Nouveau Cours</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="text-xs text-text-muted mb-2 block">Titre du cours</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Droit Administratif haïtien"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-text-muted/50"
              autoFocus
              required
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-xs text-text-muted mb-2 block">Icône</label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    selectedIcon === icon
                      ? 'glass-card border border-cyan-neon/50 bg-cyan-neon/10 scale-110'
                      : 'glass-card border border-white/10 hover:border-white/20'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass-card rounded-xl py-3 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 glass-button rounded-xl py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
