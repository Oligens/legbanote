interface WebEnvironmentWarningProps {
  onDismiss?: () => void;
}

export default function WebEnvironmentWarning({ onDismiss }: WebEnvironmentWarningProps) {
  return (
    <div className="glass-card rounded-2xl p-4 border border-metallic-gold/30 bg-metallic-gold/10 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-metallic-gold/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-metallic-gold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-metallic-gold mb-1">
            Mode Vocal Non Disponible en Web
          </h4>
          <p className="text-[10px] text-white/70 leading-relaxed mb-2">
            Le mode vocal continu avec routage Bluetooth nécessite une compilation mobile native (Android/iOS). 
            Cette démo web simule l'interface mais ne peut pas accéder aux APIs audio natives.
          </p>
          <div className="glass-card rounded-lg p-2 bg-black/20 border border-white/10">
            <p className="text-[9px] text-white/60 font-mono">
              // Code Flutter natif requis :<br/>
              AudioSession.configure(<br/>
              &nbsp;&nbsp;allowBluetooth: true,<br/>
              &nbsp;&nbsp;androidAutomaticHeadsetDetection: true<br/>
              );
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="mt-2 text-[10px] text-cyan-neon hover:text-cyan-neon/80 transition-colors"
            >
              Compris, continuer la démo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
