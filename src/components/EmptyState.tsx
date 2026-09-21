interface EmptyStateProps {
  onCreateCourse: () => void;
}

export default function EmptyState({ onCreateCourse }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center mb-6 animate-float">
        <svg className="w-12 h-12 text-cyan-neon/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">Aucun cours pour le moment</h3>
      
      {/* Description */}
      <p className="text-sm text-text-muted text-center max-w-xs mb-8 leading-relaxed">
        Commencez par créer votre premier cours et importez vos documents pour démarrer avec Legba Note.
      </p>

      {/* Action Button */}
      <button
        onClick={onCreateCourse}
        className="glass-button rounded-xl px-6 py-3 text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <svg className="w-5 h-5 text-cyan-neon" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Créer mon premier cours</span>
      </button>

      {/* Help Text */}
      <div className="mt-8 glass-card rounded-xl p-4 max-w-sm border border-white/10">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-metallic-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <div>
            <p className="text-xs font-medium text-white mb-1">Comment ça marche ?</p>
            <ul className="text-[10px] text-text-muted space-y-1">
              <li>• Créez un cours avec un titre personnalisé</li>
              <li>• Importez vos documents (PDF, Word, Excel, Images)</li>
              <li>• Legba Note extrait et indexe automatiquement le contenu</li>
              <li>• Posez vos questions en mode vocal continu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
