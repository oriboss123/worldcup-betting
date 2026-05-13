'use client'

const FLAGS = [
  '🇧🇷','🇦🇷','🇫🇷','🇩🇪','🇪🇸','🇵🇹','🇳🇱','🇧🇪','🇺🇸','🇲🇽',
  '🇯🇵','🇰🇷','🇲🇦','🇸🇳','🇨🇦','🇦🇺','🇨🇭','🇵🇱','🇭🇷','🇷🇸',
  '🇺🇾','🇨🇴','🇩🇰','🇸🇪','🇬🇷','🇹🇷','🇨🇿','🇦🇹','🇵🇪','🇬🇭',
  '🇳🇬','🇮🇷','🇸🇦','🇷🇴','🇨🇱','🇮🇹','🇨🇲','🇿🇦','🇪🇨','🇶🇦',
]

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
      {/* Flag grid — clearly visible */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          height: '100%',
          width: '100%',
          padding: '8px',
          gap: '4px',
          opacity: 0.32,
          fontSize: '2.6rem',
          lineHeight: 1,
        }}
      >
        {tiles.map((f, i) => (
          <span
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: i % 3 === 1 ? 'rotate(8deg)' : i % 3 === 2 ? 'rotate(-6deg)' : 'none',
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Strong center vignette — content area stays dark and readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(ellipse 55% 65% at 50% 45%, rgba(4,4,12,0.92) 0%, rgba(4,4,12,0.75) 55%, rgba(4,4,12,0.1) 100%)',
            'linear-gradient(to bottom, rgba(4,4,12,0.7) 0%, transparent 15%, transparent 85%, rgba(4,4,12,0.7) 100%)',
          ].join(', '),
        }}
      />

      {/* Green top glow */}
      <div
        style={{
          position: 'absolute',
          top: -80, left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.2) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
