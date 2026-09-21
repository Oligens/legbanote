import { useState } from 'react';

interface LayerInfo {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
}

const layers: LayerInfo[] = [
  {
    id: 'presentation',
    title: 'Couche Présentation',
    color: 'text-caribbean',
    bgColor: 'bg-caribbean/5',
    borderColor: 'border-caribbean/30',
    description: 'Interface utilisateur cross-platform avec composants natifs',
    technologies: ['Flutter / React Native', 'BLoC / Redux', 'Material Design 3', 'Speech-to-Text UI', 'Text-to-Speech UI'],
    responsibilities: [
      'Rendu des écrans (Bibliothèque, Conversation, Historique, Profil)',
      'Capture audio via micro natif',
      'Affichage des réponses IA avec sources',
      'Gestion des états UI (écoute, recherche, réponse)',
    ],
  },
  {
    id: 'business',
    title: 'Couche Métier',
    color: 'text-indigo',
    bgColor: 'bg-indigo/5',
    borderColor: 'border-indigo/30',
    description: 'Logique RAG, orchestration du pipeline et gestion des chunks',
    technologies: ['RAG Pipeline', 'Chunk Manager', 'Search Engine', 'Prompt Builder', 'State Machine'],
    responsibilities: [
      'Orchestration du pipeline RAG complet',
      'Découpage sémantique des documents (chunks)',
      'Recherche locale FTS dans SQLite',
      'Construction du prompt pour Gemini',
      'Gestion des états de conversation',
    ],
  },
  {
    id: 'data',
    title: 'Couche Données',
    color: 'text-sun-dark',
    bgColor: 'bg-sun/5',
    borderColor: 'border-sun/30',
    description: 'Stockage local persistant et gestion des fichiers',
    technologies: ['SQLite (sqflite/WatermelonDB)', 'FTS5 (Full Text Search)', 'File System API', 'Secure Storage'],
    responsibilities: [
      'Stockage des métadonnées des cours',
      'Indexation des chunks de texte',
      'Recherche plein texte (FTS5)',
      'Gestion des fichiers PDF uploadés',
      'Cache des réponses récentes',
    ],
  },
  {
    id: 'external',
    title: 'Services Externes',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'APIs et services cloud pour le traitement lourd',
    technologies: ['Gemini Pro API', 'Speech Recognition (OS)', 'Text-to-Speech (OS)', 'Network Layer'],
    responsibilities: [
      'Génération de réponses contextuelles (Gemini)',
      'Transcription audio → texte (natif)',
      'Synthèse vocale texte → audio (natif)',
      'Gestion des appels API avec retry',
    ],
  },
];

