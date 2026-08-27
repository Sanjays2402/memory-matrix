import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import Menu from './Menu'

const defaults = {
  difficulty: 'easy',
  theme: 'emoji',
  dailyChallenge: { key: '2026-07-12', seed: 'daily-seed', difficulty: 'medium', theme: 'programming' },
  dailyProgress: { lastCompleted: null, streak: 3, results: {} },
  onDifficultyChange: vi.fn(),
  onThemeChange: vi.fn(),
  onStart: vi.fn(),
}

describe('Menu daily challenge', () => {
  test('shows the rotating shared puzzle and starts daily mode', async () => {
    const onStart = vi.fn()
    render(<Menu {...defaults} onStart={onStart} />)

    await userEvent.click(screen.getByRole('button', { name: /Daily challenge/ }))

    expect(screen.getByText(/Programming · Medium · same board worldwide/)).toBeInTheDocument()
    expect(screen.getByText('2026-07-12')).toBeInTheDocument()
    expect(screen.getAllByText(/3 day streak/)).toHaveLength(2)

    await userEvent.click(screen.getByRole('button', { name: /Start game/ }))
    expect(onStart).toHaveBeenCalledWith('daily')
  })

  test('marks today complete without hiding replay', async () => {
    render(<Menu {...defaults} dailyProgress={{ lastCompleted: '2026-07-12', streak: 4, results: { '2026-07-12': { moves: 20 } } }} />)

    await userEvent.click(screen.getByRole('button', { name: /Daily challenge/ }))

    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText(/Completed today/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start game/ })).toBeEnabled()
  })
})
