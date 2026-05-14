export type GameScreen = 'splash' | 'settings' | 'game' | 'result'

export type InputMode = 'dual-keyboard' | 'touchscreen'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Team = 'A' | 'B'

export type Operation = 'addition' | 'subtraction' | 'multiplication'

export interface Question {
  a: number
  b: number
  answer: number
  operation: Operation
}

export interface GameSettings {
  teamAName: string
  teamBName: string
  inputMode: InputMode
  difficulty: Difficulty
  operations: Operation[]      // at least one; if multiple, chosen randomly each question
  timerSeconds: number
  questionLimit: number | null
}

export interface GameState {
  settings: GameSettings
  question: Question
  ropePosition: number
  scoreA: number
  scoreB: number
  timeLeft: number
  isRunning: boolean
  isPaused: boolean
  winner: Team | 'draw' | null
  winReason: 'rope' | 'timer' | 'questions' | null
  flashA: boolean
  flashB: boolean
  shakeA: boolean
  shakeB: boolean
}

export type GameAction =
  | { type: 'SUBMIT_ANSWER'; team: Team; value: number }
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'START_GAME'; settings: GameSettings }
  | { type: 'CLEAR_FLASH' }
  | { type: 'CLEAR_SHAKE' }
