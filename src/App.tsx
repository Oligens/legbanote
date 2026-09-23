import { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import LibraryScreen from './components/LibraryScreen';
import LegbaLiveScreen from './components/LegbaLiveScreen';
import VoiceSettingsScreen from './components/VoiceSettingsScreen';
import LegbaIcon from './components/LegbaIcon';
import { clearSession, loadCourses, loadSession, saveSession, type StoredCourse } from './lib/storage';

export type Screen = 'auth' | 'library' | 'live' | 'voice';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(loadSession()));
  const [courses, setCourses] = useState<StoredCourse[]>(() => loadCourses());

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    saveSession(username);
    setActiveScreen('live');
  };

  const navItems: { id: Screen; label: string; icon: JSX.Element }[] = [
    {
      id: 'library',
      label: 'Cours',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'live',
      label: 'Legba Live',
      icon: (
        <div className="relative">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-neon to-metallic-gold animate-pulse" />
          <div className="absolute inset-0 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-neon to-metallic-gold animate-ping opacity-20" />
        </div>
      ),
    },
    {
      id: 'voice',
      label: 'Vocal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },

  ];

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen w-screen bg-gradient-deep overflow-hidden relative">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-neon/5 blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-metallic-gold/5 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-neon/3 blur-[80px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
              <LegbaIcon className="w-6 h-6" color="#00FFFF" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Legba Note</h1>
              <p className="text-[10px] text-text-muted">
                {activeScreen === 'library' && 'Gestion des cours'}
                {activeScreen === 'live' && 'Conversation continue'}
                {activeScreen === 'voice' && 'Configuration vocale'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { clearSession(); setIsAuthenticated(false); setActiveScreen('auth'); }}
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center hover:bg-glass-white-hover transition-colors"
          >
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </header>

        {/* Screen Content */}
        <div className="flex-1 overflow-hidden">
          {activeScreen === 'library' && <LibraryScreen onNavigate={setActiveScreen} courses={courses} setCourses={setCourses} />}
          {activeScreen === 'live' && <LegbaLiveScreen courses={courses} />}
          {activeScreen === 'voice' && <VoiceSettingsScreen />}
        </div>

        {/* Bottom Navigation */}
        <nav className="px-4 pb-4 pt-2">
          <div className="glass-card rounded-2xl p-1.5 flex items-center justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex flex-col items-center gap-1 px-2 sm:px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeScreen === item.id
                    ? 'bg-gradient-to-r from-cyan-neon/20 to-cyan-neon/10 border border-cyan-neon/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <span className={activeScreen === item.id ? 'text-cyan-neon' : ''}>{item.icon}</span>
                <span className="text-[8px] sm:text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
