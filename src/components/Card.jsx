import { THEMES } from '../gameLogic'

export default function Card({ card, isFlipped, isMatched, isShaking, isMatchAnim, showHint, peeking, peekProgress, cardIndex, theme, onClick }) {
  const themeData = THEMES[theme]
  const isRevealed = isFlipped || showHint || (peeking && peekProgress === 0)
  const isProgramming = theme === 'programming'

  // Staggered flip-back delay per card
  const staggerDelay = peekProgress === 1 ? `${cardIndex * 30}ms` : '0ms'

  const getCardColor = () => {
    if (isProgramming) {
      const idx = themeData.cards.indexOf(card.symbol)
      return themeData.colors[idx] || themeData.color
    }
    return themeData.color
  }

  const cardClasses = [
    'card-container cursor-pointer select-none',
    isMatched && !isMatchAnim ? 'card-matched-done' : '',
    isMatchAnim ? 'card-matched' : '',
    isShaking ? 'card-no-match' : '',
  ].filter(Boolean).join(' ')

  const innerClasses = [
    'card-inner',
    isRevealed || isMatched ? 'flipped' : '',
  ].filter(Boolean).join(' ')

  // Apply stagger transition delay when flipping back from peek
  const innerStyle = peekProgress === 1 ? { transitionDelay: staggerDelay } : {}

  return (
    <div
      className={cardClasses}
      onClick={() => onClick(card.id)}
      style={{ aspectRatio: '1' }}
    >
      <div className={innerClasses} style={innerStyle}>
        {/* Front (face down) */}
        <div
          className="card-face"
          style={{
            background: 'rgba(30, 30, 50, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span style={{ fontSize: '1.5em', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>?</span>
        </div>

        {/* Back (face up) */}
        <div
          className="card-face card-back"
          style={{
            background: 'rgba(50, 50, 80, 0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${getCardColor()}33`,
            boxShadow: `inset 0 0 30px ${getCardColor()}15`,
          }}
        >
          {isProgramming ? (
            <span
              style={{
                fontSize: '1.4em',
                fontWeight: 800,
                color: getCardColor(),
                fontFamily: 'monospace',
                textShadow: `0 0 20px ${getCardColor()}40`,
              }}
            >
              {card.symbol}
            </span>
          ) : (
            <span style={{ fontSize: '2em', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>
              {card.symbol}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
