import { useEffect, useState } from 'react';

type VoiceSettings = {
  speechRate: number;
  silenceMs: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
};

const KEY = 'legba-note:voice-settings:v1';

const defaults: VoiceSettings = {
  speechRate: 0.96,
  silenceMs: 900,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
};

export default function VoiceSettingsScreen() {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key: keyof VoiceSettings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings((value) => ({ ...value, [key]: !value[key] }));
    }
  };

  return (
    <div className="h-full overflow-y-auto px-4 pb-4">
      <div className="glass-card rounded-2xl p-4 mb-4 border border-cyan-neon/20">
        <h3 className="text-sm font-bold text-white">Configuration vocale réelle</h3>
        <p className="text-[10px] text-text-muted mt-1">
          Ces paramètres sont utilisés par Legba Live et conservés après actualisation.
        </p>
      </div>

      <div className="space-y-3">
        {([
          ['noiseSuppression', 'Réduction du bruit', 'Filtre les bruits ambiants.'],
          ['echoCancellation', 'Suppression d’écho', 'Réduit le retour audio du haut-parleur.'],
          ['autoGainControl', 'Gain automatique', 'Adapte le niveau du micro à une voix normale.'],
        ] as const).map(([key, label, description]) => (
          <div key={key} className="glass-card rounded-xl p-4 flex items-center justify-between border border-white/10">
            <div>
              <p className="text-xs font-medium text-white">{label}</p>
              <p className="text-[10px] text-text-muted mt-1">{description}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              className={`w-11 h-6 rounded-full border ${settings[key] ? 'bg-cyan-neon/30 border-cyan-neon/50' : 'bg-white/10 border-white/20'}`}
              aria-label={label}
            >
              <span className={`block w-5 h-5 rounded-full transition-transform ${settings[key] ? 'translate-x-5 bg-cyan-neon' : 'translate-x-0 bg-white/50'}`} />
            </button>
          </div>
        ))}

        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="flex justify-between mb-3">
            <span className="text-xs font-medium text-white">Déclenchement après silence</span>
            <span className="text-xs text-cyan-neon">{settings.silenceMs} ms</span>
          </div>
          <input
            type="range"
            min="500"
            max="1800"
            step="100"
            value={settings.silenceMs}
            onChange={(event) => setSettings({ ...settings, silenceMs: Number(event.target.value) })}
            className="w-full"
          />
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="flex justify-between mb-3">
            <span className="text-xs font-medium text-white">Vitesse TTS</span>
            <span className="text-xs text-cyan-neon">{settings.speechRate.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.02"
            value={settings.speechRate}
            onChange={(event) => setSettings({ ...settings, speechRate: Number(event.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
