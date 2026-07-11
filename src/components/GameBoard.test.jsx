import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import GameBoard from './GameBoard'

const cards = Array.from({ length: 16 }, (_, index) => ({
  id: `card-${index}`,
  pairId: `pair-${Math.floor(index / 2)}`,
  symbol: String(Math.floor(index / 2) + 1),
}))

test('labels the native button collection and card positions', () => {
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

  const board = screen.getByRole('group', { name: 'Memory card board, 4 by 4' })
  expect(board).not.toHaveAttribute('role', 'grid')

  const buttons = screen.getAllByRole('button', { name: /Hidden card/ })
  expect(buttons[0]).toHaveAttribute('aria-label', 'Hidden card, row 1, column 1')
  expect(buttons[15]).toHaveAttribute('aria-label', 'Hidden card, row 4, column 4')
})
