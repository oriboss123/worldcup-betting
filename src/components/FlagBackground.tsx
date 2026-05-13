'use client'

const FLAGS = [
  '🇧🇷','🇦🇷','🇫🇷','🇩🇪','🇪🇸','🇵🇹','🇳🇱','🇧🇪','🇺🇸','🇲🇽',
  '🇯🇵','🇰🇷','🇲🇦','🇸🇳','🇨🇦','🇦🇺','🇨🇭','🇵🇱','🇭🇷','🇷🇸',
  '🇺🇾','🇨🇴','🇩🇰','🇸🇪','🇬🇷','🇹🇷','🇨🇿','🇦🇹','🇵🇪','🇬🇭',
  '🇳🇬','🇮🇷','🇸🇦','🇶🇦','🇷🇴','🇨🇱','🇪🇨','🇮🇹','🇨🇲','🇿🇦',
]

const COUNT = 160
const tiles = Array.from({ length: COUNT }, (_, i) => FLAGS[i % FLAGS.length])

export default function FlagBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* Flag grid */}
      <div
        className="flex flex-wrap gap-5 p-5 w-full"
        style={{ opacity: 0.07, fontSize: '2rem', lineHeight: 1, filter: 'blur(0.3px)' }}
      >
        {tiles.map((f, i) => (
          <span key={i}>{f}</span>
        ))}
      </div>

      {/* Vignette overlay — keeps center dark and readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 70% at 50% 50%, rgba(4,4,12,0.82) 0%, rgba(4,4,12,0.4) 70%, transparent 100%),
            linear-gradient(to bottom, rgba(4,4,12,0.6) 0%, transparent 25%, transparent 75%, rgba(4,4,12,0.6) 100%)
          `,
        }}
      />

      {/* Green spotlight from top */}
      <div
        className="absolute"
        style={{
          top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 350,
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
