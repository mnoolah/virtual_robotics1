import { heartParts } from '../data/heartParts'

const anchor = { x: 50, y: 52 }

export function AnnotationLines({ activePart }: { activePart: string | null }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {heartParts.map((p) => {
        const x = parseFloat(p.labelPosition.left)
        const y = parseFloat(p.labelPosition.top)
        const midX = (x + anchor.x) / 2 + (x > anchor.x ? 6 : -6)
        const active = activePart === p.id
        return (
          <path
            key={p.id}
            d={`M ${x} ${y} Q ${midX} ${(y + anchor.y) / 2} ${anchor.x} ${anchor.y}`}
            fill="none"
            stroke={p.color}
            strokeWidth={active ? 0.35 : 0.18}
            opacity={active ? 0.85 : 0.35}
            strokeDasharray="1.2 1.4"
            style={{ transition: 'opacity 0.3s, stroke-width 0.3s' }}
          />
        )
      })}
    </svg>
  )
}
