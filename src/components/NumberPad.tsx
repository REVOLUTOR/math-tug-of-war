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
  const color = isA ? '#1E6FD9' : '#E84C1E'
  const bgClass = isA ? 'bg-blue-50' : 'bg-orange-50'
  const borderClass = isA ? 'border-blue-200' : 'border-orange-200'
  const btnBg = isA ? 'bg-[#1E6FD9] hover:bg-blue-700' : 'bg-[#E84C1E] hover:bg-orange-700'
  const clearBg = isA ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
  const submitBg = isA ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'

  function press(key: string) {
    if (disabled) return
    if (key === 'C') {
      setInput('')
      return
    }
    if (key === '⏎') {
      if (input !== '') {
        onSubmit(parseInt(input, 10))
        setInput('')
      }
      return
    }
    if (input.length < 4) {
      setInput(prev => prev + key)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 ${bgClass} ${borderClass}`}>
      {/* Display */}
      <div
        className="w-full rounded-xl px-4 py-2 text-right text-3xl font-black bg-white border-2 min-h-[52px] tracking-widest tabular-nums shadow-inner"
        style={{ borderColor: color, color }}
      >
        {input || <span className="text-gray-300">0</span>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {BUTTONS.map(key => {
          let cls = ''
          if (key === 'C') cls = `numpad-btn ${clearBg} text-lg font-bold rounded-xl w-16 h-16 transition-all active:scale-90 select-none`
          else if (key === '⏎') cls = `numpad-btn ${submitBg} text-white text-lg font-bold rounded-xl w-16 h-16 transition-all active:scale-90 select-none shadow-md`
          else cls = `numpad-btn ${btnBg} text-white text-2xl font-black rounded-xl w-16 h-16 transition-all active:scale-90 select-none shadow-sm`

          return (
            <button
              key={key}
              onClick={() => press(key)}
              className={cls}
              disabled={disabled}
              aria-label={key === '⏎' ? 'Submit answer' : key === 'C' ? 'Clear' : key}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
