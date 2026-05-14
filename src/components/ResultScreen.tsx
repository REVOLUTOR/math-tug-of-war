import React, { useEffect, useState } from 'react'
import type { Team } from '../types/game'
import { playApplause } from '../utils/sounds'

const BLUE   = '#1565C0'
const PINK   = '#E91E8C'
const ORANGE = '#F97316'

function CheerFigure({ team, index }: { team: 'A' | 'B'; index: number }) {
  const isA = team === 'A'
  const id  = `ch_${team}_${index}`

  const shirtColor = isA ? '#1565C0' : '#E91E8C'
  const shirtDark  = isA ? '#0a2a70' : '#8a0f5a'
  const shirtLight = isA ? '#5aaaf8' : '#f87ec8'

  const hairPalette = ['#1a0800', '#0d0d0d', '#3a2000', '#1a0800', '#2d1500', '#0a0a0a']
  const skinBase    = ['#FFCBA4', '#F5B888', '#E8A878', '#FFCBA4', '#F2C090', '#E5A870']
  const skinDark    = ['#C07840', '#B06030', '#A05828', '#C07840', '#B07030', '#9A5020']

  const hair = hairPalette[index % hairPalette.length]
  const sb   = skinBase[index % skinBase.length]
  const sd   = skinDark[index % skinDark.length]

  const delay = index * 0.14

  const hasStar      = index % 3 === 0
  const hasStreamers = index % 3 === 1

  return (
    <div
      style={{
        animation: `cheerBounce 0.62s ease-in-out ${delay}s infinite`,
        display: 'inline-block',
        transformOrigin: 'bottom center',
      }}
    >
      <svg
        width="54" height="124"
        viewBox="0 0 70 155"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <radialGradient id={`csk_${id}`} cx="38%" cy="28%" r="68%">
            <stop offset="0%"   stopColor={sb} />
            <stop offset="100%" stopColor={sd} />
          </radialGradient>
          <linearGradient id={`csh_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={shirtLight} />
            <stop offset="45%"  stopColor={shirtColor} />
            <stop offset="100%" stopColor={shirtDark} />
          </linearGradient>
          <linearGradient id={`cpt_${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1e2870" />
            <stop offset="100%" stopColor="#08091a" />
          </linearGradient>
        </defs>

        {/* Shoes */}
        <ellipse cx="22" cy="149" rx="13" ry="5.5" fill="#111" />
        <ellipse cx="48" cy="149" rx="13" ry="5.5" fill="#0a0a0a" />

        {/* Legs - slightly bent (jumping pose) */}
        <path d="M28 92 Q20 120 22 148"
              stroke={`url(#cpt_${id})`} strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M42 92 Q50 120 48 146"
              stroke={`url(#cpt_${id})`} strokeWidth="13" strokeLinecap="round" fill="none" />

        {/* Torso */}
        <path d="M16 52 Q12 72 16 92 Q35 98 54 92 Q58 72 54 52 Q35 46 16 52Z"
              fill={`url(#csh_${id})`} />
        {/* Shirt collar */}
        <path d="M27 52 L35 60 L43 52" fill="none" stroke={shirtDark} strokeWidth="2" strokeLinejoin="round" />

        {/* Arms raised in V-for-victory */}
        <path d="M17 60 Q5 38 1 16"
              stroke={`url(#csk_${id})`} strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M53 60 Q65 38 69 16"
              stroke={`url(#csk_${id})`} strokeWidth="10" strokeLinecap="round" fill="none" />

        {/* Hands */}
        <ellipse cx="1"  cy="14" rx="8" ry="9" fill={`url(#csk_${id})`} />
        <ellipse cx="69" cy="14" rx="8" ry="9" fill={`url(#csk_${id})`} />

        {/* Neck */}
        <ellipse cx="35" cy="44" rx="7" ry="9" fill={`url(#csk_${id})`} />

        {/* Head */}
        <ellipse cx="35" cy="26" rx="15" ry="17" fill={`url(#csk_${id})`}
                 transform="rotate(-4, 35, 26)" />

        {/* Hair */}
        <ellipse cx="35" cy="13" rx="16" ry="11" fill={hair} />
        <path d="M19 21 Q35 7 51 21 Q50 11 35 8 Q20 11 19 21Z" fill={hair} />
        {/* Ear */}
        <ellipse cx="19" cy="27" rx="3.5" ry="5" fill={sd} />

        {/* Happy face */}
        {/* Eye whites */}
        <ellipse cx="27" cy="23" rx="4"   ry="3.5" fill="white" />
        <ellipse cx="43" cy="23" rx="4"   ry="3.5" fill="white" />
        {/* Pupils - looking up, excited */}
        <circle cx="27"   cy="21.5" r="2.2" fill="#0a0a0a" />
        <circle cx="43"   cy="21.5" r="2.2" fill="#0a0a0a" />
        {/* Eye shine */}
        <circle cx="28"   cy="20.4" r="0.9" fill="white" opacity="0.9" />
        <circle cx="44"   cy="20.4" r="0.9" fill="white" opacity="0.9" />
        {/* Raised happy brows */}
        <path d="M23 15 Q27 17 31 15" stroke={hair} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M39 15 Q43 17 47 15" stroke={hair} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* BIG smile */}
        <path d="M25 33 Q35 42 45 33" stroke="#7a3010" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M25 33 Q35 42 45 33 L45 36 Q35 45 25 36Z" fill="white" opacity="0.72" />
        {/* Rosy cheeks */}
        <ellipse cx="22" cy="30" rx="5.5" ry="3.5" fill="#FF9999" opacity="0.40" />
        <ellipse cx="48" cy="30" rx="5.5" ry="3.5" fill="#FF9999" opacity="0.40" />
        {/* Nose */}
        <path d="M33 28 Q35 31 37 28" stroke={sd} strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Headband (team color) */}
        <path d="M19 17 Q35 10 51 17" stroke={shirtColor} strokeWidth="4.5"
              fill="none" strokeLinecap="round" opacity="0.9" />

        {/* Head shine */}
        <ellipse cx="26" cy="15" rx="7" ry="4" fill="white" opacity="0.10" />

        {/* Accessories (alternate per figure) */}
        {hasStar && (
          <g transform="translate(1, 6)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, si) => (
              <line key={si}
                x1="0" y1="0"
                x2={Math.round(Math.cos(deg * Math.PI / 180) * 10)}
                y2={Math.round(Math.sin(deg * Math.PI / 180) * 10)}
                stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
            ))}
            <circle cx="0" cy="0" r="4.5" fill="#FBBF24" />
          </g>
        )}
        {hasStreamers && (
          <g transform="translate(69, 6)">
            <rect x="-6" y="-9" width="12" height="5" rx="2"
                  fill={shirtColor} transform="rotate(25)" opacity="0.9" />
            <rect x="-4" y="2" width="8" height="4" rx="1.5"
                  fill={ORANGE} transform="rotate(-15)" opacity="0.85" />
          </g>
        )}
        {!hasStar && !hasStreamers && (
          <g transform="translate(69, 6)">
            {[0, 60, 120, 180, 240, 300].map((deg, si) => (
              <line key={si}
                x1="0" y1="0"
                x2={Math.round(Math.cos(deg * Math.PI / 180) * 8)}
                y2={Math.round(Math.sin(deg * Math.PI / 180) * 8)}
                stroke={PINK} strokeWidth="2" strokeLinecap="round" />
            ))}
            <circle cx="0" cy="0" r="3.5" fill={PINK} />
          </g>
        )}
      </svg>
    </div>
  )
}

