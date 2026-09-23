export type VoiceSettings = {
  speechRate: number;
  silenceMs: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
};

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  speechRate: 0.96,
  silenceMs: 900,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
};

const KEY = 'legba-note:voice-settings:v1';

export function loadVoiceSettings(): VoiceSettings {
  try {
    return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return DEFAULT_VOICE_SETTINGS;
  }
}

export function saveVoiceSettings(settings: VoiceSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
