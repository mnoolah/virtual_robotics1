type Props = {
  heartbeatOn: boolean
  musicOn: boolean
  onToggleHeartbeat: () => void
  onToggleMusic: () => void
}

export function SoundControls({ heartbeatOn, musicOn, onToggleHeartbeat, onToggleMusic }: Props) {
  return (
    <>
      <button
        onClick={onToggleHeartbeat}
        title={heartbeatOn ? 'إيقاف صوت النبض' : 'تشغيل صوت النبض'}
        aria-label="تبديل صوت نبض القلب"
        className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border text-lg shadow-sm backdrop-blur-xl transition hover:scale-105 ${
          heartbeatOn
            ? 'border-transparent bg-[var(--accent)] text-white'
            : 'border-[var(--panel-border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[rgba(20,34,58,0.85)]'
        }`}
      >
        {heartbeatOn ? '🔊' : '🔈'}
      </button>
      <button
        onClick={onToggleMusic}
        title={musicOn ? 'إيقاف الموسيقى الخفيفة' : 'تشغيل موسيقى خفيفة'}
        aria-label="تبديل الموسيقى الخفيفة"
        className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border text-lg shadow-sm backdrop-blur-xl transition hover:scale-105 ${
          musicOn
            ? 'border-transparent bg-[var(--accent)] text-white'
            : 'border-[var(--panel-border)] bg-[var(--panel)] text-[var(--ink)] hover:bg-[rgba(20,34,58,0.85)]'
        }`}
      >
        🎵
      </button>
    </>
  )
}
