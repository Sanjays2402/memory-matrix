import Card from './Card'
import { DIFFICULTIES } from '../gameLogic'

export default function GameBoard({ cards, flippedIds, matchedPairIds, shakeIds, matchAnimIds, showHint, peeking, peekProgress, theme, difficulty, onCardClick }) {
  const gridSize = DIFFICULTIES[difficulty].grid

  return (
    <div
      className="grid gap-2 sm:gap-3 mx-auto w-full"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        maxWidth: gridSize <= 4 ? 440 : gridSize <= 6 ? 560 : 640,
      }}
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
          theme={theme}
          onClick={onCardClick}
        />
      ))}
    </div>
  )
}
