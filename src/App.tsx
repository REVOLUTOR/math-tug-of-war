import React, { useState, useCallback } from 'react'

import type { GameScreen as GameScreenType, GameSettings } from './types/game'
import SplashScreen from './components/SplashScreen'
import SettingsScreen from './components/SettingsScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'
import { useGameEngine } from './hooks/useGameEngine'

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

const DEFAULT_SETTINGS: GameSettings = {
  teamAName:     'Team A',
  teamBName:     'Team B',
  inputMode:     isTouchDevice ? 'touchscreen' : 'dual-keyboard',
  difficulty:    'easy',
  operations:    ['addition'],
  timerSeconds:  60,
  questionLimit: null,
}

export default function App() {
  const [screen, setScreen] = useState<GameScreenType>('splash')
  const [lastSettings, setLastSettings] = useState<GameSettings>(DEFAULT_SETTINGS)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const { state, submitAnswer, pause, resume, restart } = useGameEngine(DEFAULT_SETTINGS)

  const handleStartGame = useCallback((settings: GameSettings) => {
    setLastSettings(settings)
    restart(settings)
    setScreen('game')
  }, [restart])

  // Transition to result screen when a winner is declared.
  // Depends only on state.winner — fires once when it becomes non-null,
  // cleanup cancels the timer if a new game resets it back to null.
  React.useEffect(() => {
    if (!state.winner) return
    const t = setTimeout(() => setScreen('result'), 600)
    return () => clearTimeout(t)
  }, [state.winner])

  return (
    <div className="min-h-screen">
      {screen === 'splash' && (
        <SplashScreen onStart={() => setScreen('settings')} />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          onStart={handleStartGame}
          onBack={() => setScreen('splash')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          state={state}
          submitAnswer={submitAnswer}
          pause={pause}
          resume={resume}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(s => !s)}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          winner={state.winner!}
          winReason={state.winReason}
          teamAName={lastSettings.teamAName}
          teamBName={lastSettings.teamBName}
          scoreA={state.scoreA}
          scoreB={state.scoreB}
          soundEnabled={soundEnabled}
          onPlayAgain={() => setScreen('settings')}
          onMainMenu={() => setScreen('splash')}
        />
      )}
    </div>
  )
}