interface Piece {
  id: number; left: number; color: string; delay: number; duration: number; size: number
  shape: 'square' | 'circle' | 'triangle'
}
const COLORS = [BLUE, PINK, ORANGE, '#FBBF24', '#22C55E', '#A855F7', '#ffffff', '#60a5fa', '#f9a8d4']
function makeConfetti(n = 80): Piece[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left:     Math.random() * 100,
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
    delay:    Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    size:     7 + Math.floor(Math.random() * 12),
    shape:    (['square', 'circle', 'triangle'] as const)[Math.floor(Math.random() * 3)],
  }))
}

interface Props {
  winner: Team | 'draw'
  winReason: 'rope' | 'timer' | 'questions' | null
  teamAName: string
  teamBName: string
  scoreA: number
  scoreB: number
  soundEnabled: boolean
  onPlayAgain: () => void
  onMainMenu: () => void
}

const REASON_TEXT: Record<string, string> = {
  rope:      'by pulling the rope all the way!',
  timer:     'when time ran out!',
  questions: 'by answering the most questions!',
}

export default function ResultScreen({
  winner, winReason, teamAName, teamBName, scoreA, scoreB, soundEnabled, onPlayAgain, onMainMenu,
}: Props) {
  const [confetti] = useState<Piece[]>(() => makeConfetti(80))
  const [visible,  setVisible]  = useState(false)

  useEffect(() => {
    setVisible(true)
    if (soundEnabled) setTimeout(() => playApplause(), 200)
  }, [])

  const winnerName  = winner === 'A' ? teamAName : winner === 'B' ? teamBName : null
  const winnerColor = winner === 'A' ? BLUE : winner === 'B' ? PINK : '#6B7280'
  const reasonText  = winReason ? (REASON_TEXT[winReason] ?? '') : ''

  const topFigures: Array<{ team: Team; idx: number }> = winner === 'draw'
    ? [
        { team: 'A', idx: 0 }, { team: 'A', idx: 1 }, { team: 'A', idx: 2 },
        { team: 'B', idx: 0 }, { team: 'B', idx: 1 }, { team: 'B', idx: 2 },
      ]
    : Array.from({ length: 6 }, (_, i) => ({ team: winner as Team, idx: i }))

  return (
    <div
      className="min-h-screen flex flex-col items-center overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #06091a 0%, #0a1240 50%, #12082a 100%)' }}
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.06 }}>
        <img src={import.meta.env.BASE_URL + "school-logo.png"} alt="" style={{ width: '62vmin', objectFit: 'contain' }} />
      </div>

      {/* Winner glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 50% 30%, ${winnerColor}30 0%, transparent 60%)` }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 50% 100%, ${ORANGE}16 0%, transparent 50%)` }} />

      {/* Confetti */}
      {winner !== 'draw' && confetti.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          backgroundColor: p.shape !== 'triangle' ? p.color : 'transparent',
          width: p.size, height: p.size,
          borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '3px' : 0,
          borderLeft:   p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
          borderRight:  p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
          borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
          animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
        }} />
      ))}

      {/* CHEERING FIGURES ROW */}
      <div
        className="relative z-10 flex items-end justify-center gap-1 pt-6 px-4 w-full"
        style={{
          background: `linear-gradient(180deg, ${winnerColor}18 0%, transparent 100%)`,
          borderBottom: `1px solid ${winnerColor}22`,
          paddingBottom: 4,
        }}
      >
        {topFigures.map((f, i) => (
          <CheerFigure key={`${f.team}-${f.idx}-${i}`} team={f.team} index={f.idx} />
        ))}
      </div>

      {/* RESULT CARD */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 w-full">
        <div
          className={`flex flex-col items-center gap-5 rounded-3xl p-8 max-w-lg w-full transition-all duration-500 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: `2px solid ${winnerColor}55`,
            backdropFilter: 'blur(18px)',
            boxShadow: `0 0 60px ${winnerColor}44, 0 0 120px ${winnerColor}18`,
          }}
        >
          {/* Trophy / icon */}
          <div className="text-7xl" style={{ animation: 'cheerBounce 0.9s ease-in-out 0.3s infinite' }}>
            {winner === 'draw' ? '🤝' : '🏆'}
          </div>

          {winner === 'draw' ? (
            <div className="text-center">
              <h1 className="text-4xl font-black text-gray-300">It's a Draw!</h1>
              <p className="text-gray-500 mt-1">Both teams played equally well</p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-5xl font-black"
                  style={{ color: winnerColor, textShadow: `0 0 30px ${winnerColor}88` }}>
                {winnerName} Wins!
              </h1>
              <p className="text-gray-400 mt-1">{reasonText}</p>
            </div>
          )}

          {/* Scores */}
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 rounded-2xl"
                 style={{
                   background: winner === 'A' ? `${BLUE}22` : 'rgba(255,255,255,0.04)',
                   border: `1.5px solid ${winner === 'A' ? BLUE + '88' : 'rgba(255,255,255,0.08)'}`,
                   boxShadow: winner === 'A' ? `0 0 20px ${BLUE}44` : 'none',
                 }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: BLUE }}>{teamAName}</span>
              <span className="text-5xl font-black text-white tabular-nums mt-1">{scoreA}</span>
              <span className="text-xs text-gray-500 mt-0.5">correct answers</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl"
                 style={{
                   background: winner === 'B' ? `${PINK}22` : 'rgba(255,255,255,0.04)',
                   border: `1.5px solid ${winner === 'B' ? PINK + '88' : 'rgba(255,255,255,0.08)'}`,
                   boxShadow: winner === 'B' ? `0 0 20px ${PINK}44` : 'none',
                 }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PINK }}>{teamBName}</span>
              <span className="text-5xl font-black text-white tabular-nums mt-1">{scoreB}</span>
              <span className="text-xs text-gray-500 mt-0.5">correct answers</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3">
            <button onClick={onPlayAgain}
              className="w-full py-4 font-black text-xl text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-95 focus:outline-none"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, #082060, ${PINK}88)`,
                boxShadow: `0 0 28px ${BLUE}55, 0 0 14px ${PINK}33`,
                border: `1px solid ${BLUE}55`,
              }}>
              🔄 Play Again
            </button>
            <button onClick={onMainMenu}
              className="w-full py-3 font-semibold text-lg text-gray-400 rounded-2xl transition-all hover:text-white hover:scale-[1.01] active:scale-95 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>

      <footer className="relative z-10 pb-3 text-xs text-gray-700 text-center">
        Developed by <span className="text-gray-600 font-semibold">Brightino Tech Lab</span>
      </footer>
    </div>
  )
}
