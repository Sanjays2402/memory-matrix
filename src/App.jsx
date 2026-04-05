import { useState } from 'react'
import { useGame } from './useGame'
import { DIFFICULTIES } from './gameLogic'
import BackgroundOrbs from './components/BackgroundOrbs'
import Menu from './components/Menu'
import Header from './components/Header'
import GameBoard from './components/GameBoard'
import VictoryOverlay from './components/VictoryOverlay'

export default function App() {
  const [screen, setScreen] = useState('menu') // menu | playing
  const game = useGame()

  const handleStart = () => {
    game.startGame(game.difficulty, game.theme)
    setScreen('playing')
  }

  const handleMenu = () => {
    setScreen('menu')
  }

  const handlePlayAgain = () => {
    game.startGame(game.difficulty, game.theme)
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0f' }}>
      <BackgroundOrbs />

      {screen === 'menu' && (
        <Menu
          difficulty={game.difficulty}
          theme={game.theme}
          onDifficultyChange={game.setDifficulty}
          onThemeChange={game.setTheme}
          onStart={handleStart}
        />
      )}

      {screen === 'playing' && (
        <div className="p-4 sm:p-6 relative" style={{ zIndex: 1 }}>
          {/* Title + Back */}
          <div className="flex items-center justify-between mb-4">
            <button className="btn-glass text-sm" onClick={handleMenu}>
              ← Menu
            </button>
            <h1 className="text-lg font-bold" style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Memory Matrix
            </h1>
            <div style={{ width: 80 }} /> {/* spacer */}
          </div>

          <Header
            moves={game.moves}
            time={game.time}
            stars={game.stars}
            combo={game.combo}
            soundOn={game.soundOn}
            setSoundOn={game.setSoundOn}
            hintUsed={game.hintUsed}
            onHint={game.useHint}
          />

          <GameBoard
            cards={game.cards}
            flippedIds={game.flippedIds}
            matchedPairIds={game.matchedPairIds}
            shakeIds={game.shakeIds}
            matchAnimIds={game.matchAnimIds}
            showHint={game.showHint}
            theme={game.theme}
            difficulty={game.difficulty}
            onCardClick={game.flipCard}
          />
        </div>
      )}

      {game.gameOver && (
        <VictoryOverlay
          moves={game.moves}
          time={game.time}
          stars={game.stars}
          combo={game.maxCombo}
          newBest={game.newBest}
          pairs={DIFFICULTIES[game.difficulty].pairs}
          hintUsed={game.hintUsed}
          onPlayAgain={handlePlayAgain}
          onMenu={handleMenu}
        />
      )}
    </div>
  )
}
