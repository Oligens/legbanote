import { useState } from 'react';

type PipelineMode = 'upload' | 'query';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
  color: string;
}

const uploadSteps: Step[] = [
  {
    id: 1,
    title: 'Upload du PDF',
    description: 'L\'utilisateur sélectionne un fichier PDF depuis son appareil',
    icon: '📄',
    details: [
      'Sélection via file picker natif',
      'Copie vers ApplicationDocumentsDirectory',
      'Vérification du format et taille',
      'Stockage sécurisé (chiffrement optionnel)',
    ],
    color: 'bg-caribbean',
  },
  {
    id: 2,
    title: 'Extraction du Texte',
    description: 'Un script local extrait le contenu textuel du PDF',
    icon: '📝',
    details: [
      'Utilisation de pdf_parse ou flutter_pdftext',
      'Extraction page par page',
      'Nettoyage des caractères spéciaux',
      'Détection de la langue du document',
    ],
    color: 'bg-caribbean-light',
  },
  {
    id: 3,
    title: 'Découpage en Chunks',
    description: 'Le texte est segmenté en unités sémantiques de 2000-4000 caractères',
    icon: '✂️',
    details: [
      'Split par paragraphes ou sections logiques',
      'Overlap de 200 caractères entre chunks',
      'Préservation du contexte sémantique',
      'Attribution d\'un index séquentiel',
    ],
    color: 'bg-indigo',
  },
  {
    id: 4,
    title: 'Indexation SQLite',
    description: 'Chaque chunk est inséré dans la table cours_index avec ses métadonnées',
    icon: '🗄️',
    details: [
      'Insertion dans table: cours_index',
      'Colonnes: id, course_id, chapter, chunk_text, chunk_index',
      'Index FTS5 sur chunk_text pour recherche rapide',
      'Métadonnées: titre cours, numéro chapitre, page source',
    ],
    color: 'bg-sun',
  },
];

const querySteps: Step[] = [
  {
    id: 1,
    title: 'Capture Vocale',
    description: 'L\'utilisateur pose sa question oralement via le micro',
    icon: '🎙️',
    details: [
      'Activation SpeechRecognition natif',
      'Streaming audio en temps réel',
      'Détection de fin de parole (VAD)',
      'Conversion audio → transcribed_question',
    ],
    color: 'bg-indigo',
  },
  {
    id: 2,
    title: 'Recherche Locale FTS',
    description: 'Interrogation de SQLite pour trouver les 3 chunks les plus pertinents',
    icon: '🔍',
    details: [
      'Extraction des mots-clés de la question',
      'Requête FTS5 avec BM25 ranking',
      'Sélection des top-3 chunks par score',
      'Récupération du contexte (±1 chunk)',
    ],
    color: 'bg-caribbean',
  },
  {
    id: 3,
    title: 'Construction du Prompt',
    description: 'Assemblage du prompt final pour Gemini avec les chunks pertinents',
    icon: '🧩',
    details: [
      'System prompt: rôle d\'assistant académique',
      'Injection des 3 chunks comme contexte',
      'Ajout de la question transcrite',
      'Instruction de citation des sources',
    ],
    color: 'bg-indigo-light',
  },
  {
    id: 4,
    title: 'Appel API Gemini',
    description: 'Envoi du prompt à Gemini Pro et réception de la réponse',
    icon: '🤖',
    details: [
      'POST vers Gemini Pro API endpoint',
      'Timeout: 30 secondes max',
      'Retry avec exponential backoff',
      'Parsing de la réponse structurée',
    ],
    color: 'bg-emerald-500',
  },
  {
    id: 5,
    title: 'Affichage & Lecture',
    description: 'Affichage de la réponse avec sources et lecture vocale optionnelle',
    icon: '🔊',
    details: [
      'Rendu markdown de la réponse',
      'Affichage des références sources',
      'Text-to-Speech natif pour lecture',
      'Sauvegarde dans l\'historique',
    ],
    color: 'bg-sun',
  },
];

