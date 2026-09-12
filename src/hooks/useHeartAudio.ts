import { useEffect, useRef, useState } from 'react'
import { BEAT_PERIOD_MS, DUB_OFFSET } from '../lib/heartClock'

const SCHEDULE_AHEAD_MS = 250
const SCHEDULER_INTERVAL_MS = 100

type ThumpOptions = {
  time: number
  freq: number
  gain: number
  duration: number
}

function playThump(ctx: AudioContext, dest: AudioNode, { time, freq, gain, duration }: ThumpOptions) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, time)
  osc.frequency.exponentialRampToValueAtTime(Math.max(freq * 0.55, 20), time + duration)

  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, time)
  env.gain.exponentialRampToValueAtTime(gain, time + 0.012)
  env.gain.exponentialRampToValueAtTime(0.0001, time + duration)

  osc.connect(env)
  env.connect(dest)
  osc.start(time)
  osc.stop(time + duration + 0.05)
}

/** Synthesizes a "lub-dub" heartbeat and a soft ambient pad — no audio files needed. */
export function useHeartAudio() {
  const [heartbeatOn, setHeartbeatOn] = useState(false)
  const [musicOn, setMusicOn] = useState(false)

  const ctxRef = useRef<AudioContext | null>(null)
  const heartbeatGainRef = useRef<GainNode | null>(null)
  const musicGainRef = useRef<GainNode | null>(null)
  const musicNodesRef = useRef<{ oscillators: OscillatorNode[]; lfo: OscillatorNode } | null>(null)
  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastScheduledBeatRef = useRef<number>(-1)

  const getContext = () => {
    if (!ctxRef.current) {
      const ctx = new AudioContext()
      const heartbeatGain = ctx.createGain()
      heartbeatGain.gain.value = 0.9
      heartbeatGain.connect(ctx.destination)

      const musicGain = ctx.createGain()
      musicGain.gain.value = 0
      musicGain.connect(ctx.destination)

      ctxRef.current = ctx
      heartbeatGainRef.current = heartbeatGain
      musicGainRef.current = musicGain
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume()
    return ctxRef.current
  }

  useEffect(() => {
    if (!heartbeatOn) {
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current)
        schedulerRef.current = null
      }
      return
    }

    const ctx = getContext()
    const dest = heartbeatGainRef.current!

    const schedule = () => {
      const perfNow = performance.now()
      // start from the next upcoming beat so beatPerf never lands in the
      // past — a past beat would compute a negative AudioParam time
      const startK = Math.ceil(perfNow / BEAT_PERIOD_MS)
      for (let k = startK; ; k++) {
        const beatPerf = k * BEAT_PERIOD_MS
        if (beatPerf > perfNow + SCHEDULE_AHEAD_MS) break
        if (beatPerf <= lastScheduledBeatRef.current) continue

        const beatCtxTime = ctx.currentTime + (beatPerf - perfNow) / 1000
        playThump(ctx, dest, { time: beatCtxTime, freq: 68, gain: 0.85, duration: 0.16 })
        playThump(ctx, dest, {
          time: beatCtxTime + (DUB_OFFSET * BEAT_PERIOD_MS) / 1000,
          freq: 92,
          gain: 0.55,
          duration: 0.11,
        })
        lastScheduledBeatRef.current = beatPerf
      }
    }

    schedule()
    schedulerRef.current = setInterval(schedule, SCHEDULER_INTERVAL_MS)
    return () => {
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current)
        schedulerRef.current = null
      }
    }
  }, [heartbeatOn])

  useEffect(() => {
    const musicGain = musicGainRef.current
    if (!musicOn) {
      if (musicGain) {
        const ctx = ctxRef.current!
        musicGain.gain.cancelScheduledValues(ctx.currentTime)
        musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.6)
      }
      const nodes = musicNodesRef.current
      if (nodes) {
        const ctx = ctxRef.current!
        setTimeout(() => {
          nodes.oscillators.forEach((o) => o.stop())
          nodes.lfo.stop()
        }, 1500)
        musicNodesRef.current = null
        void ctx
      }
      return
    }

    const ctx = getContext()
    const gain = musicGainRef.current!

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1000
    filter.Q.value = 0.4
    filter.connect(gain)

    // slow, gentle chord (G3, B3, D4) with soft detune for warmth
    const freqs = [196.0, 246.94, 293.66]
    const oscillators = freqs.map((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.detune.value = i === 1 ? 4 : -3
      const voiceGain = ctx.createGain()
      voiceGain.gain.value = 0.055
      osc.connect(voiceGain)
      voiceGain.connect(filter)
      osc.start()
      return osc
    })

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.12
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 420
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    musicNodesRef.current = { oscillators, lfo }

    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setTargetAtTime(1, ctx.currentTime, 1.2)

    return () => {
      // cleanup happens in the off-branch above when musicOn flips to false;
      // this only guards unmount while music is still playing
    }
  }, [musicOn])

  useEffect(
    () => () => {
      if (schedulerRef.current) clearInterval(schedulerRef.current)
      ctxRef.current?.close()
    },
    [],
  )

  return {
    heartbeatOn,
    musicOn,
    toggleHeartbeat: () => setHeartbeatOn((v) => !v),
    toggleMusic: () => setMusicOn((v) => !v),
  }
}
