import { useState } from 'react';
import LibraryScreen from './components/LibraryScreen';
import ConversationScreen from './components/ConversationScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNav from './components/BottomNav';

export type Screen = 'library' | 'conversation' | 'history' | 'profile';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('library');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'library':
        return <LibraryScreen onNavigate={setActiveScreen} />;
      case 'conversation':
        return <ConversationScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <LibraryScreen onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
      {/* Phone Frame */}
      <div className="relative w-full max-w-[420px] h-full max-h-[900px] bg-sand-light overflow-hidden shadow-2xl rounded-none md:rounded-[2.5rem] md:border-8 md:border-gray-800">
        {/* Status Bar */}
        <div className="h-11 bg-sand-light flex items-center justify-between px-6 pt-2 text-xs font-medium text-gray-700">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C7.46 3 3.34 4.78.29 7.67l1.41 1.41C4.38 6.55 8.02 5 12 5s7.62 1.55 10.3 4.08l1.41-1.41C20.66 4.78 16.54 3 12 3z"/>
              <path d="M12 7c-3.31 0-6.31 1.33-8.49 3.49l1.42 1.42C6.82 10.05 9.29 9 12 9s5.18 1.05 7.07 2.91l1.42-1.42C18.31 8.33 15.31 7 12 7z"/>
              <path d="M12 11c-2.09 0-3.98.84-5.36 2.2l1.42 1.42C9.17 13.56 10.52 13 12 13s2.83.56 3.94 1.62l1.42-1.42C15.98 11.84 14.09 11 12 11z"/>
              <circle cx="12" cy="17" r="2"/>
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="6" width="3" height="12" rx="1"/>
              <rect x="7" y="4" width="3" height="14" rx="1"/>
              <rect x="12" y="2" width="3" height="16" rx="1"/>
              <rect x="17" y="0" width="3" height="18" rx="1"/>
            </svg>
            <div className="w-6 h-3 border border-gray-600 rounded-sm relative ml-1">
              <div className="absolute inset-0.5 bg-green-500 rounded-xs" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="h-[calc(100%-44px-72px)] overflow-hidden">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      </div>
    </div>
  );
}
