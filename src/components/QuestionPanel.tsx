import React from 'react'
import type { Question } from '../types/game'

const OPERATOR: Record<string, { symbol: string; color: string }> = {
  addition:       { symbol: '+', color: '#90caf9' },   // light blue
  subtraction:    { symbol: '−', color: '#fbbf24' },   // amber
  multiplication: { symbol: '×', color: '#f9a8d4' },   // light pink
}

interface Props {
  question: Question
}

export default function QuestionPanel({ question }: Props) {
  const op = OPERATOR[question.operation] ?? OPERATOR.addition
  return (
    <div className="flex items-center gap-4">
      <span className="text-5xl font-black text-white tabular-nums">{question.a}</span>
      <span className="text-4xl font-black" style={{ color: op.color }}>{op.symbol}</span>
      <span className="text-5xl font-black text-white tabular-nums">{question.b}</span>
      <span className="text-4xl font-black text-gray-500">=</span>
      <span className="text-5xl font-black"
            style={{ color: 'rgba(255,255,255,0.18)', textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>?</span>
    </div>
  )
}
