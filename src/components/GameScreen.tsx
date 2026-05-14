import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { GameState, Team } from '../types/game'
import QuestionPanel from './QuestionPanel'
import RopeAnimation from './RopeAnimation'
import NumberPad from './NumberPad'
import { playCorrect, playWrong } from '../utils/sounds'

interface Props {
  state: GameState
  submitAnswer: (team: Team, value: number) => void
  pause: () => void
  resume: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

const A_COLOR = '#1565C0'   // school blue
const B_COLOR = '#E91E8C'   // school pink
const ORANGE  = '#F97316'   // school orange

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function GameScreen({ state, submitAnswer, pause, resume, soundEnabled, onToggleSound }: Props) {
  const [inputA, setInputA] = useState('')
  const [inputB, setInputB] = useState('')
  const inputARef = useRef<HTMLInputElement>(null)

  const isKeyboard   = state.settings.inputMode === 'dual-keyboard'
  const timeCritical = state.timeLeft <= 10 && state.timeLeft > 0

  const totalAnswered = state.scoreA + state.scoreB
  const { questionLimit } = state.settings
  const qProgress = questionLimit ? `${totalAnswered} / ${questionLimit}` : null

  // Sound on flash/shake
  const prevFlashA = useRef(false), prevFlashB = useRef(false)
  const prevShakeA = useRef(false), prevShakeB = useRef(false)
  useEffect(() => {
    if (state.flashA && !prevFlashA.current && soundEnabled) playCorrect()
    if (state.flashB && !prevFlashB.current && soundEnabled) playCorrect()
    prevFlashA.current = state.flashA; prevFlashB.current = state.flashB
  }, [state.flashA, state.flashB, soundEnabled])
  useEffect(() => {
    if (state.shakeA && !prevShakeA.current && soundEnabled) playWrong()
    if (state.shakeB && !prevShakeB.current && soundEnabled) playWrong()
    prevShakeA.current = state.shakeA; prevShakeB.current = state.shakeB
  }, [state.shakeA, state.shakeB, soundEnabled])

  useEffect(() => {
    if (isKeyboard && !state.isPaused && !state.winner) inputARef.current?.focus()
  }, [isKeyboard, state.isPaused, state.winner])

  const prevQ = useRef(state.question)
  useEffect(() => {
    if (state.question !== prevQ.current) {
      setInputA(''); setInputB(''); prevQ.current = state.question
    }
  }, [state.question])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isKeyboard || state.isPaused || state.winner) return
    const numpadMap: Record<string, string> = {
      Numpad0: '0', Numpad1: '1', Numpad2: '2', Numpad3: '3', Numpad4: '4',
      Numpad5: '5', Numpad6: '6', Numpad7: '7', Numpad8: '8', Numpad9: '9',
    }
    if (numpadMap[e.code]) {
      e.preventDefault()
      setInputB(p => p.length < 4 ? p + numpadMap[e.code] : p)
    } else if (e.code === 'NumpadEnter') {
      e.preventDefault()
      if (inputB !== '') { submitAnswer('B', parseInt(inputB, 10)); setInputB('') }
    } else if (e.code === 'NumpadDecimal') {
      e.preventDefault(); setInputB('')
    }
  }, [isKeyboard, inputB, submitAnswer, state.isPaused, state.winner])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  function handleSubmitA(raw: string) {
    if (!raw.trim()) return
    submitAnswer('A', parseInt(raw, 10)); setInputA(''); inputARef.current?.focus()
  }
  function handleSubmitB(raw: string) {
    if (!raw.trim()) return
    submitAnswer('B', parseInt(raw, 10)); setInputB('')
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #06091a 0%, #0a1240 40%, #12082a 100%)' }}
    >
      {/* School logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: 0.055 }}>
        <img src={import.meta.env.BASE_URL + "school-logo.png"} alt="" style={{ width: '55vmin', objectFit: 'contain' }} />
      </div>

      {/* Radial corner glows - school colours */}
      <div className="absolute inset-0 pointer-events-none z-0"
           style={{ background: `radial-gradient(ellipse at top left, ${A_COLOR}22 0%, transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none z-0"
           style={{ background: `radial-gradient(ellipse at top right, ${B_COLOR}20 0%, transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none z-0"
           style={{ background: `radial-gradient(ellipse at bottom center, ${ORANGE}14 0%, transparent 50%)` }} />

      {/* TOP BAR */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3"
           style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Team A */}
        <div className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl transition-all duration-200"
             style={{
               minWidth: 'clamp(80px, 25vw, 155px)',
               background: state.flashA ? 'rgba(34,197,94,0.25)' : `${A_COLOR}18`,
               border: `1.5px solid ${state.flashA ? '#22c55e' : A_COLOR}55`,
               boxShadow: `0 0 18px ${state.flashA ? '#22c55e' : A_COLOR}${state.flashA ? '88' : '22'}`,
             }}>
          <div className="w-1.5 sm:w-2 h-7 sm:h-9 rounded-full" style={{ background: A_COLOR, boxShadow: `0 0 8px ${A_COLOR}` }} />
          <div>
            <div className="text-xs font-bold uppercase tracking-widest truncate max-w-[70px] sm:max-w-none" style={{ color: A_COLOR }}>{state.settings.teamAName}</div>
            <div className="text-2xl sm:text-4xl font-black tabular-nums text-white leading-tight">{state.scoreA}</div>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-0.5">
          <div
            className={`text-3xl sm:text-5xl font-black tabular-nums leading-none transition-all ${timeCritical ? 'pulse-red' : 'text-white'}`}
            style={timeCritical ? {} : { textShadow: '0 0 24px rgba(255,255,255,0.35)' }}
          >
            {formatTime(state.timeLeft)}
          </div>

          {/* Question progress badge */}
          {qProgress && (
            <div className="text-xs font-bold px-3 py-0.5 rounded-full"
                 style={{ background: `${ORANGE}22`, color: ORANGE, border: `1px solid ${ORANGE}55` }}>
              🎯 {qProgress} questions
            </div>
          )}

          <div className="flex gap-2 mt-1">
            {state.isPaused ? (
              <button onClick={resume} className="px-4 py-1 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-lg transition-all">
                ▶ Resume
              </button>
            ) : (
              <button onClick={pause} className="px-4 py-1 text-sm font-bold rounded-lg transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.65)' }}>
                ⏸ Pause
              </button>
            )}
            <button onClick={onToggleSound} className="px-3 py-1 text-sm rounded-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* Team B */}
        <div className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-2xl transition-all duration-200"
             style={{
               minWidth: 'clamp(80px, 25vw, 155px)',
               justifyContent: 'flex-end',
               background: state.flashB ? 'rgba(34,197,94,0.25)' : `${B_COLOR}18`,
               border: `1.5px solid ${state.flashB ? '#22c55e' : B_COLOR}55`,
               boxShadow: `0 0 18px ${state.flashB ? '#22c55e' : B_COLOR}${state.flashB ? '88' : '22'}`,
             }}>
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest truncate max-w-[70px] sm:max-w-none" style={{ color: B_COLOR }}>{state.settings.teamBName}</div>
            <div className="text-2xl sm:text-4xl font-black tabular-nums text-white leading-tight">{state.scoreB}</div>
          </div>
          <div className="w-1.5 sm:w-2 h-7 sm:h-9 rounded-full" style={{ background: B_COLOR, boxShadow: `0 0 8px ${B_COLOR}` }} />
        </div>
      </div>

      {/* Pause overlay */}
      {state.isPaused && (
        <div className="absolute inset-0 z-50 flex items-center justify-center"
             style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-col items-center gap-5 p-10 rounded-3xl"
               style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span className="text-6xl">⏸</span>
            <h2 className="text-3xl font-black text-white">Paused</h2>
            <p className="text-gray-400">Teacher can review or discuss</p>
            {qProgress && (
              <p className="text-sm font-semibold" style={{ color: ORANGE }}>Progress: {qProgress} correct answers</p>
            )}
            <button onClick={resume} className="px-10 py-3 text-white text-xl font-bold rounded-2xl transition-all hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${A_COLOR}, #0a2a70)`, boxShadow: `0 0 20px ${A_COLOR}55` }}>
              ▶ Resume
            </button>
          </div>
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col z-10 px-3 pt-2 pb-2 gap-2">

        {/* Question panel */}
        <div className="flex justify-center">
          <div className="px-4 sm:px-10 py-3 sm:py-4 rounded-3xl"
               style={{
                 background: 'rgba(255,255,255,0.05)',
                 border: '1.5px solid rgba(255,255,255,0.10)',
                 boxShadow: `0 0 28px ${A_COLOR}18, 0 0 28px ${B_COLOR}12`,
               }}>
            <QuestionPanel question={state.question} />
          </div>
        </div>

        {/* Inputs */}
        {isKeyboard ? (
          <div className="flex gap-3">
            <div className={`flex-1 flex flex-col items-center gap-1 ${state.shakeA ? 'flash-red-shake' : ''}`}>
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: A_COLOR }}>
                {state.settings.teamAName} — type &amp; Enter
              </label>
              <div className="flex w-full max-w-xs gap-2">
                <input ref={inputARef} type="number"
                  className="flex-1 rounded-xl px-4 py-3 text-2xl font-black text-center text-white focus:outline-none"
                  style={{ background: `${A_COLOR}18`, border: `2px solid ${A_COLOR}55`, boxShadow: `0 0 10px ${A_COLOR}18` }}
                  value={inputA} onChange={e => setInputA(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSubmitA(inputA) } }}
                  placeholder="?" disabled={!!state.winner || state.isPaused} autoComplete="off" />
                <button onClick={() => handleSubmitA(inputA)} disabled={!!state.winner || state.isPaused}
                  className="px-4 rounded-xl font-bold text-white transition-all active:scale-95"
                  style={{ background: A_COLOR, boxShadow: `0 0 10px ${A_COLOR}55` }}>✓</button>
              </div>
            </div>

            <div className={`flex-1 flex flex-col items-center gap-1 ${state.shakeB ? 'flash-red-shake' : ''}`}>
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: B_COLOR }}>
                {state.settings.teamBName} — numpad + Enter
              </label>
              <div className="flex w-full max-w-xs gap-2">
                <div className="flex-1 rounded-xl px-4 py-3 text-2xl font-black text-center text-white"
                     style={{ background: `${B_COLOR}18`, border: `2px solid ${B_COLOR}55`, minWidth: 80, boxShadow: `0 0 10px ${B_COLOR}18` }}>
                  {inputB || <span style={{ color: 'rgba(255,255,255,0.18)' }}>?</span>}
                </div>
                <button onClick={() => handleSubmitB(inputB)} disabled={!!state.winner || state.isPaused}
                  className="px-4 rounded-xl font-bold text-white transition-all active:scale-95"
                  style={{ background: B_COLOR, boxShadow: `0 0 10px ${B_COLOR}55` }}>✓</button>
              </div>
              <span className="text-xs text-gray-600">Numpad digits · Enter = submit · . = clear</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className={`flex-1 flex flex-col items-center gap-1 ${state.shakeA ? 'flash-red-shake' : ''}`}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: A_COLOR }}>{state.settings.teamAName}</span>
              <NumberPad team="A" onSubmit={v => submitAnswer('A', v)} disabled={!!state.winner || state.isPaused} />
            </div>
            <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className={`flex-1 flex flex-col items-center gap-1 ${state.shakeB ? 'flash-red-shake' : ''}`}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: B_COLOR }}>{state.settings.teamBName}</span>
              <NumberPad team="B" onSubmit={v => submitAnswer('B', v)} disabled={!!state.winner || state.isPaused} />
            </div>
          </div>
        )}

        {/* Question progress bar (only when limit is set) */}
        {questionLimit && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-semibold" style={{ color: ORANGE, minWidth: 90 }}>
              🎯 {totalAnswered}/{questionLimit} Qs
            </span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-300"
                   style={{
                     width: `${Math.min(100, (totalAnswered / questionLimit) * 100)}%`,
                     background: `linear-gradient(90deg, ${A_COLOR}, ${ORANGE}, ${B_COLOR})`,
                     boxShadow: `0 0 8px ${ORANGE}66`,
                   }} />
            </div>
          </div>
        )}

        {/* Rope */}
        <div className="mt-auto">
          <RopeAnimation
            position={state.ropePosition}
            teamAName={state.settings.teamAName}
            teamBName={state.settings.teamBName}
          />
        </div>
      </div>
    </div>
  )
}
