import { useState } from 'react';

interface Constraint {
  id: string;
  title: string;
  icon: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  solution: string;
  metrics: { label: string; value: string }[];
}

const constraints: Constraint[] = [
  {
    id: 'ram',
    title: 'Mémoire RAM (8 Go)',
    icon: '🧠',
    severity: 'high',
    description: 'L\'appareil dispose de seulement 8 Go de RAM partagée avec le système d\'exploitation. Le traitement lourd (embeddings, recherche vectorielle complexe) doit être évité localement.',
    solution: 'Déléguer les embeddings à l\'API Gemini. Utiliser SQLite FTS5 (léger) pour la recherche locale. Limiter les chunks en mémoire à 3 à la fois.',
    metrics: [
      { label: 'RAM disponible app', value: '~2-3 Go' },
      { label: 'Taille max chunk', value: '4000 car.' },
      { label: 'Chunks en mémoire', value: '3 max' },
    ],
  },
  {
    id: 'storage',
    title: 'Stockage Local',
    icon: '💾',
    severity: 'medium',
    description: 'Espace de stockage limité sur l\'appareil. Les PDF et les chunks indexés doivent être gérés efficacement.',
    solution: 'Compression des chunks. Suppression des fichiers source après indexation. Limite de 500 Mo pour la base de données locale.',
    metrics: [
      { label: 'Limite DB', value: '500 Mo' },
      { label: 'Compression chunks', value: '~60%' },
      { label: 'Max documents', value: '~200 PDF' },
    ],
  },
  {
    id: 'network',
    title: 'Connectivité Réseau',
    icon: '📡',
    severity: 'medium',
    description: 'L\'accès à Gemini API nécessite une connexion internet. En mode hors-ligne, l\'app doit rester fonctionnelle pour la consultation.',
    solution: 'Cache des dernières réponses. Mode hors-ligne pour la navigation. File d\'attente de questions pour envoi différé.',
    metrics: [
      { label: 'Cache réponses', value: '50 dernières' },
      { label: 'Timeout API', value: '30 sec' },
      { label: 'Retry max', value: '3 tentatives' },
    ],
  },
  {
    id: 'battery',
    title: 'Consommation Batterie',
    icon: '🔋',
    severity: 'low',
    description: 'La capture audio continue et les appels API fréquents peuvent drainer la batterie rapidement.',
    solution: 'Speech-to-Text via service natif optimisé. Mode économie : réduction de la fréquence de polling. Wake-lock uniquement pendant la capture.',
    metrics: [
      { label: 'Capture audio', value: '~5% / 30min' },
      { label: 'Appel API', value: '~1% / requête' },
      { label: 'Veille', value: '<0.5% / heure' },
    ],
  },
  {
    id: 'latency',
    title: 'Latence Perçue',
    icon: '⏱️',
    severity: 'medium',
    description: 'L\'utilisateur attend une réponse rapide. Le pipeline complet (STT → recherche → API → TTS) peut prendre 5-10 secondes.',
    solution: 'Streaming de la réponse Gemini (token par token). Recherche locale instantanée (<100ms). Feedback visuel à chaque étape.',
    metrics: [
      { label: 'STT local', value: '~1-2s' },
      { label: 'Recherche FTS', value: '<100ms' },
      { label: 'Gemini API', value: '~2-5s' },
    ],
  },
];

