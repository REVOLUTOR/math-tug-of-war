import { useReducer, useEffect, useRef, useCallback } from 'react'
import type { GameState, GameAction, GameSettings, Team } from '../types/game'
import { generateQuestion } from '../utils/questionGenerator'

const ROPE_MIN = -15
const ROPE_MAX = 15

function makeInitialState(settings: GameSettings): GameState {
  return {
    settings,
    question: generateQuestion(settings.difficulty, settings.operations),
    ropePosition: 0,
    scoreA: 0,
    scoreB: 0,
    timeLeft: settings.timerSeconds,
    isRunning: true,
    isPaused: false,
    winner: null,
    winReason: null,
    flashA: false,
    flashB: false,
    shakeA: false,
    shakeB: false,
  }
}

function checkRopeWin(pos: number): Team | null {
  if (pos >= ROPE_MAX) return 'A'
  if (pos <= ROPE_MIN) return 'B'
  return null
}

function scoreWinner(a: number, b: number): 'A' | 'B' | 'draw' {
  return a > b ? 'A' : b > a ? 'B' : 'draw'
}

function gameReducer(state: GameState, action: GameAction): GameState {
  // Allow housekeeping actions through even after game ends
  if (
    state.winner &&
    action.type !== 'START_GAME' &&
    action.type !== 'CLEAR_FLASH' &&
    action.type !== 'CLEAR_SHAKE'
  ) return state

  switch (action.type) {
    case 'START_GAME':
      return makeInitialState(action.settings)

    case 'TICK': {
      if (!state.isRunning || state.isPaused) return state
      const newTime = state.timeLeft - 1
      if (newTime <= 0) {
        return {
          ...state,
          timeLeft: 0,
          isRunning: false,
          winner: scoreWinner(state.scoreA, state.scoreB),
          winReason: 'timer',
        }
      }
      return { ...state, timeLeft: newTime }
    }

    case 'PAUSE':
      return { ...state, isPaused: true }

    case 'RESUME':
      return { ...state, isPaused: false }

    case 'SUBMIT_ANSWER': {
      const { team, value } = action
      const correct = value === state.question.answer

      if (!correct) {
        return {
          ...state,
          shakeA: team === 'A',
          shakeB: team === 'B',
        }
      }

      const newRope = team === 'A'
        ? Math.min(state.ropePosition + 1, ROPE_MAX)
        : Math.max(state.ropePosition - 1, ROPE_MIN)

      const newScoreA = team === 'A' ? state.scoreA + 1 : state.scoreA
      const newScoreB = team === 'B' ? state.scoreB + 1 : state.scoreB

      const ropeWinner = checkRopeWin(newRope)

      // Rope win takes priority
      if (ropeWinner) {
        return {
          ...state,
          ropePosition: newRope,
          scoreA: newScoreA,
          scoreB: newScoreB,
          flashA: team === 'A',
          flashB: team === 'B',
          winner: ropeWinner,
          winReason: 'rope',
          isRunning: false,
          question: generateQuestion(state.settings.difficulty, state.settings.operations),
        }
      }

      // Question limit win
      const { questionLimit } = state.settings
      if (questionLimit !== null && (newScoreA + newScoreB) >= questionLimit) {
        return {
          ...state,
          ropePosition: newRope,
          scoreA: newScoreA,
          scoreB: newScoreB,
          flashA: team === 'A',
          flashB: team === 'B',
          winner: scoreWinner(newScoreA, newScoreB),
          winReason: 'questions',
          isRunning: false,
          question: generateQuestion(state.settings.difficulty, state.settings.operations),
        }
      }

      // Continue game
      return {
        ...state,
        ropePosition: newRope,
        scoreA: newScoreA,
        scoreB: newScoreB,
        flashA: team === 'A',
        flashB: team === 'B',
        question: generateQuestion(state.settings.difficulty, state.settings.operations),
      }
    }

    case 'CLEAR_FLASH':
      return { ...state, flashA: false, flashB: false }

    case 'CLEAR_SHAKE':
      return { ...state, shakeA: false, shakeB: false }

    default:
      return state
  }
}

export function useGameEngine(initialSettings: GameSettings) {
  const [state, dispatch] = useReducer(gameReducer, initialSettings, makeInitialState)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTick = useCallback(() => {
    if (tickRef.current !== null) {
      clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  useEffect(() => {
    if (state.isRunning && !state.isPaused && !state.winner) {
      clearTick()
      tickRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    } else {
      clearTick()
    }
    return clearTick
  }, [state.isRunning, state.isPaused, state.winner, clearTick])

  useEffect(() => {
    if (state.flashA || state.flashB) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_FLASH' }), 500)
      return () => clearTimeout(t)
    }
  }, [state.flashA, state.flashB])

  useEffect(() => {
    if (state.shakeA || state.shakeB) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_SHAKE' }), 450)
      return () => clearTimeout(t)
    }
  }, [state.shakeA, state.shakeB])

  const submitAnswer = useCallback((team: Team, value: number) => {
    dispatch({ type: 'SUBMIT_ANSWER', team, value })
  }, [])

  const pause   = useCallback(() => dispatch({ type: 'PAUSE' }),  [])
  const resume  = useCallback(() => dispatch({ type: 'RESUME' }), [])
  const restart = useCallback((settings: GameSettings) => {
    dispatch({ type: 'START_GAME', settings })
  }, [])

  return { state, submitAnswer, pause, resume, restart }
}
