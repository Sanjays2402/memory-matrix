// Simple sound effects using Web Audio API
let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Audio not available
  }
}

export function playFlip() {
  playTone(800, 0.08, 'sine', 0.1)
}

export function playMatch() {
  playTone(523, 0.1, 'sine', 0.15)
  setTimeout(() => playTone(659, 0.1, 'sine', 0.15), 80)
  setTimeout(() => playTone(784, 0.15, 'sine', 0.15), 160)
}

export function playNoMatch() {
  playTone(300, 0.15, 'square', 0.08)
  setTimeout(() => playTone(250, 0.2, 'square', 0.06), 100)
}

export function playCombo() {
  playTone(600, 0.08, 'sine', 0.15)
  setTimeout(() => playTone(800, 0.08, 'sine', 0.15), 60)
  setTimeout(() => playTone(1000, 0.08, 'sine', 0.15), 120)
  setTimeout(() => playTone(1200, 0.15, 'sine', 0.15), 180)
}

export function playVictory() {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047]
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.2, 'sine', 0.12), i * 100)
  })
}

export function playHint() {
  playTone(440, 0.3, 'triangle', 0.1)
}