export default function ConstraintsView() {
  const [selectedConstraint, setSelectedConstraint] = useState<string>('ram');
  const activeConstraint = constraints.find(c => c.id === selectedConstraint)!;

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Contraintes</h2>
        <p className="text-gray-500 text-sm">Optimisations pour appareils à ressources limitées (8 Go RAM)</p>
      </div>

      {/* RAM Budget Visual */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Budget Mémoire (8 Go Total)</h3>
        
        <div className="space-y-3">
          {/* RAM Bar */}
          <div className="relative h-10 bg-gray-100 rounded-xl overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-red-200 rounded-l-xl" style={{width: '35%'}}>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-red-700">Système OS (2.8 Go)</span>
            </div>
            <div className="absolute inset-y-0 bg-amber-200" style={{left: '35%', width: '15%'}}>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-amber-700">Services (1.2 Go)</span>
            </div>
            <div className="absolute inset-y-0 bg-caribbean/60" style={{left: '50%', width: '25%'}}>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white">Legba Note (2 Go)</span>
            </div>
            <div className="absolute inset-y-0 bg-green-200 rounded-r-xl" style={{left: '75%', width: '25%'}}>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-green-700">Libre (2 Go)</span>
            </div>
          </div>

          {/* App RAM Breakdown */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'UI Rendering', value: '400 Mo', color: 'bg-caribbean' },
              { label: 'SQLite + FTS', value: '300 Mo', color: 'bg-sun' },
              { label: 'Audio Buffer', value: '200 Mo', color: 'bg-indigo' },
              { label: 'App Logic', value: '1.1 Go', color: 'bg-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="bg-sand-light rounded-xl p-3 text-center">
                <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-1.5`}></div>
                <p className="text-sm font-bold text-gray-800">{item.value}</p>
                <p className="text-[10px] text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Constraints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Constraint List */}
        <div className="lg:col-span-1 space-y-2 animate-fade-in-left">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Contraintes Identifiées</h3>
          {constraints.map((constraint) => (
            <button
              key={constraint.id}
              onClick={() => setSelectedConstraint(constraint.id)}
              className={`w-full text-left rounded-xl p-3.5 border-2 transition-all duration-300 ${
                selectedConstraint === constraint.id
                  ? 'bg-white border-indigo/30 shadow-md'
                  : 'bg-white/50 border-transparent hover:bg-white hover:border-sand-dark/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{constraint.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{constraint.title}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      constraint.severity === 'high' ? 'bg-red-400' :
                      constraint.severity === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                    }`}></span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">{constraint.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Constraint Detail */}
        <div className="lg:col-span-2 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeConstraint.icon}</span>
              <div>
                <h4 className="text-base font-bold text-gray-800">{activeConstraint.title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeConstraint.severity === 'high' ? 'bg-red-50 text-red-600' :
                  activeConstraint.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                }`}>
                  {activeConstraint.severity === 'high' ? 'Critique' : activeConstraint.severity === 'medium' ? 'Important' : 'Mineur'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1.5">Problème</p>
                <p className="text-sm text-gray-600 bg-red-50/50 rounded-xl p-3 border border-red-100">{activeConstraint.description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1.5">Solution Adoptée</p>
                <p className="text-sm text-gray-600 bg-green-50/50 rounded-xl p-3 border border-green-100">{activeConstraint.solution}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Métriques Cibles</p>
                <div className="grid grid-cols-3 gap-2">
                  {activeConstraint.metrics.map((metric, i) => (
                    <div key={i} className="bg-sand-light rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-indigo">{metric.value}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Strategies */}
      <div className="bg-gradient-to-br from-indigo/5 to-caribbean/5 rounded-2xl p-6 border border-indigo/10 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Stratégies d'Optimisation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Traitement Léger Local',
              items: ['SQLite FTS5 (pas de vector DB)', 'Chunks de 2-4K car. max', 'Top-3 résultats seulement', 'Pas d\'embedding local'],
              icon: '🪶',
            },
            {
              title: 'Délégation Cloud',
              items: ['Embeddings via Gemini', 'Recherche sémantique lourde', 'Génération de résumé', 'Analyse contextuelle'],
              icon: '☁️',
            },
            {
              title: 'Cache Intelligent',
              items: ['50 dernières réponses', 'Chunks fréquents pré-chargés', 'Requêtes similaires détectées', 'Mode hors-ligne basique'],
              icon: '💫',
            },
          ].map((strategy, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-sand-dark/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{strategy.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{strategy.title}</span>
              </div>
              <ul className="space-y-1.5">
                {strategy.items.map((item, j) => (
                  <li key={j} className="text-xs text-gray-600 flex items-center gap-2">
                    <svg className="w-3 h-3 text-caribbean flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
