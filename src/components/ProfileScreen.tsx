import LegbaIcon from './LegbaIcon';

export default function ProfileScreen() {
  return (
    <div className="h-full overflow-y-auto bg-sand-light">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-indigo to-indigo-light px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
            <span className="text-2xl">👨‍🎓</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Jean-Baptiste</h1>
            <p className="text-xs text-white/70">Étudiant en Économie</p>
            <p className="text-[10px] text-white/50 mt-0.5">Université d'État d'Haïti</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-dark/10 grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-indigo">51</p>
            <p className="text-[10px] text-gray-400">Questions</p>
          </div>
          <div className="text-center border-x border-sand-dark/10">
            <p className="text-lg font-bold text-caribbean">5</p>
            <p className="text-[10px] text-gray-400">Cours</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-sun-dark">23h</p>
            <p className="text-[10px] text-gray-400">Étude</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 mt-5 space-y-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Paramètres</h2>
        
        {[
          { icon: '📚', label: 'Mes Documents', subtitle: '5 cours importés', action: true },
          { icon: '🎯', label: 'Objectifs d\'étude', subtitle: 'Examen dans 15 jours', action: true },
          { icon: '🔔', label: 'Notifications', subtitle: 'Rappels de révision', action: true },
          { icon: '🌙', label: 'Mode Sombre', subtitle: 'Désactivé', action: false },
          { icon: '🗣️', label: 'Langue vocale', subtitle: 'Français', action: true },
          { icon: '📊', label: 'Statistiques détaillées', subtitle: 'Progression et analyses', action: true },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-sand-dark/10 hover:shadow-sm transition-shadow"
          >
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-[10px] text-gray-400">{item.subtitle}</p>
            </div>
            {item.action && (
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="px-5 mt-6 pb-4">
        <div className="bg-indigo/5 rounded-2xl p-4 text-center">
          <LegbaIcon className="w-8 h-8 mx-auto mb-2" color="#3D1E6D" />
          <p className="text-xs font-medium text-indigo">Legba Note v1.0</p>
          <p className="text-[10px] text-gray-400 mt-1">Gardien de votre savoir</p>
          <p className="text-[10px] text-gray-300 mt-0.5">Propulsé par Gemini AI</p>
        </div>
      </div>
    </div>
  );
}
