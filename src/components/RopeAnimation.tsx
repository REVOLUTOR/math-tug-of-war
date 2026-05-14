import React, { useState, useEffect } from 'react'

interface Props {
  position: number   // -5 to +5
  teamAName: string
  teamBName: string
}

// ─── Realistic puller figure ────────────────────────────────────────────────
// Team A (LEFT side) leans LEFT (backward), arms reach RIGHT toward rope
// Team B (RIGHT side) leans RIGHT (backward), arms reach LEFT toward rope
function PullerFigure({
  team,
  index,
  ropePosition,
}: {
  team: 'A' | 'B'
  index: number        // 0 = front (closest to rope), 1 = mid, 2 = back
  ropePosition: number // -5..+5
}) {
  const isA = team === 'A'
  const id = `fig_${team}_${index}`

  // How hard this team is pulling (0-5)
  const pullStrength = isA
    ? Math.max(0, ropePosition)
    : Math.max(0, -ropePosition)
  const beingDragged = isA
    ? Math.max(0, -ropePosition)
    : Math.max(0, ropePosition)

  // Lean: backward lean increases with pull strength, decreases when dragged
  const rawLean = 16 + pullStrength * 2.8 - beingDragged * 1.2
  const leanDeg = isA ? -rawLean : rawLean

  // Depth perspective — front figure is larger
  const scales = [1.0, 0.84, 0.70]
  const scale = scales[Math.min(index, 2)]

  const shirtColor  = isA ? '#1565C0' : '#E91E8C'
  const shirtDark   = isA ? '#0a2a70' : '#8a0f5a'
  const shirtLight  = isA ? '#4a90e8' : '#f060b0'

  // Slight variety per figure
  const hairColors  = ['#1a0800', '#0d0d0d', '#3a2000']
  const skinBase    = ['#FFCBA4', '#F5B888', '#E8A878']
  const skinShad    = ['#C07840', '#B06030', '#A05828']
  const hair  = hairColors[index % 3]
  const skinB = skinBase[index % 3]
  const skinS = skinShad[index % 3]

  // Pivot at foot bottom
  const pivX = 35, pivY = 148

  // Hand coords — reach toward rope
  const handX = isA ? 76 : -6
  const handY1 = 62, handY2 = 72

  return (
    <svg
      width={70 * scale}
      height={155 * scale}
      viewBox="0 0 70 155"
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id={`sk_${id}`} cx="38%" cy="30%" r="68%">
          <stop offset="0%"   stopColor={skinB} />
          <stop offset="65%"  stopColor={skinS} />
          <stop offset="100%" stopColor={skinS} />
        </radialGradient>
        <linearGradient id={`sh_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={shirtLight} />
          <stop offset="40%"  stopColor={shirtColor} />
          <stop offset="100%" stopColor={shirtDark} />
        </linearGradient>
        <linearGradient id={`pt_${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1e2870" />
          <stop offset="100%" stopColor="#080c20" />
        </linearGradient>
      </defs>

      {/* Whole figure pivots at feet */}
      <g transform={`translate(${pivX},${pivY}) rotate(${leanDeg}) translate(${-pivX},${-pivY})`}>

        {/* ── SHOES ── */}
        <ellipse cx="20" cy="148" rx="13" ry="6" fill="#111"
                 transform="rotate(-14, 20, 148)" />
        <ellipse cx="50" cy="145" rx="13" ry="6" fill="#0a0a0a"
                 transform="rotate(8, 50, 145)" />

        {/* ── LEGS ── */}
        <path d="M27 90 Q20 118 20 146"
              stroke={`url(#pt_${id})`} strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M43 90 Q50 118 50 143"
              stroke={`url(#pt_${id})`} strokeWidth="13" strokeLinecap="round" fill="none" />

        {/* Knee highlight */}
        <ellipse cx="21" cy="118" rx="7" ry="6"
                 fill="#252e80" opacity="0.7" />
        <ellipse cx="50" cy="116" rx="7" ry="6"
                 fill="#252e80" opacity="0.7" />

        {/* ── TORSO ── */}
        <path d="M14 50 Q12 70 16 90 Q35 97 54 90 Q58 70 56 50 Q35 44 14 50Z"
              fill={`url(#sh_${id})`} />

        {/* Collar */}
        <path d="M27 50 L35 58 L43 50" fill="none" stroke={shirtDark} strokeWidth="2" strokeLinejoin="round" />

        {/* Jersey number */}
        <text x="35" y="76" textAnchor="middle" fontSize="13" fontWeight="900"
              fill="white" opacity="0.55" fontFamily="Arial, sans-serif">
          {index + 1}
        </text>

        {/* ── BACK ARM ── */}
        <path
          d={isA ? 'M16 58 Q8 72 10 86' : 'M54 58 Q62 72 60 86'}
          stroke={`url(#sk_${id})`} strokeWidth="9" strokeLinecap="round" fill="none"
        />

        {/* ── FRONT UPPER ARM ── */}
        <path
          d={isA
            ? `M54 60 Q66 ${handY1 - 4} ${handX} ${handY1 - 6}`
            : `M16 60 Q4 ${handY1 - 4} ${handX} ${handY1 - 6}`}
          stroke={`url(#sk_${id})`} strokeWidth="10" strokeLinecap="round" fill="none"
        />

        {/* ── FRONT FOREARM ── */}
        <path
          d={isA
            ? `M56 70 Q66 ${handY2 - 2} ${handX} ${handY2}`
            : `M14 70 Q4 ${handY2 - 2} ${handX} ${handY2}`}
          stroke={`url(#sk_${id})`} strokeWidth="9" strokeLinecap="round" fill="none"
        />

        {/* ── GRIPPING HANDS ── */}
        <ellipse cx={handX} cy={handY1 - 2} rx="8" ry="9" fill={`url(#sk_${id})`} />
        <ellipse cx={handX} cy={handY2 + 2} rx="8" ry="9" fill={`url(#sk_${id})`} />
        {/* Knuckle lines */}
        <line x1={isA ? handX - 5 : handX - 5} y1={handY1 - 6} x2={isA ? handX + 5 : handX + 5} y2={handY1 - 6}
              stroke={skinS} strokeWidth="1" opacity="0.5" />
        <line x1={isA ? handX - 5 : handX - 5} y1={handY2 - 2} x2={isA ? handX + 5 : handX + 5} y2={handY2 - 2}
              stroke={skinS} strokeWidth="1" opacity="0.5" />

        {/* ── NECK ── */}
        <ellipse cx="35" cy="43" rx="7" ry="9" fill={`url(#sk_${id})`} />

        {/* ── HEAD ── */}
        <ellipse cx="35" cy="24" rx="16" ry="18" fill={`url(#sk_${id})`} />

        {/* ── HAIR ── */}
        <ellipse cx="35" cy="10" rx="17" ry="11" fill={hair} />
        <path d="M18 20 Q35 6 52 20 Q50 10 35 7 Q20 10 18 20Z" fill={hair} />
        {/* Ear */}
        <ellipse cx={isA ? 19 : 51} cy="25" rx="3.5" ry="5" fill={skinS} />

        {/* ── FACE ── */}
        {/* Eyes — whites */}
        <ellipse cx="27" cy="22" rx="4" ry="3.5" fill="white" />
        <ellipse cx="43" cy="22" rx="4" ry="3.5" fill="white" />
        {/* Pupils — looking toward rope */}
        <circle cx={isA ? 28.5 : 26} cy="22.5" r="2.3" fill="#0a0a0a" />
        <circle cx={isA ? 44.5 : 42} cy="22.5" r="2.3" fill="#0a0a0a" />
        {/* Eye shine */}
        <circle cx={isA ? 29.5 : 27} cy="21.2" r="0.9" fill="white" opacity="0.8" />
        <circle cx={isA ? 45.5 : 43} cy="21.2" r="0.9" fill="white" opacity="0.8" />
        {/* Eyebrows — furrowed, determined */}
        <path d={isA ? 'M23 16 Q27 13 31 16' : 'M23 16 Q27 13 31 16'}
              stroke={hair} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d={isA ? 'M39 16 Q43 13 47 16' : 'M39 16 Q43 13 47 16'}
              stroke={hair} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Gritting mouth */}
        <rect x="27" y="33" width="16" height="5" rx="2.5" fill="#7a3010" opacity="0.55" />
        <path d="M28 35 L42 35" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
        {/* Nose */}
        <path d="M33 27 Q35 30 37 27" stroke={skinS} strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* ── HEADBAND ── */}
        <path d="M19 16 Q35 8 51 16" stroke={shirtColor} strokeWidth="4.5"
              fill="none" strokeLinecap="round" opacity="0.9" />

        {/* Head shine */}
        <ellipse cx="27" cy="14" rx="7" ry="4" fill="white" opacity="0.10" />
      </g>
    </svg>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function RopeAnimation({ position, teamAName, teamBName }: Props) {
  const [figCount, setFigCount] = useState(() => window.innerWidth < 640 ? 1 : 3)

  useEffect(() => {
    const handler = () => setFigCount(window.innerWidth < 640 ? 1 : 3)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  // Knot position: 0%=left(B win), 100%=right(A win), 50%=center
  // Rope range is ±15 → map to 0–100%
  const knotPct = 50 + position * (50 / 15)

  // Rope tension visual — how taut each side looks
  const leftSag  = Math.max(6, 28 - (100 - knotPct) * 0.3)
  const rightSag = Math.max(6, 28 - knotPct * 0.3)

  // Pull strength for figures
  const aLean = Math.max(0, position)
  const bLean = Math.max(0, -position)

  const ROPE_W = 600  // viewBox width for rope SVG
  const ROPE_H = 90
  const leftX  = 20
  const rightX = ROPE_W - 20
  const knotX  = leftX + (rightX - leftX) * (knotPct / 100)
  const midY   = 42

  // Control points for bezier sag
  const lCtrlX = (leftX + knotX) / 2
  const lCtrlY = midY + leftSag
  const rCtrlX = (knotX + rightX) / 2
  const rCtrlY = midY + rightSag

  const ropeLeft  = `M${leftX},${midY} Q${lCtrlX},${lCtrlY} ${knotX},${midY}`
  const ropeRight = `M${knotX},${midY} Q${rCtrlX},${rCtrlY} ${rightX},${midY}`

  const glowColorA = '#1565C0'
  const glowColorB = '#E91E8C'

  return (
    <div className="w-full select-none">
      {/* ── Team labels ── */}
      <div className="flex justify-between px-2 mb-1">
        <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: glowColorB }}>{teamBName} pulls ←</span>
        <span className="text-xs font-bold uppercase tracking-widest"
              style={{ color: glowColorA }}>→ pulls {teamAName}</span>
      </div>

      {/* ── Main arena ── */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0a1628 0%, #0f1f10 60%, #1a3010 100%)',
          boxShadow: `0 0 40px 8px rgba(21,101,192,0.15), 0 0 40px 8px rgba(233,30,140,0.10)`,
          minHeight: figCount === 1 ? 160 : 220,
        }}
      >
        {/* Side glow panels */}
        <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at left, rgba(21,101,192,0.28) 0%, transparent 70%)' }} />
        <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at right, rgba(233,30,140,0.28) 0%, transparent 70%)' }} />

        {/* Ground glow */}
        <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none"
             style={{ background: 'linear-gradient(0deg, rgba(40,120,40,0.35) 0%, transparent 100%)' }} />

        {/* ── Figures + Rope row ── */}
        <div className="flex items-end justify-between px-1 pt-4 pb-2"
             style={{ minHeight: 200 }}>

          {/* Team A figures — LEFT side */}
          <div className="flex items-end" style={{ gap: -12 }}>
            {Array.from({ length: figCount }, (_, i) => (
              <div key={i} style={{ marginLeft: i === 0 ? 0 : -14, zIndex: figCount - i }}>
                <PullerFigure team="A" index={i} ropePosition={position} />
              </div>
            ))}
          </div>

          {/* Rope SVG */}
          <div className="flex-1 flex flex-col items-center justify-end px-2 pb-3"
               style={{ minWidth: 0 }}>
            <svg
              viewBox={`0 0 ${ROPE_W} ${ROPE_H}`}
              style={{ width: '100%', maxWidth: 640, overflow: 'visible' }}
            >
              <defs>
                {/* Rope strand texture */}
                <pattern id="ropePat" x="0" y="0" width="12" height="14" patternUnits="userSpaceOnUse">
                  <rect width="12" height="14" fill="#8B6010" />
                  <path d="M0 0 Q6 7 12 14" stroke="#A07820" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <path d="M0 7 Q6 0 12 7" stroke="#6B4810" strokeWidth="2" fill="none" opacity="0.5" />
                </pattern>
                {/* Rope glow filter */}
                <filter id="ropeGlow" x="-20%" y="-60%" width="140%" height="220%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Knot glow */}
                <filter id="knotGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="knotGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%"   stopColor="#FFE566" />
                  <stop offset="50%"  stopColor="#F5A800" />
                  <stop offset="100%" stopColor="#8B4500" />
                </radialGradient>
              </defs>

              {/* Win zone markers */}
              <rect x={leftX} y="0" width={(rightX - leftX) * 0.15} height={ROPE_H}
                    fill="rgba(233,30,140,0.09)" rx="4" />
              <rect x={rightX - (rightX - leftX) * 0.15} y="0"
                    width={(rightX - leftX) * 0.15} height={ROPE_H}
                    fill="rgba(21,101,192,0.09)" rx="4" />
              {/* Win zone border lines */}
              <line x1={leftX + (rightX - leftX) * 0.15} y1="0"
                    x2={leftX + (rightX - leftX) * 0.15} y2={ROPE_H}
                    stroke="rgba(233,30,140,0.40)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1={rightX - (rightX - leftX) * 0.15} y1="0"
                    x2={rightX - (rightX - leftX) * 0.15} y2={ROPE_H}
                    stroke="rgba(21,101,192,0.40)" strokeWidth="1.5" strokeDasharray="4 3" />

              {/* Center start marker */}
              <line x1={(leftX + rightX) / 2} y1={midY - 18}
                    x2={(leftX + rightX) / 2} y2={midY + 18}
                    stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Rope shadow */}
              <path d={ropeLeft}  fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="10"
                    transform="translate(0, 4)" strokeLinecap="round" />
              <path d={ropeRight} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="10"
                    transform="translate(0, 4)" strokeLinecap="round" />

              {/* Rope body — textured */}
              <path d={ropeLeft}  fill="none" stroke="url(#ropePat)" strokeWidth="12"
                    strokeLinecap="round" filter="url(#ropeGlow)"
                    style={{ transition: 'all 0.35s ease-out' }} />
              <path d={ropeRight} fill="none" stroke="url(#ropePat)" strokeWidth="12"
                    strokeLinecap="round" filter="url(#ropeGlow)"
                    style={{ transition: 'all 0.35s ease-out' }} />

              {/* Rope highlight (top strand lighter) */}
              <path d={ropeLeft}  fill="none" stroke="#C09030" strokeWidth="4"
                    strokeLinecap="round" opacity="0.45"
                    style={{ transition: 'all 0.35s ease-out' }} />
              <path d={ropeRight} fill="none" stroke="#C09030" strokeWidth="4"
                    strokeLinecap="round" opacity="0.45"
                    style={{ transition: 'all 0.35s ease-out' }} />

              {/* ── KNOT ── */}
              {/* Glow halo */}
              <circle
                cx={knotX} cy={midY}
                r="22"
                fill="rgba(255,200,0,0.12)"
                filter="url(#knotGlow)"
                style={{ transition: 'cx 0.35s ease-out' }}
              />
              {/* Outer ring */}
              <circle
                cx={knotX} cy={midY}
                r="16"
                fill="url(#knotGrad)"
                stroke="#FFE566"
                strokeWidth="2.5"
                filter="url(#knotGlow)"
                style={{ transition: 'cx 0.35s ease-out' }}
              />
              {/* Inner knot detail */}
              <circle cx={knotX} cy={midY} r="8" fill="#C07800"
                      style={{ transition: 'cx 0.35s ease-out' }} />
              <circle cx={knotX - 3} cy={midY - 3} r="3.5" fill="rgba(255,230,100,0.4)"
                      style={{ transition: 'cx 0.35s ease-out' }} />

              {/* Center line marker */}
              <text x={(leftX + rightX) / 2} y={ROPE_H - 4}
                    textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)"
                    fontFamily="Arial, sans-serif">CENTER</text>
            </svg>

            {/* Position dots — one per 3 rope units: −15,−12,…,0,…,12,15 */}
            <div className="flex gap-1.5 mt-2">
              {Array.from({ length: 11 }, (_, i) => {
                const dotPos  = (i - 5) * 3           // −15 to +15 in steps of 3
                const inRange = position >= dotPos - 1 && position <= dotPos + 1
                const isExact = dotPos === position
                const isAZone = dotPos >= 12
                const isBZone = dotPos <= -12
                const isCross = !isAZone && !isBZone && dotPos !== 0
                return (
                  <div key={dotPos} className="rounded-full transition-all duration-300"
                       style={{
                         width:  inRange ? 14 : 8,
                         height: inRange ? 14 : 8,
                         background: inRange
                           ? '#FBBF24'
                           : isAZone ? 'rgba(21,101,192,0.75)'
                           : isBZone ? 'rgba(233,30,140,0.75)'
                           : dotPos === 0 ? 'rgba(255,255,255,0.5)'
                           : 'rgba(255,255,255,0.15)',
                         border: inRange  ? '2.5px solid #F59E0B'
                               : dotPos === 0 ? '1.5px solid rgba(255,255,255,0.4)'
                               : '1px solid rgba(255,255,255,0.08)',
                         boxShadow: inRange ? '0 0 8px rgba(251,191,36,0.8)' : 'none',
                       }} />
                )
              })}
            </div>
          </div>

          {/* Team B figures — RIGHT side, front is closest to rope */}
          <div className="flex items-end" style={{ flexDirection: 'row-reverse' }}>
            {Array.from({ length: figCount }, (_, i) => (
              <div key={i} style={{ marginRight: i === 0 ? 0 : -14, zIndex: figCount - i }}>
                <PullerFigure team="B" index={i} ropePosition={position} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Ground / grass strip ── */}
        <div className="w-full h-4 relative overflow-hidden">
          <div className="absolute inset-0"
               style={{
                 background: 'repeating-linear-gradient(90deg, #1a4010 0px, #2a6018 8px, #1a4010 16px)',
                 opacity: 0.7,
               }} />
        </div>
      </div>

      {/* Score progress bar */}
      <div className="w-full flex mt-2 h-2.5 rounded-full overflow-hidden"
           style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="transition-all duration-300 ease-out"
             style={{
               width: `${Math.max(2, 50 - position * 10)}%`,
               background: 'linear-gradient(90deg, #E91E8C, #ff60b0)',
               boxShadow: '0 0 6px rgba(233,30,140,0.6)',
             }} />
        <div className="transition-all duration-300 ease-out"
             style={{
               width: `${Math.max(2, 50 + position * 10)}%`,
               background: 'linear-gradient(90deg, #3a90ff, #1565C0)',
               boxShadow: '0 0 6px rgba(21,101,192,0.6)',
             }} />
      </div>
    </div>
  )
}
