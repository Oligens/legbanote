import { useState } from 'react';
import BackendOverview from './components/BackendOverview';
import AuthSystem from './components/AuthSystem';
import DatabaseSchema from './components/DatabaseSchema';
import DocumentStorage from './components/DocumentStorage';
import ApiRoutes from './components/ApiRoutes';
import SecurityView from './components/SecurityView';
import LegbaIcon from './components/LegbaIcon';

type Section = 'overview' | 'auth' | 'database' | 'storage' | 'routes' | 'security';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  const sections: { id: Section; label: string; icon: string; shortLabel: string }[] = [
    { id: 'overview', label: 'Vue d\'Ensemble', icon: '🏗️', shortLabel: 'Overview' },
    { id: 'auth', label: 'Authentification', icon: '🔐', shortLabel: 'Auth' },
    { id: 'database', label: 'Base de Données', icon: '🗄️', shortLabel: 'Schema' },
    { id: 'storage', label: 'Stockage Documents', icon: '📁', shortLabel: 'Storage' },
    { id: 'routes', label: 'Routes API', icon: '🔀', shortLabel: 'Routes' },
    { id: 'security', label: 'Sécurité & RAM', icon: '🛡️', shortLabel: 'Security' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <BackendOverview />;
      case 'auth': return <AuthSystem />;
      case 'database': return <DatabaseSchema />;
      case 'storage': return <DocumentStorage />;
      case 'routes': return <ApiRoutes />;
      case 'security': return <SecurityView />;
      default: return <BackendOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-sand-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-dark via-indigo to-caribbean-dark text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 animate-float">
            <LegbaIcon className="w-20 h-20" color="white" />
          </div>
          <div className="absolute bottom-2 left-12 animate-breathe">
            <LegbaIcon className="w-12 h-12" color="white" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 animate-lock-pulse">
              <LegbaIcon className="w-8 h-8" color="white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Legba Note</h1>
              <p className="text-sm text-white/70">Architecture Backend Local Sécurisée</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['100% Local', 'Zero-Knowledge Auth', 'SQLCipher', 'Biométrie', '8 Go RAM'].map((tag) => (
              <span key={tag} className="text-[10px] bg-white/10 text-white/80 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-white/80 max-w-3xl text-sm sm:text-base leading-relaxed mt-4">
            Infrastructure 100% locale et sécurisée. Aucune donnée ne transite par un serveur tiers distant, 
            à l'exception des requêtes finales vers l'API Gemini. Authentification Zero-Knowledge, 
            chiffrement SQLCipher, et optimisation mémoire pour appareils à 8 Go RAM.
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-sand-dark/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-indigo text-white shadow-md shadow-indigo/20'
                    : 'text-gray-500 hover:text-indigo hover:bg-indigo/5'
                }`}
              >
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.label}</span>
                <span className="sm:hidden">{section.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-dark text-white/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LegbaIcon className="w-5 h-5" color="rgba(255,255,255,0.6)" />
              <span className="text-sm font-medium text-white/80">Legba Note</span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/50">Backend Local v2.0</span>
            </div>
            <p className="text-xs text-white/40">
              Gardien de votre savoir — Architecture 100% locale et sécurisée
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
