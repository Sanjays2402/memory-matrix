import { THEMES } from '../gameLogic'
import { getCardLabel } from '../programmingDeck'
import { Icon } from './Icons'

export default function Card({ card, isFlipped, isMatched, isShaking, isMatchAnim, showHint, peeking, peekProgress, cardIndex, theme, positionLabel = '', onClick }) {
  const themeData = THEMES[theme]
  const isRevealed = isFlipped || showHint || (peeking && peekProgress === 0)
  const isTextTheme = theme === 'numbers'
  const isImageTheme = Boolean(themeData.imageDeck && card.symbol?.image)
  const staggerDelay = peekProgress === 1 ? `${cardIndex * 24}ms` : '0ms'
  const colorIndex = themeData.cards.indexOf(card.symbol)
  const cardColor = card.symbol?.color || themeData.colors?.[colorIndex] || themeData.color
  const cardLabel = getCardLabel(card.symbol)
  const cardStateLabel = isMatched ? `Card: ${cardLabel}, matched` : isRevealed ? `Card: ${cardLabel}` : 'Hidden card'
  const accessibleName = positionLabel ? `${cardStateLabel}, ${positionLabel}` : cardStateLabel

  const cardClasses = ['card-container', isMatched && !isMatchAnim ? 'is-matched' : '', isMatchAnim ? 'is-matching' : '', isShaking ? 'is-wrong' : ''].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={cardClasses}
      onClick={() => onClick(card.id)}
      disabled={isMatched}
      aria-label={accessibleName}
      aria-pressed={isRevealed || isMatched}
      style={{ '--card-accent': cardColor }}
    >
      <span className={`card-inner ${isRevealed || isMatched ? 'flipped' : ''}`} style={{ transitionDelay: staggerDelay }}>
        <span className="card-face card-front">
          <span className="card-glyph">M</span>
          <span className="card-index">{String(cardIndex + 1).padStart(2, '0')}</span>
        </span>
        <span className={`card-face card-back ${isImageTheme ? 'card-back-image' : ''}`}>
          {isImageTheme ? (
            <span className="technology-mark">
              <span
                className="technology-logo"
                role="img"
                aria-label={cardLabel}
                style={{ '--logo-color': card.symbol.color, '--logo-image': `url("${card.symbol.image}")` }}
              />
              <span>{cardLabel}</span>
            </span>
          ) : (
            <span className={isTextTheme ? 'card-symbol text-symbol' : 'card-symbol'}>{card.symbol}</span>
          )}
          {isMatched && <span className="match-check"><Icon name="check" size={12} strokeWidth={3} /></span>}
        </span>
      </span>
    </button>
  )
}
