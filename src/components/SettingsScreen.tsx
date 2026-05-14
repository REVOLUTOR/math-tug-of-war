import React, { useState } from 'react'
import type { GameSettings, Difficulty, InputMode, Operation } from '../types/game'

interface Props {
  onStart: (settings: GameSettings) => void
  onBack: () => void
}

// School colours: blue, pink, orange, white
const BLUE   = '#1565C0'
const PINK   = '#E91E8C'
const ORANGE = '#F97316'

const TIMER_OPTIONS = [
  { label: '1 min',  value: 60  },
  { label: '2 min',  value: 120 },
  { label: '5 min',  value: 300 },
]
const Q_OPTIONS = [5, 10, 20, 30]

export default function SettingsScreen({ onStart, onBack }: Props) {
  const [teamAName,    setTeamAName]    = useState('Team A')
  const [teamBName,    setTeamBName]    = useState('Team B')
  const [inputMode,    setInputMode]    = useState<InputMode>('dual-keyboard')
  const [difficulty,   setDifficulty]   = useState<Difficulty>('easy')
  const [timerSec,     setTimerSec]     = useState(60)
  const [useCustomT,   setUseCustomT]   = useState(false)
  const [customTimer,  setCustomTimer]  = useState('')
  const [operations,   setOperations]   = useState<Operation[]>(['addition'])
  const [qLimit,       setQLimit]       = useState<number | null>(null)
  const [useCustomQ,   setUseCustomQ]   = useState(false)
  const [customQ,      setCustomQ]      = useState('')

  function handleStart() {
    const finalTimer = useCustomT
      ? Math.min(Math.max(parseInt(customTimer) || 60, 10), 600)
      : timerSec
    const finalQ = useCustomQ
      ? (parseInt(customQ) > 0 ? Math.min(parseInt(customQ), 200) : null)
      : qLimit
    onStart({
      teamAName:     teamAName.trim() || 'Team A',
      teamBName:     teamBName.trim() || 'Team B',
      inputMode,
      difficulty,
      operations:    operations.length > 0 ? operations : ['addition'],
      timerSeconds:  finalTimer,
      questionLimit: finalQ,
    })
  }

  function chip(
    active: boolean,
    color: string,
    onClick: () => void,
    label: React.ReactNode,
    sub?: string
  ) {
    return (
      <button
        key={String(label)}
        onClick={onClick}
        className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all text-center"
        style={{
          background: active ? `${color}22` : 'rgba(255,255,255,0.05)',
          border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.10)'}`,
          boxShadow: active ? `0 0 14px ${color}55` : 'none',
          color: active ? color : 'rgba(255,255,255,0.6)',
        }}
      >
        <span className="font-bold text-sm leading-tight">{label}</span>
        {sub && <span className="text-xs mt-0.5 opacity-70">{sub}</span>}
      </button>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #06091a 0%, #0a1240 45%, #12082a 100%)' }}
    >
      {/* School-colour radial glows */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 12% 35%, ${BLUE}28 0%, transparent 50%)` }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 88% 65%, ${PINK}22 0%, transparent 50%)` }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 50% 100%, ${ORANGE}18 0%, transparent 50%)` }} />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.055 }}>
        <img src="/school-logo.png" alt="" style={{ width: '52vmin', objectFit: 'contain' }} />
      </div>

      <div
        className="relative z-10 w-full max-w-2xl rounded-3xl p-8 flex flex-col gap-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(14px)',
          boxShadow: `0 0 60px ${BLUE}18, 0 0 60px ${PINK}12`,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-xl font-bold transition-colors w-8">←</button>
          <h2 className="text-3xl font-black text-white">Game Setup</h2>
          <img src="/school-logo.png" alt="" className="ml-auto" style={{ width: 38, height: 38, objectFit: 'contain', opacity: 0.75 }} />
        </div>

        {/* ── Team names ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: BLUE }}>Team A Name</label>
            <input
              className="rounded-xl px-4 py-3 text-lg font-semibold text-white focus:outline-none"
              style={{ background: `${BLUE}18`, border: `2px solid ${BLUE}55` }}
              value={teamAName} onChange={e => setTeamAName(e.target.value)} maxLength={20} placeholder="Team A"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>Team B Name</label>
            <input
              className="rounded-xl px-4 py-3 text-lg font-semibold text-white focus:outline-none"
              style={{ background: `${PINK}18`, border: `2px solid ${PINK}55` }}
              value={teamBName} onChange={e => setTeamBName(e.target.value)} maxLength={20} placeholder="Team B"
            />
          </div>
        </div>

        {/* ── Input mode ── */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Input Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {chip(inputMode === 'dual-keyboard', BLUE, () => setInputMode('dual-keyboard'),
              '⌨️ Dual Keyboard', 'Team A: keys  ·  Team B: numpad')}
            {chip(inputMode === 'touchscreen', BLUE, () => setInputMode('touchscreen'),
              '📱 Touchscreen', 'On-screen pads for both teams')}
          </div>
        </div>

        {/* ── Difficulty ── */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {chip(difficulty === 'easy',   BLUE,   () => setDifficulty('easy'),   '🌱 Easy',   '1 – 10')}
            {chip(difficulty === 'medium', ORANGE, () => setDifficulty('medium'), '⚡ Medium', '1 – 50')}
            {chip(difficulty === 'hard',   PINK,   () => setDifficulty('hard'),   '🔥 Hard',   '1 – 100')}
          </div>
        </div>

        {/* ── Operations ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">🧮 Operations</label>
            <span className="text-xs text-gray-600">Select one or more</span>
          </div>

          {/* Individual toggles */}
          <div className="grid grid-cols-3 gap-3">
            {([
              { op: 'addition'       as Operation, label: '➕ Addition',       sub: 'a + b', color: BLUE   },
              { op: 'subtraction'    as Operation, label: '➖ Subtraction',    sub: 'a − b', color: ORANGE },
              { op: 'multiplication' as Operation, label: '✖️ Multiply',       sub: 'a × b', color: PINK   },
            ]).map(({ op, label, sub, color }) => {
              const active = operations.includes(op)
              return (
                <button
                  key={op}
                  onClick={() => {
                    setOperations(prev => {
                      if (prev.includes(op)) {
                        // Don't remove the last one
                        return prev.length === 1 ? prev : prev.filter(o => o !== op)
                      }
                      return [...prev, op]
                    })
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all relative"
                  style={{
                    background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.10)'}`,
                    boxShadow: active ? `0 0 14px ${color}55` : 'none',
                    color: active ? color : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {/* Active tick badge */}
                  {active && (
                    <span className="absolute top-1.5 right-2 text-xs font-black"
                          style={{ color }}>✓</span>
                  )}
                  <span className="font-bold text-sm leading-tight">{label}</span>
                  <span className="text-xs mt-0.5 opacity-60 font-mono">{sub}</span>
                </button>
              )
            })}
          </div>

          {/* Quick-pick combos */}
          <div className="flex flex-wrap gap-2">
            {([
              { label: '➕ Only',          ops: ['addition']                              as Operation[] },
              { label: '➖ Only',          ops: ['subtraction']                           as Operation[] },
              { label: '✖️ Only',          ops: ['multiplication']                        as Operation[] },
              { label: '➕➖ Mix',         ops: ['addition','subtraction']                as Operation[] },
              { label: '➕✖️ Mix',         ops: ['addition','multiplication']             as Operation[] },
              { label: '➖✖️ Mix',         ops: ['subtraction','multiplication']          as Operation[] },
              { label: '🎲 All Three',     ops: ['addition','subtraction','multiplication'] as Operation[] },
            ]).map(({ label, ops }) => {
              const active = ops.length === operations.length &&
                             ops.every(o => operations.includes(o))
              return (
                <button
                  key={label}
                  onClick={() => setOperations(ops)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: active ? `${BLUE}28` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${active ? BLUE : 'rgba(255,255,255,0.10)'}`,
                    color: active ? '#90caf9' : 'rgba(255,255,255,0.45)',
                    boxShadow: active ? `0 0 8px ${BLUE}44` : 'none',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Preview of what will be asked */}
          <div className="text-xs text-gray-600 px-1">
            {operations.length === 1
              ? `Questions will use ${operations[0]} only`
              : `Questions will randomly mix: ${operations.join(', ')}`}
            {operations.includes('multiplication') && (
              <span className="ml-1 text-yellow-700">
                · Multiply range: {
                  operations.includes('multiplication')
                    ? `1–${['easy','medium','hard'].includes('easy') ? 5 : 12} × 1–${['easy','medium','hard'].includes('easy') ? 5 : 12}`
                    : ''
                }
              </span>
            )}
          </div>
        </div>

        {/* ── Timer ── */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">⏱ Timer</label>
          <div className="grid grid-cols-4 gap-2">
            {TIMER_OPTIONS.map(opt =>
              chip(!useCustomT && timerSec === opt.value, BLUE,
                () => { setTimerSec(opt.value); setUseCustomT(false) }, opt.label)
            )}
            {chip(useCustomT, ORANGE, () => setUseCustomT(true), 'Custom')}
          </div>
          {useCustomT && (
            <div className="flex items-center gap-3 mt-1">
              <input type="number" min={10} max={600}
                className="rounded-xl px-4 py-2 w-32 text-lg font-semibold text-white focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.2)' }}
                placeholder="seconds" value={customTimer} onChange={e => setCustomTimer(e.target.value)} />
              <span className="text-sm text-gray-500">seconds (10 – 600)</span>
            </div>
          )}
        </div>

        {/* ── Number of questions ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">🎯 Questions per Game</label>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${PINK}22`, color: PINK }}>
              optional
            </span>
          </div>
          <p className="text-xs text-gray-600 -mt-1">
            Game ends when total correct answers reaches this number. Works alongside the timer — whichever triggers first wins.
          </p>
          <div className="grid grid-cols-5 gap-2">
            {/* None option */}
            {chip(!useCustomQ && qLimit === null, 'rgba(255,255,255,0.5)',
              () => { setQLimit(null); setUseCustomQ(false) }, 'None', 'no limit')}

            {Q_OPTIONS.map(n =>
              chip(!useCustomQ && qLimit === n, PINK,
                () => { setQLimit(n); setUseCustomQ(false) }, String(n), 'questions')
            )}

            {chip(useCustomQ, ORANGE, () => setUseCustomQ(true), 'Custom')}
          </div>
          {useCustomQ && (
            <div className="flex items-center gap-3 mt-1">
              <input type="number" min={1} max={200}
                className="rounded-xl px-4 py-2 w-32 text-lg font-semibold text-white focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: `2px solid ${PINK}55` }}
                placeholder="e.g. 15" value={customQ} onChange={e => setCustomQ(e.target.value)} />
              <span className="text-sm text-gray-500">total correct answers (1 – 200)</span>
            </div>
          )}
        </div>

        {/* ── Summary badges ── */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { label: difficulty.toUpperCase(),                                                                color: difficulty === 'easy' ? BLUE : difficulty === 'medium' ? ORANGE : PINK },
            { label: operations.map(o => o === 'addition' ? '➕' : o === 'subtraction' ? '➖' : '✖️').join(' '), color: BLUE   },
            { label: useCustomT ? `${customTimer || '?'}s` : TIMER_OPTIONS.find(o => o.value === timerSec)?.label ?? '', color: ORANGE },
            { label: useCustomQ ? `${customQ || '?'} Qs` : qLimit ? `${qLimit} Qs` : 'Unlimited Qs',        color: PINK   },
            { label: inputMode === 'dual-keyboard' ? 'Keyboard' : 'Touch',                                   color: ORANGE },
          ].map(b => b.label ? (
            <span key={b.label} className="px-3 py-1 rounded-full font-semibold"
                  style={{ background: `${b.color}22`, color: b.color, border: `1px solid ${b.color}44` }}>
              {b.label}
            </span>
          ) : null)}
        </div>

        {/* ── Start button ── */}
        <button onClick={handleStart}
          className="py-4 font-black text-xl text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-95 focus:outline-none"
          style={{
            background: `linear-gradient(135deg, ${BLUE}, #0a2a70, ${PINK}88)`,
            boxShadow: `0 0 30px ${BLUE}55, 0 4px 20px rgba(0,0,0,0.4)`,
            border: `1px solid ${BLUE}66`,
          }}>
          ⚔️ Start Match
        </button>
      </div>

      <footer className="mt-5 text-xs text-gray-700 text-center z-10">
        Developed by <span className="text-gray-500 font-semibold">Brightino Tech Lab</span>
      </footer>
    </div>
  )
}
