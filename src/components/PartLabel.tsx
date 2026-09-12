import type { HeartPart } from '../data/heartParts'

type Props = {
  part: HeartPart
  active: boolean
  onClick: () => void
}

export function PartLabel({ part, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        top: part.labelPosition.top,
        left: part.labelPosition.left,
        backgroundColor: active ? part.color : undefined,
      }}
      className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-medium shadow-sm backdrop-blur-md transition-all duration-200 md:text-sm ${
        active
          ? 'scale-105 border-transparent text-white shadow-lg'
          : 'border-[var(--panel-border)] bg-[var(--panel)] text-[var(--ink)] hover:scale-105 hover:bg-[rgba(20,34,58,0.8)]'
      }`}
    >
      {part.label}
    </button>
  )
}
