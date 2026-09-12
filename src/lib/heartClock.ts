// Shared timing so the visual pulse and the synthesized heartbeat sound
// stay in phase — both derive their beat position from performance.now()
// instead of keeping their own independent clocks.
export const HEART_BPM = 72
export const BEAT_PERIOD_MS = 60000 / HEART_BPM
// fraction of the cycle between the "lub" (S1) and "dub" (S2) sounds
export const DUB_OFFSET = 0.22

export function currentPhase(nowMs: number = performance.now()): number {
  return (nowMs % BEAT_PERIOD_MS) / BEAT_PERIOD_MS
}

function beatBump(phase: number, center: number, width: number): number {
  let d = Math.abs(phase - center)
  d = Math.min(d, 1 - d)
  if (d > width) return 0
  const x = 1 - d / width
  return x * x * (3 - 2 * x) // smoothstep falloff
}

/** Uniform scale multiplier for the whole heart at a given cycle phase (0-1). */
export function heartbeatScale(phase: number): number {
  const lub = beatBump(phase, 0.02, 0.1)
  const dub = beatBump(phase, DUB_OFFSET, 0.07)
  return 1 + lub * 0.1 + dub * 0.045
}
