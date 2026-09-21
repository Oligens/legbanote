import { Screen } from '../App';

interface LibraryScreenProps {
  onNavigate: (screen: Screen) => void;
}

const courses = [
  { id: 1, title: 'Économie Globale', chapters: 12, icon: '📊', gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/20' },
  { id: 2, title: 'Droit Constitutionnel', chapters: 8, icon: '⚖️', gradient: 'from-gold-soft/20 to-amber-500/20', border: 'border-metallic-gold/20' },
  { id: 3, title: 'Histoire d\'Haïti', chapters: 15, icon: '🏛️', gradient: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-400/20' },
  { id: 4, title: 'Philosophie Moderne', chapters: 6, icon: '🧠', gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-400/20' },
];

export default function LibraryScreen({ onNavigate }: LibraryScreenProps) {
  return (
    <div className="h-full overflow-y-auto px-4 pb-4">
      {/* Search Bar */}
      <button
        onClick={() => onNavigate('chat')}
        className="w-full glass-card glass-card-hover rounded-2xl px-4 py-3.5 flex items-center gap-3 mb-5 transition-all"
      >
        <svg className="w-5 h-5 text-cyan-neon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm text-text-muted italic flex-1 text-left">Interroger ma connaissance...</span>
        <div className="flex items-center gap-1.5 bg-cyan-neon/10 px-2.5 py-1 rounded-full border border-cyan-neon/20">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-pulse"></div>
          <span className="text-[10px] font-medium text-cyan-neon">IA</span>
        </div>
      </button>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Mes Cours Actuels</h2>
        <span className="text-xs text-cyan-neon font-medium">{courses.length} cours</span>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className={`glass-card glass-card-hover rounded-2xl p-4 bg-gradient-to-br ${course.gradient} border ${course.border} transition-all animate-fade-in-up`}
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
              <span className="text-[10px] text-text-muted">{course.chapters} chapitres</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Card */}
      <div className="glass-card rounded-2xl p-4 mb-5 bg-gradient-to-r from-cyan-neon/10 to-transparent border border-cyan-neon/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-text-muted mb-1">Progression cette semaine</p>
            <p className="text-2xl font-bold text-white">73%</p>
            <p className="text-[10px] text-cyan-neon mt-0.5">+12% vs semaine dernière</p>
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-cyan-neon/30 flex items-center justify-center relative">
            <svg className="w-16 h-16 absolute inset-0 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke="url(#gradient)" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 28 * 0.73} ${2 * Math.PI * 28}`} strokeLinecap="round"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FFFF"/>
                  <stop offset="100%" stopColor="#FFD700"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xs font-bold text-white">73%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <h2 className="text-sm font-semibold text-white mb-3">Activité Récente</h2>
      <div className="space-y-2">
        {[
          { text: 'Question sur le PIB mondial', time: 'Il y a 2h', icon: '💬', color: 'bg-cyan-neon/10 border-cyan-neon/20' },
          { text: 'Chapitre 4 ajouté - Droit', time: 'Hier', icon: '📄', color: 'bg-metallic-gold/10 border-metallic-gold/20' },
          { text: 'Session de révision - Philo', time: 'Hier', icon: '📚', color: 'bg-purple-500/10 border-purple-400/20' },
        ].map((activity, i) => (
          <div key={i} className={`glass-card rounded-xl px-3 py-2.5 flex items-center gap-3 border ${activity.color} animate-fade-in-up`} style={{animationDelay: `${i * 80}ms`}}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${activity.color}`}>
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{activity.text}</p>
              <p className="text-[10px] text-text-muted">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-28 right-5 w-14 h-14 glass-button-gold rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center justify-center hover:scale-110 transition-transform z-50">
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
