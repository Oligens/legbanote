import { useEffect, useState } from 'react';

export type OrbState = 'idle' | 'listening' | 'processing' | 'speaking' | 'dictation';

interface LiveOrbProps {
  state: OrbState;
  size?: number;
}

export default function LiveOrb({ state, size = 200 }: LiveOrbProps) {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getOrbColors = () => {
    switch (state) {
      case 'idle':
        return {
          primary: 'rgba(0, 255, 255, 0.3)',
          secondary: 'rgba(0, 200, 255, 0.2)',
          glow: 'rgba(0, 255, 255, 0.4)',
          ring: 'rgba(0, 255, 255, 0.15)',
        };
      case 'listening':
        return {
          primary: 'rgba(0, 255, 255, 0.6)',
          secondary: 'rgba(0, 200, 255, 0.4)',
          glow: 'rgba(0, 255, 255, 0.8)',
          ring: 'rgba(0, 255, 255, 0.3)',
        };
      case 'processing':
        return {
          primary: 'rgba(255, 215, 0, 0.5)',
          secondary: 'rgba(255, 180, 0, 0.3)',
          glow: 'rgba(255, 215, 0, 0.7)',
          ring: 'rgba(255, 215, 0, 0.25)',
        };
      case 'speaking':
        return {
          primary: 'rgba(0, 255, 200, 0.5)',
          secondary: 'rgba(0, 200, 150, 0.3)',
          glow: 'rgba(0, 255, 200, 0.7)',
          ring: 'rgba(0, 255, 200, 0.25)',
        };
      case 'dictation':
        return {
          primary: 'rgba(255, 215, 0, 0.6)',
          secondary: 'rgba(255, 180, 0, 0.4)',
          glow: 'rgba(255, 215, 0, 0.9)',
          ring: 'rgba(255, 215, 0, 0.35)',
        };
    }
  };

  const colors = getOrbColors();
  const pulseScale = 1 + Math.sin(pulsePhase * 0.05) * 0.05;
  const glowIntensity = 0.5 + Math.sin(pulsePhase * 0.08) * 0.3;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <div
        className="absolute rounded-full transition-all duration-1000"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          opacity: glowIntensity,
          transform: `scale(${pulseScale})`,
        }}
      />
      
      {/* Middle ring */}
      <div
        className="absolute rounded-full border-2 transition-all duration-700"
        style={{
          width: size * 1.15,
          height: size * 1.15,
          borderColor: colors.ring,
          transform: `scale(${pulseScale * 0.98}) rotate(${pulsePhase * 0.5}deg)`,
        }}
      />

      {/* Inner ring */}
      <div
        className="absolute rounded-full border transition-all duration-500"
        style={{
          width: size * 0.95,
          height: size * 0.95,
          borderColor: colors.ring,
          transform: `scale(${pulseScale * 1.02}) rotate(-${pulsePhase * 0.3}deg)`,
        }}
      />

      {/* Main orb */}
      <div
        className="relative rounded-full backdrop-blur-xl transition-all duration-500"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          background: `radial-gradient(circle at 30% 30%, ${colors.primary}, ${colors.secondary})`,
          boxShadow: `0 0 ${60 * glowIntensity}px ${colors.glow}, inset 0 0 ${40 * glowIntensity}px ${colors.primary}`,
          transform: `scale(${pulseScale})`,
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: '40%',
            height: '40%',
            top: '15%',
            left: '15%',
            background: `radial-gradient(circle, rgba(255,255,255,0.3), transparent)`,
            filter: 'blur(10px)',
          }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {state === 'listening' && (
            <svg className="w-12 h-12 text-white/80 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            </svg>
          )}
          {state === 'processing' && (
            <svg className="w-12 h-12 text-white/80 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
            </svg>
          )}
          {state === 'speaking' && (
            <svg className="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
          {state === 'dictation' && (
            <div className="flex flex-col items-center gap-1">
              <svg className="w-10 h-10 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
              </svg>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white/80 rounded-full animate-pulse"
                    style={{
                      height: `${8 + Math.sin(pulsePhase * 0.1 + i) * 8}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {state === 'idle' && (
            <svg className="w-12 h-12 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )}
        </div>
      </div>

      {/* Particle effects for active states */}
      {(state === 'listening' || state === 'speaking' || state === 'dictation') && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = size * 0.55 + Math.sin(pulsePhase * 0.05 + i) * 10;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `calc(50% + ${x}px - 4px)`,
                  top: `calc(50% + ${y}px - 4px)`,
                  background: colors.primary,
                  boxShadow: `0 0 10px ${colors.glow}`,
                  opacity: 0.6 + Math.sin(pulsePhase * 0.1 + i) * 0.4,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
