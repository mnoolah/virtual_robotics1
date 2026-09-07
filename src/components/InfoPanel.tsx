import type { RobotPart } from '../data/robotParts'

type Props = {
  part: RobotPart | null
  onClose: () => void
}

export function InfoPanel({ part, onClose }: Props) {
  if (!part) return null

  return (
    <div
      key={part.id}
      className="pop-in pointer-events-auto absolute bottom-6 left-1/2 w-[92%] max-w-sm -translate-x-1/2 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 shadow-xl backdrop-blur-xl md:bottom-8 md:left-8 md:translate-x-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: part.color }}
          />
          <h3 className="text-base font-bold text-[var(--ink)] md:text-lg">{part.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-[var(--ink-soft)] transition hover:bg-black/5"
          aria-label="إغلاق"
        >
          ✕
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{part.description}</p>
    </div>
  )
}
