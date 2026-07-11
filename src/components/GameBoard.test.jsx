import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import GameBoard from './GameBoard'

const cards = Array.from({ length: 16 }, (_, index) => ({
  id: `card-${index}`,
  pairId: `pair-${Math.floor(index / 2)}`,
  symbol: String(Math.floor(index / 2) + 1),
}))

test('announces grid dimensions and card positions', () => {
  render(
    <GameBoard
      cards={cards}
      flippedIds={[]}
      matchedPairIds={new Set()}
      shakeIds={new Set()}
      matchAnimIds={new Set()}
      showHint={false}
      peeking={false}
      peekProgress={0}
      theme="numbers"
      difficulty="easy"
      onCardClick={vi.fn()}
    />,
  )

  const grid = screen.getByRole('grid', { name: 'Memory card board' })
  expect(grid).toHaveAttribute('aria-rowcount', '4')
  expect(grid).toHaveAttribute('aria-colcount', '4')

  const buttons = screen.getAllByRole('button', { name: /Hidden card/ })
  expect(buttons[0]).toHaveAttribute('aria-label', 'Hidden card, row 1, column 1')
  expect(buttons[15]).toHaveAttribute('aria-label', 'Hidden card, row 4, column 4')
})
