export default function HistoryScreen() {
  const historyItems = [
    {
      id: 1,
      question: 'Quels sont les facteurs de la croissance économique ?',
      date: 'Aujourd\'hui, 14:32',
      source: 'Économie Globale - Chap.4',
      saved: true,
    },
    {
      id: 2,
      question: 'Explique la séparation des pouvoirs selon Montesquieu',
      date: 'Aujourd\'hui, 10:15',
      source: 'Droit Constitutionnel - Chap.2',
      saved: false,
    },
    {
      id: 3,
      question: 'Résume les causes de la Révolution de 1804',
      date: 'Hier, 21:45',
      source: 'Histoire d\'Haïti - Chap.7',
      saved: true,
    },
    {
      id: 4,
      question: 'Qu\'est-ce que l\'impératif catégorique de Kant ?',
      date: 'Hier, 16:20',
      source: 'Philosophie Moderne - Chap.3',
      saved: false,
    },
    {
      id: 5,
      question: 'Comment calculer le PIB nominal vs réel ?',
      date: '12 Jan, 09:30',
      source: 'Économie Globale - Chap.5',
      saved: true,
    },
    {
      id: 6,
      question: 'Définir la souveraineté nationale',
      date: '11 Jan, 18:45',
      source: 'Droit Constitutionnel - Chap.1',
      saved: false,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-sand-light">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-lg font-bold text-gray-800">Historique</h1>
        <p className="text-xs text-gray-400 mt-0.5">Vos conversations passées avec Legba Note</p>
      </div>

      {/* Filter tabs */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-2">
          <button className="text-xs bg-indigo text-white px-3 py-1.5 rounded-full font-medium">Tout</button>
          <button className="text-xs bg-white text-gray-500 px-3 py-1.5 rounded-full font-medium border border-sand-dark/20">Sauvegardés</button>
          <button className="text-xs bg-white text-gray-500 px-3 py-1.5 rounded-full font-medium border border-sand-dark/20">Cette semaine</button>
        </div>
      </div>

      {/* History List */}
      <div className="px-5 space-y-2.5 pb-4">
        {historyItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-sand-dark/10 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.question}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-caribbean/10 text-caribbean px-2 py-0.5 rounded-full">
                    {item.source}
                  </span>
                </div>
              </div>
              <button className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.saved ? 'bg-sun/10' : 'bg-gray-50'
              }`}>
                <svg className={`w-3.5 h-3.5 ${item.saved ? 'text-sun-dark' : 'text-gray-300'}`} fill={item.saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-sand-dark/10">
              <span className="text-[10px] text-gray-400">{item.date}</span>
              <div className="flex items-center gap-2">
                <button className="text-[10px] text-indigo font-medium">Voir</button>
                <button className="text-[10px] text-gray-400">•••</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
