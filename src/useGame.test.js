import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useGame } from './useGame'

describe('useGame timed-mode completion', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => vi.useRealTimers())

  test('awards points and bonus time for a timed match', () => {
    const { result } = renderHook(() => useGame())

    act(() => {
      result.current.setSoundOn(false)
      result.current.startGame('easy', 'emoji', 'timed')
    })
    act(() => vi.advanceTimersByTime(2_800))

    const pair = result.current.cards.filter(card => card.pairId === result.current.cards[0].pairId)
    act(() => result.current.flipCard(pair[0].id))
    act(() => result.current.flipCard(pair[1].id))
    act(() => vi.advanceTimersByTime(800))

    expect(result.current.score).toBe(100)
    expect(result.current.time).toBe(62)
    expect(result.current.lastReward).toMatchObject({ points: 100, timeBonus: 2, combo: 1 })
  })

  test('cancels a pending timeout loss when the game restarts', () => {
    const { result } = renderHook(() => useGame())

    act(() => {
      result.current.setSoundOn(false)
      result.current.startGame('easy', 'emoji', 'timed')
    })

    // Finish the initial card peek and count the timed round down to zero.
    act(() => vi.advanceTimersByTime(62_800))
    expect(result.current.time).toBe(0)

    // Restart before the deferred endGame callback can commit stale state.
    act(() => result.current.startGame('easy', 'emoji', 'timed'))
    act(() => vi.advanceTimersByTime(0))

    expect(result.current.gameOver).toBe(false)
    expect(result.current.isPlaying).toBe(true)
    expect(result.current.time).toBe(60)
  })
})
