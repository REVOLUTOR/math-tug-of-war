import React from 'react'

const BLUE   = '#1565C0'
const PINK   = '#E91E8C'
const ORANGE = '#F97316'

interface Props {
  onStart: () => void
}

export default function SplashScreen({ onStart }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #06091a 0%, #0a1240 45%, #12082a 100%)' }}
    >
      {/* Logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.065 }}>
        <img src="/school-logo.png" alt="" style={{ width: '62vmin', objectFit: 'contain' }} />
      </div>

      {/* School colour radial glows */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 18% 45%, ${BLUE}28 0%, transparent 50%)` }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 82% 45%, ${PINK}24 0%, transparent 50%)` }} />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: `radial-gradient(ellipse at 50% 95%, ${ORANGE}18 0%, transparent 45%)` }} />

      {/* Mini rope display */}
      <div className="z-10 flex items-center mb-5">
        <div className="flex items-center">
          {['🧑‍🎓','🧒','👦'].map((e, i) => (
            <span key={i} className="text-3xl select-none"
                  style={{ transform: `rotate(${-8 + i * 3}deg)`, marginRight: -5 }}>{e}</span>
          ))}
        </div>
        <div className="flex flex-col items-center mx-3">
          <div className="w-32 h-3.5 rounded-full"
               style={{
                 background: 'repeating-linear-gradient(90deg,#8B6010 0,#A07820 4px,#8B6010 8px)',
                 boxShadow: '0 2px 10px rgba(160,120,32,0.6)',
               }} />
          <div className="w-6 h-6 rounded-full -mt-4"
               style={{
                 background: 'radial-gradient(circle at 35% 30%, #FFE566, #F5A800)',
                 border: '2.5px solid #C07800',
                 boxShadow: '0 0 14px rgba(255,200,0,0.8)',
               }} />
        </div>
        <div className="flex items-center">
          {['👧','🧒','🧑‍🎓'].map((e, i) => (
            <span key={i} className="text-3xl select-none"
                  style={{ transform: `rotate(${8 - i * 3}deg)`, marginLeft: -5 }}>{e}</span>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="z-10 text-center mb-4">
        <h1 className="font-black leading-none" style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)' }}>
          <span style={{ color: BLUE,   textShadow: `0 0 35px ${BLUE}99` }}>Math </span>
          <span style={{ color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>Tug of </span>
          <span style={{ color: PINK,   textShadow: `0 0 35px ${PINK}99` }}>War</span>
        </h1>
        <p className="text-gray-400 text-base mt-1 tracking-[0.25em] font-medium uppercase">
          Mental Math Showdown
        </p>
      </div>

      {/* School badge */}
      <div className="z-10 mb-8 flex items-center gap-3 px-6 py-3 rounded-2xl"
           style={{
             background: 'rgba(255,255,255,0.055)',
             border: '1px solid rgba(255,255,255,0.12)',
             boxShadow: `0 0 24px ${BLUE}22`,
           }}>
        <img src="/school-logo.png" alt="Bright Schools" style={{ width: 52, height: 52, objectFit: 'contain' }} />
        <div>
          <div className="text-sm font-black text-white leading-tight">Bright English Medium</div>
          <div className="text-xs font-medium" style={{ color: ORANGE }}>Pre &amp; Primary School</div>
          <div className="text-xs text-gray-500 italic">Smart Learning for Bright Future</div>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={onStart}
        className="z-10 px-16 py-5 font-black text-2xl text-white rounded-2xl transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none"
        style={{
          background: `linear-gradient(135deg, ${BLUE}, #082060, ${PINK}88)`,
          boxShadow: `0 0 35px ${BLUE}66, 0 0 20px ${PINK}33, 0 4px 20px rgba(0,0,0,0.5)`,
          border: `1px solid ${BLUE}66`,
        }}
      >
        ⚔️ Start Game
      </button>

      <p className="z-10 mt-4 text-xs text-gray-600 tracking-widest uppercase">
        2 players · single screen · all ages
      </p>

      <footer className="absolute bottom-4 w-full text-center text-xs text-gray-700 z-10">
        Developed by <span className="text-gray-500 font-semibold">Brightino Tech Lab</span>
      </footer>
    </div>
  )
}
