/**
 * useAudio — singleton audio manager
 * Handles background music + UI sound effects
 * Works around iOS autoplay restrictions (requires user gesture)
 */

let bgMusic: HTMLAudioElement | null = null
let audioCtx: AudioContext | null = null

// ── Sound effect generator using Web Audio API ──
function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

function playTone(opts: {
  type?: OscillatorType
  frequency: number
  duration: number
  gain?: number
  detune?: number
  ramp?: boolean
}) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = opts.type ?? 'sine'
    osc.frequency.setValueAtTime(opts.frequency, ctx.currentTime)
    if (opts.detune) osc.detune.setValueAtTime(opts.detune, ctx.currentTime)
    if (opts.ramp) {
      osc.frequency.exponentialRampToValueAtTime(opts.frequency * 1.5, ctx.currentTime + opts.duration)
    }

    gainNode.gain.setValueAtTime(opts.gain ?? 0.15, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + opts.duration)

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + opts.duration)
  } catch (_) {}
}

function playChord(notes: number[], duration = 0.25, gain = 0.08) {
  notes.forEach((freq, i) => {
    setTimeout(() => playTone({ frequency: freq, duration, gain }), i * 30)
  })
}

// ── Public sound effects ──
export const sfx = {
  /** Soft bubble pop — tab switch, general click */
  pop() {
    playTone({ type: 'sine', frequency: 520, duration: 0.12, gain: 0.12, ramp: false })
    setTimeout(() => playTone({ type: 'sine', frequency: 680, duration: 0.08, gain: 0.08 }), 60)
  },

  /** Upward chime — open form */
  chime() {
    const melody = [523, 659, 784, 1047]
    melody.forEach((freq, i) => {
      setTimeout(() => playTone({ type: 'sine', frequency: freq, duration: 0.18, gain: 0.1 }), i * 70)
    })
  },

  /** Gentle close — dismiss form */
  close() {
    const melody = [784, 659, 523]
    melody.forEach((freq, i) => {
      setTimeout(() => playTone({ type: 'sine', frequency: freq, duration: 0.14, gain: 0.08 }), i * 60)
    })
  },

  /** Success sparkle — message sent */
  success() {
    const melody = [523, 659, 784, 1047, 1319]
    melody.forEach((freq, i) => {
      setTimeout(() => playTone({ type: 'sine', frequency: freq, duration: 0.2, gain: 0.12, ramp: true }), i * 55)
    })
    // extra shimmer
    setTimeout(() => {
      playChord([1047, 1319, 1568], 0.3, 0.06)
    }, 340)
  },

  /** Carousel slide whoosh */
  slide() {
    playTone({ type: 'sine', frequency: 300, duration: 0.15, gain: 0.07, ramp: true })
  },

  /** Camera shutter click */
  camera() {
    playTone({ type: 'square', frequency: 1200, duration: 0.04, gain: 0.08 })
    setTimeout(() => playTone({ type: 'square', frequency: 800, duration: 0.04, gain: 0.06 }), 40)
  },

  /** Soft splash — hover / tap on animal */
  splash() {
    playTone({ type: 'sine', frequency: 180, duration: 0.2, gain: 0.1 })
    setTimeout(() => playTone({ type: 'sine', frequency: 240, duration: 0.15, gain: 0.07 }), 40)
  },

  /** Warning / validation error */
  error() {
    playTone({ type: 'sawtooth', frequency: 220, duration: 0.18, gain: 0.1 })
    setTimeout(() => playTone({ type: 'sawtooth', frequency: 180, duration: 0.18, gain: 0.08 }), 120)
  },
}

// ── Background music ──
export function initBgMusic() {
  if (typeof window === 'undefined') return
  if (bgMusic) return

  bgMusic = new Audio('/music/music.mp3')
  bgMusic.loop = true
  bgMusic.volume = 0.35
  bgMusic.preload = 'auto'
}

export function playBgMusic() {
  if (!bgMusic) initBgMusic()
  if (!bgMusic) return
  bgMusic.play().catch(() => {
    // Autoplay blocked — will retry on next user gesture
  })
  // Also resume AudioContext if suspended (iOS)
  if (audioCtx?.state === 'suspended') audioCtx.resume()
}

export function pauseBgMusic() {
  bgMusic?.pause()
}

export function toggleBgMusic(): boolean {
  if (!bgMusic) { initBgMusic(); playBgMusic(); return true }
  if (bgMusic.paused) { playBgMusic(); return true }
  pauseBgMusic(); return false
}

export function isMusicPlaying(): boolean {
  return bgMusic ? !bgMusic.paused : false
}

// ── React hook ──
import { useEffect, useRef, useState, useCallback } from 'react'

export function useAudio() {
  const [playing, setPlaying] = useState(false)
  const started = useRef(false)

  // Start music on first user interaction (iOS requirement)
  const handleFirstGesture = useCallback(() => {
    if (started.current) return
    started.current = true
    initBgMusic()
    playBgMusic()
    setPlaying(true)
    // Remove listeners after first trigger
    window.removeEventListener('touchstart', handleFirstGesture)
    window.removeEventListener('click', handleFirstGesture)
  }, [])

  useEffect(() => {
    initBgMusic()
    // Try immediate autoplay
    playBgMusic()
    setPlaying(true)
    // Fallback: start on first touch/click (iOS autoplay gate)
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true })
    window.addEventListener('click', handleFirstGesture, { once: true })
    return () => {
      window.removeEventListener('touchstart', handleFirstGesture)
      window.removeEventListener('click', handleFirstGesture)
    }
  }, [handleFirstGesture])

  const toggle = useCallback(() => {
    const isNowPlaying = toggleBgMusic()
    setPlaying(isNowPlaying)
    if (isNowPlaying) sfx.chime()
    else sfx.close()
  }, [])

  return { playing, toggle }
}
