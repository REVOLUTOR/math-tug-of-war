import React, { useState } from 'react'

interface Props {
  team: 'A' | 'B'
  onSubmit: (value: number) => void
  disabled?: boolean
}

const BUTTONS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '⏎']

export default function NumberPad({ team, onSubmit, disabled }: Props) {
  const [input, setInput] = useState('')
  const isA = team === 'A'
  const color = isA ? '#1565C0' : '#E91E8C'

  function press(key: string) {
    if (disabled) return
    if (key === 'C') { setInput(''); return }
    if (key === '⏎') {
      if (input !== '') { onSubmit(parseInt(input, 10)); setInput('') }
      return
    }
    if (input.length < 4) setInput(prev => prev + key)
  }

  return (
    <div className="flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-2xl border-2"
         style={{
           background: isA ? 'rgba(21,101,192,0.08)' : 'rgba(233,30,140,0.08)',
           borderColor: isA ? 'rgba(21,101,192,0.35)' : 'rgba(233,30,140,0.35)',
         }}>
      {/* Display */}
      <div
        className="w-full rounded-xl px-3 py-1.5 text-right text-2xl sm:text-3xl font-black min-h-[40px] sm:min-h-[48px] tracking-widest tabular-nums"
        style={{
          background: 'rgba(255,255,255,0.08)',
          border: `2px solid ${color}55`,
          color,
        }}
      >
        {input || <span style={{ color: 'rgba(255,255,255,0.18)' }}>0</span>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
        {BUTTONS.map(key => {
          let bg = ''
          let textColor = 'text-white'
          let extra = ''

          if (key === 'C') {
            bg = 'rgba(255,255,255,0.10)'
            textColor = 'text-gray-300'
            extra = 'font-bold text-sm sm:text-base'
          } else if (key === '⏎') {
            bg = '#22c55e'
            extra = 'font-black text-sm sm:text-base shadow-md'
          } else {
            bg = isA ? 'rgba(21,101,192,0.75)' : 'rgba(233,30,140,0.75)'
            extra = 'font-black text-lg sm:text-2xl shadow-sm'
          }

          return (
            <button
              key={key}
              onClick={() => press(key)}
              disabled={disabled}
              className={`${textColor} ${extra} rounded-xl w-10 h-10 sm:w-14 sm:h-14 transition-all active:scale-90 select-none`}
              style={{ background: bg }}
              aria-label={key === '⏎' ? 'Submit' : key === 'C' ? 'Clear' : key}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
