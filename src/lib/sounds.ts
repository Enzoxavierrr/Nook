export function playTimerSound() {
  try {
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15)

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.8)

    oscillator.onended = () => ctx.close()
  } catch {
    // AudioContext unavailable
  }
}
