import { useState } from 'react'
import { useGame } from './useGame'
import { DIFFICULTIES } from './gameLogic'
import BackgroundOrbs from './components/BackgroundOrbs'
import Menu from './components/Menu'
import Header from './components/Header'
import GameBoard from './components/GameBoard'
import VictoryOverlay from './components/VictoryOverlay'
import { Icon } from './components/Icons'

export default function App() {
  const [screen, setScreen] = useState('menu')
  const game = useGame()

  const handleStart = (selectedMode) => {
    game.startGame(game.difficulty, game.theme, selectedMode || 'classic')
    setScreen('playing')
  }

  const handleMenu = () => setScreen('menu')
  const handlePlayAgain = () => game.startGame(game.difficulty, game.theme, game.mode)

  return (
    <div className={`app-shell theme-${game.theme} screen-${screen} mode-${game.mode}`}>
      <BackgroundOrbs />

      {screen === 'menu' && (
        <Menu
          difficulty={game.difficulty}
          theme={game.theme}
          dailyChallenge={game.dailyChallenge}
          dailyProgress={game.dailyProgress}
          onDifficultyChange={game.setDifficulty}
          onThemeChange={game.setTheme}
          onStart={handleStart}
        />
      )}

      {screen === 'playing' && (
        <main className="game-shell">
          <nav className="game-nav" aria-label="Game navigation">
            <button className="back-action" type="button" onClick={handleMenu}><Icon name="arrowLeft" /> <span>Setup</span></button>
            <a className="brand compact" href="./" onClick={(event) => { event.preventDefault(); handleMenu() }}>
              <span className="brand-mark"><i /><i /><i /><i /></span><span>Memory Matrix</span>
            </a>
            <button className="new-round-action" type="button" onClick={handlePlayAgain}><Icon name="rotate" /> <span>New round</span></button>
          </nav>

          <Header
            moves={game.moves}
            time={game.time}
            stars={game.stars}
            combo={game.combo}
            score={game.score}
            lastReward={game.lastReward}
            soundOn={game.soundOn}
            setSoundOn={game.setSoundOn}
            hintUsed={game.hintUsed}
            onHint={game.useHint}
            mode={game.mode}
            dailyStreak={game.dailyProgress.streak}
            peeking={game.peeking}
            difficulty={game.difficulty}
            theme={game.theme}
            matchedCount={game.matchedPairIds.size}
          />

          <GameBoard
            cards={game.cards}
            flippedIds={game.flippedIds}
            matchedPairIds={game.matchedPairIds}
            shakeIds={game.shakeIds}
            matchAnimIds={game.matchAnimIds}
            showHint={game.showHint}
            peeking={game.peeking}
            peekProgress={game.peekProgress}
            theme={game.theme}
            difficulty={game.difficulty}
            onCardClick={game.flipCard}
          />

          <p className="game-tip">Select two cards to find a pair <span>·</span> Focus peek can be used once</p>
        </main>
      )}

      {game.gameOver && (
        <VictoryOverlay
          moves={game.moves}
          time={game.time}
          stars={game.stars}
          combo={game.maxCombo}
          score={game.score}
          newBest={game.newBest}
          pairs={DIFFICULTIES[game.difficulty].pairs}
          hintUsed={game.hintUsed}
          isPerfect={game.isPerfect}
          gameOverReason={game.gameOverReason}
          matchedCount={game.matchedPairIds.size}
          mode={game.mode}
          theme={game.theme}
          dailyStreak={game.dailyProgress.streak}
          onPlayAgain={handlePlayAgain}
          onMenu={handleMenu}
        />
      )}
    </div>
  )
}
