import { useState } from 'react';
import ArchitectureView from './components/ArchitectureView';
import PipelineView from './components/PipelineView';
import ConstraintsView from './components/ConstraintsView';
import CodeView from './components/CodeView';
import LegbaIcon from './components/LegbaIcon';

type Tab = 'architecture' | 'pipeline' | 'constraints' | 'code';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('architecture');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'pipeline', label: 'Pipeline RAG', icon: '🔄' },
    { id: 'constraints', label: 'Contraintes', icon: '⚡' },
    { id: 'code', label: 'Implémentation', icon: '💻' },
  ];

  return (
    <div className="min-h-screen bg-sand-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-dark via-indigo to-caribbean-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <LegbaIcon className="w-8 h-8" color="white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Legba Note</h1>
              <p className="text-sm text-white/70">Architecture Technique & Logique Métier</p>
            </div>
          </div>
          <p className="text-white/80 max-w-2xl text-sm sm:text-base leading-relaxed">
            Application hybride locale + API spécialisée dans la réponse à des questions d'examen 
            à partir des documents privés de l'utilisateur. Pipeline RAG optimisé pour appareils 
            à ressources limitées (8 Go RAM).
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-sand-dark/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-indigo text-white shadow-md shadow-indigo/20'
                    : 'text-gray-500 hover:text-indigo hover:bg-indigo/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'pipeline' && <PipelineView />}
        {activeTab === 'constraints' && <ConstraintsView />}
        {activeTab === 'code' && <CodeView />}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-dark text-white/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LegbaIcon className="w-5 h-5" color="rgba(255,255,255,0.6)" />
            <span className="text-sm font-medium text-white/80">Legba Note</span>
          </div>
          <p className="text-xs">Gardien de votre savoir — Architecture documentée pour développement</p>
        </div>
      </footer>
    </div>
  );
}
