import React, { useState, useEffect } from 'react'

// ── Change this to whatever access code you want ──────────────────────────────
const ACCESS_PIN = '2025'
// ─────────────────────────────────────────────────────────────────────────────

const BLUE   = '#1565C0'
const PINK   = '#E91E8C'
const ORANGE = '#F97316'

interface Props {
  onUnlock: () => void
}

export default function PinScreen({ onUnlock }: Props) {
  const [input,   setInput]   = useState('')
  const [error,   setError]   = useState(false)
  const [shake,   setShake]   = useState(false)
  const [locked,  setLocked]  = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockTimer, setLockTimer] = useState(0)

  // Countdown when locked out
  useEffect(() => {
    if (lockTimer <= 0) return
    const t = setTimeout(() => setLockTimer(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [lockTimer])

  useEffect(() => {
    if (lockTimer === 0 && locked) {
      setLocked(false)
      setInput('')
      setError(false)
    }
  }, [lockTimer, locked])

  function handleDigit(d: string) {
    if (locked) return
    if (input.length >= ACCESS_PIN.length) return
    const next = input + d
    setInput(next)
    setError(false)

    if (next.length === ACCESS_PIN.length) {
      if (next === ACCESS_PIN) {
        sessionStorage.setItem('mtow_auth', '1')
        onUnlock()
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setError(true)
        setShake(true)
        setTimeout(() => { setShake(false); setInput('') }, 600)
        // Lock for 30s after 5 wrong attempts
        if (newAttempts >= 5) {
          setLocked(true)
          setLockTimer(30)
          setAttempts(0)
        }
      }
    }
  }

  function handleClear() {
    if (locked) return
    setInput(prev => prev.slice(0, -1))
    setError(false)
  }

  const DIGITS = ['1','2','3','4','5','6','7','8','9','←','0','✓']

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'linear-gradient(160deg, #06091a 0%, #0a1240 45%, #12082a 100%)' }}
    >
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 20% 40%, ${BLUE}28 0%, transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 80% 60%, ${PINK}20 0%, transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 50% 95%, ${ORANGE}14 0%, transparent 50%)` }} />

      {/* Logo */}
      <img
        src={import.meta.env.BASE_URL + 'school-logo.png'}
        alt="Bright Schools"
        className="mb-4 z-10"
        style={{ width: 72, height: 72, objectFit: 'contain' }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-xs rounded-3xl p-6 flex flex-col items-center gap-5"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(16px)',
          boxShadow: `0 0 50px ${BLUE}22, 0 0 50px ${PINK}14`,
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">🔒 Enter Access Code</h1>
          <p className="text-xs text-gray-500 mt-1">Authorised personnel only</p>
        </div>

        {/* PIN dots */}
        <div
          className={`flex gap-3 ${shake ? 'animate-shake' : ''}`}
          style={{ animation: shake ? 'pinShake 0.5s ease-in-out' : undefined }}
        >
          {Array.from({ length: ACCESS_PIN.length }, (_, i) => {
            const filled = i < input.length
            return (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150"
                style={{
                  background: filled
                    ? error ? 'rgba(239,68,68,0.4)' : `${BLUE}40`
                    : 'rgba(255,255,255,0.08)',
                  border: `2.5px solid ${
                    filled ? (error ? '#ef4444' : BLUE) : 'rgba(255,255,255,0.15)'
                  }`,
                  boxShadow: filled && !error ? `0 0 10px ${BLUE}55` : 'none',
                }}
              >
                {filled && (
                  <div className="w-3 h-3 rounded-full"
                       style={{ background: error ? '#ef4444' : '#fff' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Error / lock message */}
        {locked ? (
          <p className="text-sm font-semibold text-red-400">
            Too many attempts. Wait {lockTimer}s…
          </p>
        ) : error ? (
          <p className="text-sm font-semibold text-red-400">Wrong code. Try again.</p>
        ) : (
          <div className="h-5" />
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {DIGITS.map(d => {
            const isBack   = d === '←'
            const isSubmit = d === '✓'
            return (
              <button
                key={d}
                onClick={() => d === '←' ? handleClear() : d === '✓' ? undefined : handleDigit(d)}
                disabled={locked}
                className="h-12 rounded-2xl font-black text-lg transition-all active:scale-90 select-none"
                style={{
                  background: isBack
                    ? 'rgba(255,255,255,0.08)'
                    : isSubmit
                    ? 'rgba(255,255,255,0.04)'
                    : `${BLUE}30`,
                  border: `1.5px solid ${
                    isBack || isSubmit ? 'rgba(255,255,255,0.10)' : `${BLUE}55`
                  }`,
                  color: isBack ? '#9ca3af' : '#fff',
                  opacity: locked ? 0.4 : 1,
                }}
              >
                {d}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-gray-700 text-center">
          Developed by <span className="text-gray-600 font-semibold">Brightino Tech Lab</span>
        </p>
      </div>
    </div>
  )
}
