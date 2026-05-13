'use client'

const FLAGS = [
  '🇧🇷','🇦🇷','🇫🇷','🇩🇪','🇪🇸','🇵🇹','🇳🇱','🇧🇪','🇺🇸','🇲🇽',
  '🇯🇵','🇰🇷','🇲🇦','🇸🇳','🇨🇦','🇦🇺','🇨🇭','🇵🇱','🇭🇷','🇷🇸',
  '🇺🇾','🇨🇴','🇩🇰','🇸🇪','🇬🇷','🇹🇷','🇨🇿','🇦🇹','🇵🇪','🇬🇭',
  '🇳🇬','🇮🇷','🇸🇦','🇷🇴','🇨🇱','🇮🇹','🇨🇲','🇿🇦','🇪🇨','🇶🇦',
]

const STADIUM_URL = 'https://images.unsplash.com/photo-1690233339256-777b854ad0e3?fm=jpg&q=60&w=1920&auto=format&fit=crop'

const COLS = 10
const ROWS = 9
const tiles = Array.from({ length: COLS * ROWS }, (_, i) => FLAGS[i % FLAGS.length])

export default function FlagBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Stadium background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${STADIUM_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Dark overlay so content stays readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(4, 4, 12, 0.78)',
      }} />

      {/* Flag grid on top of image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          padding: '8px',
          gap: '4px',
          opacity: 0.18,
          fontSize: '2.2rem',
          lineHeight: 1,
        }}
      >
        {tiles.map((f, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {f}
          </span>
        ))}
      </div>

      {/* Center vignette to improve readability of content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 50% 60% at 50% 45%, rgba(4,4,12,0.55) 0%, transparent 100%)',
      }} />

      {/* Green top glow */}
      <div style={{
        position: 'absolute',
        top: -60, left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '250px',
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.25) 0%, transparent 70%)',
      }} />
    </div>
  )
}