export default function ArchitectureView() {
  const [selectedLayer, setSelectedLayer] = useState<string>('business');

  const activeLayer = layers.find(l => l.id === selectedLayer)!;

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Architecture Technique</h2>
        <p className="text-gray-500 text-sm">Architecture en couches pour une application hybride locale + API, optimisée pour 8 Go RAM</p>
      </div>

      {/* Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stack Tech */}
        <div className="lg:col-span-1 space-y-4 animate-fade-in-left">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Stack Technologique</h3>
          
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 border border-sand-dark/15 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📱</span>
                <span className="text-sm font-semibold text-gray-700">Framework</span>
              </div>
              <p className="text-xs text-gray-500">Flutter ou React Native</p>
              <p className="text-[10px] text-gray-400 mt-1">Cross-platform Android/iOS</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/15 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🗄️</span>
                <span className="text-sm font-semibold text-gray-700">Base de Données</span>
              </div>
              <p className="text-xs text-gray-500">SQLite + FTS5</p>
              <p className="text-[10px] text-gray-400 mt-1">sqflite ou WatermelonDB</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/15 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📁</span>
                <span className="text-sm font-semibold text-gray-700">Fichiers</span>
              </div>
              <p className="text-xs text-gray-500">Application Documents Directory</p>
              <p className="text-[10px] text-gray-400 mt-1">Stockage sécurisé local</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/15 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎙️</span>
                <span className="text-sm font-semibold text-gray-700">Audio</span>
              </div>
              <p className="text-xs text-gray-500">SpeechRecognition natif</p>
              <p className="text-[10px] text-gray-400 mt-1">STT + TTS via services OS</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-sand-dark/15 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <span className="text-sm font-semibold text-gray-700">API IA</span>
              </div>
              <p className="text-xs text-gray-500">Gemini Pro</p>
              <p className="text-[10px] text-gray-400 mt-1">Génération de réponses contextuelles</p>
            </div>
          </div>
        </div>

        {/* Center: Layer Diagram */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Diagramme en Couches</h3>
          
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            {/* Layer Stack */}
            <div className="space-y-3">
              {layers.map((layer, index) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`w-full text-left rounded-xl p-4 border-2 transition-all duration-300 ${
                    selectedLayer === layer.id
                      ? `${layer.bgColor} ${layer.borderColor} shadow-md scale-[1.02]`
                      : 'bg-gray-50/50 border-transparent hover:bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-caribbean' : 
                        index === 1 ? 'bg-indigo' : 
                        index === 2 ? 'bg-sun' : 'bg-emerald-500'
                      }`}></div>
                      <span className={`text-sm font-semibold ${selectedLayer === layer.id ? layer.color : 'text-gray-600'}`}>
                        {layer.title}
                      </span>
                    </div>
                    <svg className={`w-4 h-4 transition-transform ${selectedLayer === layer.id ? 'rotate-90' : ''} ${
                      selectedLayer === layer.id ? layer.color : 'text-gray-300'
                    }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {selectedLayer === layer.id && (
                    <p className="text-xs text-gray-500 mt-2 ml-6">{layer.description}</p>
                  )}
                </button>
              ))}
            </div>

            {/* Data flow arrows */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-caribbean/20 via-indigo/20 to-sun/20"></div>
              <span className="text-[10px] text-gray-400">Flux de données bidirectionnel</span>
              <div className="h-px flex-1 bg-gradient-to-r from-sun/20 via-indigo/20 to-caribbean/20"></div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className={`rounded-2xl p-6 border-2 ${activeLayer.bgColor} ${activeLayer.borderColor} transition-all duration-300`}>
            <h4 className={`text-base font-bold ${activeLayer.color} mb-3`}>{activeLayer.title}</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeLayer.technologies.map((tech, i) => (
                    <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${activeLayer.bgColor} ${activeLayer.color} border ${activeLayer.borderColor}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Responsabilités</p>
                <ul className="space-y-1">
                  {activeLayer.responsibilities.map((resp, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                        activeLayer.id === 'presentation' ? 'bg-caribbean' :
                        activeLayer.id === 'business' ? 'bg-indigo' :
                        activeLayer.id === 'data' ? 'bg-sun' : 'bg-emerald-500'
                      }`}></span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Flux de Données Global</h3>
        <div className="overflow-x-auto">
          <div className="flex items-center gap-3 min-w-[700px]">
            {[
              { label: 'Utilisateur', icon: '👤', color: 'bg-sand' },
              { label: 'UI Layer', icon: '📱', color: 'bg-caribbean/10' },
              { label: 'Business Logic', icon: '⚙️', color: 'bg-indigo/10' },
              { label: 'SQLite + FTS', icon: '🗄️', color: 'bg-sun/10' },
              { label: 'Gemini API', icon: '🤖', color: 'bg-emerald-50' },
              { label: 'Réponse', icon: '💬', color: 'bg-sand' },
            ].map((node, i, arr) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`${node.color} rounded-xl px-4 py-3 text-center border border-sand-dark/10 min-w-[100px]`}>
                  <span className="text-xl block mb-1">{node.icon}</span>
                  <span className="text-[10px] font-medium text-gray-600">{node.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <svg className="w-6 h-4 text-gray-300 flex-shrink-0" viewBox="0 0 24 16">
                    <path d="M0 8h20m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
