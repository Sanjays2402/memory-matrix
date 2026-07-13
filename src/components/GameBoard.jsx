import Card from './Card'
import { DIFFICULTIES } from '../gameLogic'

export default function GameBoard({ cards, flippedIds, matchedPairIds, shakeIds, matchAnimIds, showHint, peeking, peekProgress, theme, difficulty, onCardClick }) {
  const gridSize = DIFFICULTIES[difficulty].grid

  return (
    <div className={`board-wrap board-theme-${theme}`}>
      {theme === 'programming' && (
        <div className="code-chrome" aria-hidden="true">
          <span className="code-dots"><i /><i /><i /></span>
          <code>~/memory-matrix <b>git:(main)</b></code>
          <span>npm run focus</span>
        </div>
      )}
      <div className="board-corners" aria-hidden="true"><i /><i /><i /><i /></div>
      <div
        role="group"
        aria-label={`Memory card board, ${gridSize} by ${gridSize}`}
        className="game-board"
        data-grid={gridSize}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={flippedIds.includes(card.id)}
            isMatched={matchedPairIds.has(card.pairId)}
            isShaking={shakeIds.has(card.id)}
            isMatchAnim={matchAnimIds.has(card.id)}
            showHint={showHint}
            peeking={peeking}
            peekProgress={peekProgress}
            cardIndex={index}
            positionLabel={`row ${Math.floor(index / gridSize) + 1}, column ${(index % gridSize) + 1}`}
            theme={theme}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  )
}
