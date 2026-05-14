let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gainNode.gain.setValueAtTime(gain, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // silently ignore
  }
}

// Single hand-clap burst using filtered white noise
function playClap() {
  try {
    const ctx  = getCtx()
    const dur  = 0.09
    const size = Math.floor(ctx.sampleRate * dur)
    const buf  = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / size) // white noise + linear fade
    }

    const src = ctx.createBufferSource()
    src.buffer = buf

    // Band-pass centred around 1.2 kHz — gives a crisp hand-clap timbre
    const bpf = ctx.createBiquadFilter()
    bpf.type = 'bandpass'
    bpf.frequency.value = 1200
    bpf.Q.value = 0.7

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(1.0, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)

    src.connect(bpf)
    bpf.connect(gain)
    gain.connect(ctx.destination)
    src.start()
    src.stop(ctx.currentTime + dur)
  } catch {
    // silently ignore
  }
}

export function playCorrect() {
  playTone(523, 0.12, 'sine', 0.25)
  setTimeout(() => playTone(659, 0.18, 'sine', 0.25), 110)
}

export function playWrong() {
  playTone(220, 0.25, 'square', 0.15)
}

export function playWin() {
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.3), i * 150)
  })
}

// Fanfare then a burst of rhythmic applause
export function playApplause() {
  // Short fanfare first
  const fanfare = [523, 659, 784, 1047]
  fanfare.forEach((f, i) => setTimeout(() => playTone(f, 0.18, 'sine', 0.28), i * 130))

  // Applause follows after fanfare settles (~700 ms)
  // Irregular timing makes it feel human
  const clapOffsets = [700, 890, 1070, 1260, 1430, 1610, 1800, 1980, 2170, 2380, 2570, 2760]
  clapOffsets.forEach(t => setTimeout(() => playClap(), t))
}
