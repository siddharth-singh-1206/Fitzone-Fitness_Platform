import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const SoundContext = createContext()

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('fitzone_sound_enabled')
    return saved !== null ? saved === 'true' : true
  })

  const audioCtxRef = useRef(null)

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx()
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  // Synthesized metallic crisp UI click
  const playClick = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1400, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1800, ctx.currentTime)
      filter.Q.setValueAtTime(2.5, ctx.currentTime)

      gain.gain.setValueAtTime(0.045, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // AudioContext policy catch
    }
  }

  // Synthesized subtle accordion pop / toggle
  const playPop = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(620, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.045)

      gain.gain.setValueAtTime(0.035, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.055)
    } catch {
      // AudioContext policy catch
    }
  }

  // Synthesized success / activation chime
  const playSuccess = () => {
    if (!soundEnabled) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      ;[523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.04)

        gain.gain.setValueAtTime(0.03, now + idx * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.12)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + idx * 0.04)
        osc.stop(now + idx * 0.04 + 0.13)
      })
    } catch {
      // AudioContext policy catch
    }
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev
      localStorage.setItem('fitzone_sound_enabled', String(next))
      if (next) {
        setTimeout(playPop, 50)
      }
      return next
    })
  }

  // Attach global subtle click sound for buttons and links
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!soundEnabled) return
      const target = e.target.closest('button, a, [role="button"]')
      // Skip if explicitly muted or audio toggle itself
      if (target && !target.hasAttribute('data-no-sound') && !target.closest('#sound-toggle-btn')) {
        playClick()
      }
    }

    document.addEventListener('click', handleGlobalClick, { passive: true })
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [soundEnabled])

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick, playPop, playSuccess }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    return {
      soundEnabled: false,
      toggleSound: () => {},
      playClick: () => {},
      playPop: () => {},
      playSuccess: () => {},
    }
  }
  return ctx
}
