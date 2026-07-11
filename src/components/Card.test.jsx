import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import Card from './Card'

const CARD = { id: 'card-0-a', symbol: '🎮', pairId: 'card-0' }
const DEFAULTS = {
  card: CARD,
  isFlipped: false,
  isMatched: false,
  isShaking: false,
  isMatchAnim: false,
  showHint: false,
  peeking: false,
  peekProgress: 0,
  cardIndex: 0,
  theme: 'emoji',
}

describe('Card accessibility', () => {
  test('renders a face-down card as a named button', () => {
    render(<Card {...DEFAULTS} onClick={vi.fn()} />)

    const card = screen.getByRole('button', { name: 'Hidden card' })
    expect(card).toHaveAttribute('aria-pressed', 'false')
  })

  test('activates the card from the keyboard', async () => {
    const onClick = vi.fn()
    render(<Card {...DEFAULTS} onClick={onClick} />)

    const card = screen.getByRole('button', { name: 'Hidden card' })
    card.focus()
    await userEvent.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledWith(CARD.id)
  })

  test('exposes a revealed symbol and disables a matched card', () => {
    render(<Card {...DEFAULTS} isFlipped isMatched onClick={vi.fn()} />)

    const card = screen.getByRole('button', { name: 'Card: 🎮, matched' })
    expect(card).toBeDisabled()
    expect(card).toHaveAttribute('aria-pressed', 'true')
  })
})
