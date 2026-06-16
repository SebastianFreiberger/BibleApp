let _id = 0

export function YMTLogo({ size = 32, showTagline = false, className = '', style = {} }) {
  const uid = `ymt${++_id}`
  const h = showTagline ? 380 : 295

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 500 ${h}`}
      width={size}
      height={Math.round(size * h / 500)}
      className={className}
      style={{ display: 'block', background: 'none', ...style }}
      aria-label="YMT"
    >
      <defs>
        <linearGradient id={`${uid}-lg`} x1="55" y1="20" x2="445" y2="275" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#c4b5fd"/>
          <stop offset="44%"  stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#fb923c"/>
        </linearGradient>
        <linearGradient id={`${uid}-ag`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#a78bfa"/>
          <stop offset="50%"  stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#fb923c"/>
        </linearGradient>
        {showTagline && (
          <linearGradient id={`${uid}-tg`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0"/>
            <stop offset="25%"  stopColor="#c4b5fd"/>
            <stop offset="75%"  stopColor="#f472b6"/>
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0"/>
          </linearGradient>
        )}
      </defs>

      {/* Y M T */}
      <g stroke={`url(#${uid}-lg)`} strokeLinecap="square" strokeLinejoin="miter" fill="none" strokeWidth="26">
        <line x1="55"  y1="20"  x2="107" y2="150"/>
        <line x1="160" y1="20"  x2="107" y2="150"/>
        <line x1="107" y1="150" x2="107" y2="275"/>
        <polyline points="196,275 196,20 250,128 304,20 304,275"/>
        <line x1="340" y1="20"  x2="445" y2="20"/>
        <line x1="392" y1="20"  x2="392" y2="275"/>
      </g>

      {/* Diamond above Y fork */}
      <polygon points="107,6 115,20 107,34 99,20" fill={`url(#${uid}-ag)`} opacity="0.90"/>

      {/* Underline */}
      <rect x="55" y="292" width="390" height="2" fill={`url(#${uid}-ag)`} opacity="0.85"/>

      {/* Tagline */}
      {showTagline && (
        <text
          x="250" y="345"
          textAnchor="middle"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontSize="13"
          fontWeight="400"
          letterSpacing="6"
          fill={`url(#${uid}-tg)`}
          opacity="0.70"
        >YOURMESSAGETODAY</text>
      )}
    </svg>
  )
}
