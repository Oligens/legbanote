import { useState, useEffect } from 'react';

type DeviceType = 'speaker' | 'wired' | 'bluetooth' | 'usb' | 'unknown';

interface AudioDevice {
  type: DeviceType;
  name: string;
  icon: string;
  color: string;
  status: 'active' | 'available' | 'disconnected';
}

export default function AudioDeviceDetection() {
  const [devices, setDevices] = useState<AudioDevice[]>([
    { type: 'speaker', name: 'Haut-parleur interne', icon: '🔊', color: 'bg-gray-500', status: 'disconnected' },
    { type: 'wired', name: 'Casque filaire (Jack/USB-C)', icon: '🎧', color: 'bg-blue-500', status: 'disconnected' },
    { type: 'bluetooth', name: 'Casque Bluetooth (A2DP/SCO)', icon: '📶', color: 'bg-cyan-500', status: 'disconnected' },
    { type: 'usb', name: 'Périphérique USB Audio', icon: '🔌', color: 'bg-purple-500', status: 'disconnected' },
  ]);

  const [activeDevice, setActiveDevice] = useState<DeviceType>('unknown');
  const [isDetecting, setIsDetecting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [routingMode, setRoutingMode] = useState<string>('inCommunication');

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-14), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const simulateDeviceDetection = async () => {
    setIsDetecting(true);
    setLogs([]);
    
    addLog('🔍 Démarrage de la détection automatique...');
    await delay(500);
    
    addLog('📱 AudioSession.configure() avec androidAutomaticHeadsetDetection: true');
    await delay(500);
    
    addLog('🎛️ Mode audio: playAndRecord + allowBluetooth + defaultToSpeaker');
    await delay(500);
    
    addLog('🔌 Scan des périphériques audio actifs...');
    await delay(800);
    
    // Simulate detection of Bluetooth device
    addLog('✅ Périphérique détecté: Casque Bluetooth (A2DP)');
    await delay(300);
    
    addLog('🎯 Forçage du routage vers: Casque Bluetooth');
    await delay(300);
    
    addLog('🔊 AudioMode: inCommunication (pour Bluetooth SCO)');
    setRoutingMode('inCommunication');
    await delay(300);
    
    addLog('✅ Routage audio configuré avec succès');
    await delay(300);
    
    addLog('🎙️ Écoute continue démarrée sur le casque');
    
    // Update devices
    setDevices(prev => prev.map(d => ({
      ...d,
      status: d.type === 'bluetooth' ? 'active' : 'disconnected'
    })));
    setActiveDevice('bluetooth');
    
    setIsDetecting(false);
  };

  const simulateWiredConnection = async () => {
    setIsDetecting(true);
    setLogs([]);
    
    addLog('🔌 Périphérique filaire détecté (changement de routage)');
    await delay(500);
    
    addLog('🎛️ Route changed event triggered');
    await delay(300);
    
    addLog('✅ Périphérique actif: Casque filaire (Jack)');
    await delay(300);
    
    addLog('🔊 AudioMode: normal (pas inCommunication pour filaire)');
    setRoutingMode('normal');
    await delay(300);
    
    addLog('🎯 Forçage du routage vers: Casque filaire');
    await delay(300);
    
    addLog('✅ Routage mis à jour automatiquement');
    
    setDevices(prev => prev.map(d => ({
      ...d,
      status: d.type === 'wired' ? 'active' : 'disconnected'
    })));
    setActiveDevice('wired');
    
    setIsDetecting(false);
  };

  const simulateDisconnection = async () => {
    setIsDetecting(true);
    setLogs([]);
    
    addLog('⚠️ becomingNoisy event: Périphérique débranché');
    await delay(500);
    
    addLog('🔍 Re-détection des périphériques...');
    await delay(500);
    
    addLog('✅ Fallback: Haut-parleur interne');
    await delay(300);
    
    addLog('🔊 AudioMode: normal');
    setRoutingMode('normal');
    await delay(300);
    
    addLog('✅ Routage mis à jour vers haut-parleur');
    
    setDevices(prev => prev.map(d => ({
      ...d,
      status: d.type === 'speaker' ? 'active' : 'disconnected'
    })));
    setActiveDevice('speaker');
    
    setIsDetecting(false);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'speaker': return '🔊';
      case 'wired': return '🎧';
      case 'bluetooth': return '📶';
      case 'usb': return '🔌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-400 animate-pulse';
      case 'available': return 'bg-cyan-400';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 space-y-4">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-400/20 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Détection Automatique de Périphérique</h3>
            <p className="text-[10px] text-text-muted">Résout les conflits de routage audio</p>
          </div>
        </div>
      </div>

      {/* Active Device Display */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-white/70">Périphérique Actif</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${
              activeDevice === 'unknown' ? 'bg-gray-400' : 'bg-emerald-400 animate-pulse'
            }`} />
            <span className="text-[10px] text-text-muted">
              {activeDevice === 'unknown' ? 'Non détecté' : 'Connecté'}
            </span>
          </div>
        </div>

        {/* Current Device */}
        <div className="glass-card rounded-xl p-3 border border-cyan-neon/20 bg-cyan-neon/5 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {activeDevice === 'unknown' ? '❓' : getDeviceIcon(activeDevice)}
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">
                {activeDevice === 'unknown' ? 'Aucun périphérique' :
                 activeDevice === 'speaker' ? 'Haut-parleur interne' :
                 activeDevice === 'wired' ? 'Casque filaire' :
                 activeDevice === 'bluetooth' ? 'Casque Bluetooth' :
                 'Périphérique USB'}
              </p>
              <p className="text-[10px] text-text-muted">
                Mode: {routingMode}
              </p>
            </div>
            {activeDevice !== 'unknown' && (
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={simulateDeviceDetection}
            disabled={isDetecting}
            className="glass-button rounded-lg py-2 text-[10px] font-medium disabled:opacity-50"
          >
            📶 Bluetooth
          </button>
          <button
            onClick={simulateWiredConnection}
            disabled={isDetecting}
            className="glass-button rounded-lg py-2 text-[10px] font-medium disabled:opacity-50"
          >
            🎧 Filaire
          </button>
          <button
            onClick={simulateDisconnection}
            disabled={isDetecting}
            className="glass-button rounded-lg py-2 text-[10px] font-medium disabled:opacity-50"
          >
            🔊 Speaker
          </button>
        </div>
      </div>

      {/* Available Devices */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <h4 className="text-xs font-bold text-white mb-3">Périphériques Détectés</h4>
        <div className="space-y-2">
          {devices.map((device, i) => (
            <div
              key={i}
              className={`glass-card rounded-xl p-3 border transition-all ${
                device.status === 'active'
                  ? 'border-emerald-400/30 bg-emerald-500/5'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{device.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{device.name}</p>
                  <p className="text-[10px] text-text-muted">
                    {device.status === 'active' ? 'Actif' : 
                     device.status === 'available' ? 'Disponible' : 'Déconnecté'}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs Console */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-white/70 font-medium">Console de Détection</span>
        </div>
        <div className="bg-black/30 rounded-xl p-3 max-h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-[10px] text-white/30 italic">
              Cliquez sur un bouton pour simuler la détection...
            </p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, i) => (
                <p key={i} className="text-[10px] text-white/70 font-mono leading-relaxed">{log}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Technical Explanation */}
      <div className="glass-card rounded-2xl p-4 border border-metallic-gold/20 bg-metallic-gold/5 animate-fade-in-up" style={{animationDelay: '400ms'}}>
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-metallic-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <div>
            <p className="text-[10px] text-metallic-gold font-bold mb-1">🔧 Pourquoi cela fonctionnait mal avant ?</p>
            <div className="text-[9px] text-white/60 space-y-1">
              <p><strong className="text-white/80">Faux positif Bluetooth :</strong> Le système garde en cache une ancienne connexion et pense qu'elle est active.</p>
              <p><strong className="text-white/80">Conflit Fil/Sans-fil :</strong> Le système applique inCommunication (micro BT SCO) au lieu du profil média pour le filaire.</p>
              <p><strong className="text-white/80">Solution :</strong> androidAutomaticHeadsetDetection: true + détection dynamique des routes audio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Code */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 animate-fade-in-up" style={{animationDelay: '500ms'}}>
        <h4 className="text-xs font-bold text-white mb-3">Configuration Critique</h4>
        <div className="bg-black/30 rounded-xl p-3 overflow-x-auto">
          <pre className="code-block text-[9px] text-emerald-400 whitespace-pre">{`AudioSessionConfiguration(
  avAudioSessionCategory: .playAndRecord,
  avAudioSessionCategoryOptions: [
    .allowBluetooth,
    .allowBluetoothA2DP,
    .defaultToSpeaker  // Fallback
  ],
  androidAudioMode: .inCommunication,
  androidAutomaticHeadsetDetection: true,  // CRITIQUE
  androidWillPauseWhenDucked: true,
)`}</pre>
        </div>
      </div>
    </div>
  );
}
