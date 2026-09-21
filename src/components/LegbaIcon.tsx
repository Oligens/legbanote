export default function LegbaIcon({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vèvè simplifié - Bâton de Legba */}
      {/* Croix centrale */}
      <line x1="32" y1="8" x2="32" y2="56" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="12" y1="32" x2="52" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Cercles aux extrémités */}
      <circle cx="32" cy="8" r="3" fill={color} opacity="0.8"/>
      <circle cx="32" cy="56" r="3" fill={color} opacity="0.8"/>
      <circle cx="12" cy="32" r="3" fill={color} opacity="0.8"/>
      <circle cx="52" cy="32" r="3" fill={color} opacity="0.8"/>
      {/* Centre - point de convergence */}
      <circle cx="32" cy="32" r="5" fill={color} opacity="0.3"/>
      <circle cx="32" cy="32" r="2.5" fill={color}/>
      {/* Lignes diagonales décoratives */}
      <line x1="20" y1="20" x2="44" y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="44" y1="20" x2="20" y2="44" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Petits points décoratifs */}
      <circle cx="20" cy="20" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="44" cy="20" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="20" cy="44" r="1.5" fill={color} opacity="0.6"/>
      <circle cx="44" cy="44" r="1.5" fill={color} opacity="0.6"/>
    </svg>
  );
}
