import type { Difficulty, Operation, Question } from '../types/game'

// Number ranges per difficulty for each operation
const ADD_RANGES: Record<Difficulty, [number, number]> = {
  easy:   [1, 10],
  medium: [1, 50],
  hard:   [1, 100],
}

const SUB_RANGES: Record<Difficulty, number> = {
  easy:   15,
  medium: 60,
  hard:   100,
}

// Multiplication uses smaller operands — the product grows fast
const MUL_RANGES: Record<Difficulty, [number, number]> = {
  easy:   [1, 5],
  medium: [1, 10],
  hard:   [1, 12],
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeAddition(difficulty: Difficulty): Question {
  const [min, max] = ADD_RANGES[difficulty]
  const a = randInt(min, max)
  const b = randInt(min, max)
  return { a, b, answer: a + b, operation: 'addition' }
}

function makeSubtraction(difficulty: Difficulty): Question {
  const max = SUB_RANGES[difficulty]
  // Ensure a > b so result is always a positive number (child-friendly)
  const a = randInt(2, max)
  const b = randInt(1, a - 1)
  return { a, b, answer: a - b, operation: 'subtraction' }
}

function makeMultiplication(difficulty: Difficulty): Question {
  const [min, max] = MUL_RANGES[difficulty]
  const a = randInt(min, max)
  const b = randInt(min, max)
  return { a, b, answer: a * b, operation: 'multiplication' }
}

export function generateQuestion(difficulty: Difficulty, operations: Operation[]): Question {
  // Pick a random operation from the allowed set
  const op = operations[Math.floor(Math.random() * operations.length)]
  switch (op) {
    case 'addition':       return makeAddition(difficulty)
    case 'subtraction':    return makeSubtraction(difficulty)
    case 'multiplication': return makeMultiplication(difficulty)
  }
}