export default function PipelineView() {
  const [mode, setMode] = useState<PipelineMode>('upload');
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = mode === 'upload' ? uploadSteps : querySteps;
  const currentStep = steps.find(s => s.id === activeStep)!;

  return (
    <div className="space-y-8">
      {/* Section Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pipeline RAG</h2>
        <p className="text-gray-500 text-sm">Retrieval-Augmented Generation : du document à la réponse contextuelle</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-3 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <button
          onClick={() => { setMode('upload'); setActiveStep(1); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            mode === 'upload'
              ? 'bg-caribbean text-white shadow-md shadow-caribbean/20'
              : 'bg-white text-gray-500 border border-sand-dark/20 hover:border-caribbean/30'
          }`}
        >
          📄 Flux d'Ajout de Cours
        </button>
        <button
          onClick={() => { setMode('query'); setActiveStep(1); }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            mode === 'query'
              ? 'bg-indigo text-white shadow-md shadow-indigo/20'
              : 'bg-white text-gray-500 border border-sand-dark/20 hover:border-indigo/30'
          }`}
        >
          🎙️ Flux Question/Réponse
        </button>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '200ms'}}>
        {/* Steps Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Connection line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 mx-8"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-caribbean to-indigo mx-8 transition-all duration-500"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * (100 - 8)}%` }}
          ></div>

          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className="relative z-10 flex flex-col items-center gap-2 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.id <= activeStep
                  ? `${step.color} text-white shadow-lg scale-110`
                  : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
              }`}>
                <span className="text-sm">{step.icon}</span>
              </div>
              <span className={`text-[10px] font-medium text-center max-w-[80px] ${
                step.id === activeStep ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Detail */}
        <div className="border-t border-sand-dark/10 pt-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${currentStep.color} flex items-center justify-center text-xl flex-shrink-0`}>
              {currentStep.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">Étape {currentStep.id}/{steps.length}</span>
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-1">{currentStep.title}</h4>
              <p className="text-sm text-gray-500 mb-4">{currentStep.description}</p>
              
              <div className="bg-sand-light rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Détails techniques :</p>
                <ul className="space-y-1.5">
                  {currentStep.details.map((detail, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${currentStep.color}`}></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Template */}
      {mode === 'query' && (
        <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '300ms'}}>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Template du Prompt Gemini</h3>
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="code-block text-green-300 text-xs leading-relaxed">
{`System: Tu es l'assistant académique 'Legba Note'. 
Tu dois répondre à la question de l'examen en te basant 
exclusivement sur les notes de cours fournies ci-dessous.

Documents de référence :
━━━━━━━━━━━━━━━━━━━━━━━━
[Chunk 1] ${'{'}titre_cours{'}'} - ${'{'}chapitre{'}'} 
"${'{'}text_chunk_1{'}'}"

[Chunk 2] ${'{'}titre_cours{'}'} - ${'{'}chapitre{'}'}
"${'{'}text_chunk_2{'}'}"

[Chunk 3] ${'{'}titre_cours{'}'} - ${'{'}chapitre{'}'}
"${'{'}text_chunk_3{'}'}"
━━━━━━━━━━━━━━━━━━━━━━━━

Question : ${'{'}transcribed_question{'}'}

Réponse :`}
            </pre>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] bg-indigo/10 text-indigo px-2 py-1 rounded-full">~1500 tokens</span>
            <span className="text-[10px] bg-caribbean/10 text-caribbean px-2 py-1 rounded-full">Context window: 32K</span>
            <span className="text-[10px] bg-sun/10 text-sun-dark px-2 py-1 rounded-full">Latence: ~2-5s</span>
          </div>
        </div>
      )}

      {/* Schema SQLite */}
      {mode === 'upload' && (
        <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '300ms'}}>
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Schéma de Base de Données</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-xs text-yellow-300 font-semibold mb-2">-- Table: courses</p>
              <pre className="code-block text-green-300 text-xs">
{`CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  total_chapters INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);`}
              </pre>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <p className="text-xs text-yellow-300 font-semibold mb-2">-- Table: cours_index (FTS5)</p>
              <pre className="code-block text-green-300 text-xs">
{`CREATE VIRTUAL TABLE cours_index 
USING fts5(
  chunk_text,
  course_id,
  chapter_title,
  chunk_index,
  page_number,
  tokenize='unicode61'
);`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
