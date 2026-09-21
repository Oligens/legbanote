import { useState } from 'react';
import LegbaIcon from './LegbaIcon';

interface AuthScreenProps {
  onLogin: () => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="h-screen w-screen bg-gradient-deep overflow-hidden relative flex items-center justify-center">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[600px] h-[600px] rounded-full bg-cyan-neon/8 blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-[700px] h-[700px] rounded-full bg-metallic-gold/5 blur-[140px] animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full bg-cyan-neon/4 blur-[100px]"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[380px] mx-4 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl glass-card flex items-center justify-center mb-4 animate-float">
            <LegbaIcon className="w-12 h-12" color="#00FFFF" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Legba Note</h1>
          <p className="text-sm text-text-muted">Gardien de votre savoir</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-3xl p-6 backdrop-blur-xl">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !isRegister
                  ? 'bg-gradient-to-r from-cyan-neon/20 to-cyan-neon/10 text-cyan-neon border border-cyan-neon/30'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isRegister
                  ? 'bg-gradient-to-r from-cyan-neon/20 to-cyan-neon/10 text-cyan-neon border border-cyan-neon/30'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-text-muted/50"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-text-muted/50"
              />
            </div>

            {isRegister && (
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder-text-muted/50"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full glass-button rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authentification...</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? 'Créer le compte' : 'Se connecter'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-[10px] text-text-muted">OU</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Biometric Button */}
          <button
            onClick={onLogin}
            className="w-full glass-button-gold rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.66.42-5.57 1.41-.23.12-.5.03-.62-.2-.12-.23-.03-.5.2-.62C8.02 2.55 9.78 2 12.01 2c2.24 0 4 .55 6.01 1.59.23.12.32.39.2.62-.09.16-.24.26-.41.26zM3.5 9.72c-.1 0-.2-.03-.29-.09-.22-.16-.27-.47-.11-.69.99-1.4 2.26-2.5 3.77-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.73 3.25.16.22.11.54-.11.7-.22.16-.54.11-.7-.11-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.09.15-.24.22-.4.22zm6.25 12.07c-.13 0-.26-.05-.35-.15-.82-.82-1.46-1.74-1.91-2.73-.11-.25-.01-.54.24-.65.25-.11.54-.01.65.24.41.89.99 1.73 1.73 2.47.19.19.19.51 0 .7-.1.1-.23.15-.36.15zm4.5 0c-.13 0-.26-.05-.36-.15-.19-.19-.19-.51 0-.7.74-.74 1.32-1.57 1.73-2.47.11-.25.4-.35.65-.24.25.11.35.4.24.65-.45.99-1.09 1.91-1.91 2.73-.09.1-.22.15-.35.15zM1.73 14.78c-.1 0-.2-.03-.29-.09-.22-.16-.27-.47-.11-.69 1.37-1.94 3.2-3.49 5.31-4.49 2.78-1.32 6.16-1.32 8.94 0 2.1 1 3.93 2.55 5.3 4.49.16.22.11.54-.11.7-.22.16-.54.11-.7-.11-1.26-1.78-2.94-3.21-4.87-4.13-2.5-1.19-5.54-1.19-8.04 0-1.94.92-3.62 2.35-4.88 4.13-.09.15-.24.22-.4.22zm10.28 5.47c-.13 0-.26-.05-.36-.15-.19-.19-.19-.51 0-.7.49-.49.89-1.06 1.18-1.68.12-.25.41-.36.66-.24.25.12.36.41.24.66-.34.72-.81 1.38-1.37 1.95-.1.1-.23.15-.36.15z"/>
            </svg>
            <span>Déverrouiller avec Biométrie</span>
          </button>

          {/* Security Badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-text-muted">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span>100% Local • SQLCipher • Argon2id</span>
          </div>
        </div>
      </div>
    </div>
  );
}
