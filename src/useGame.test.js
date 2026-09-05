import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useGame } from './useGame'

describe('useGame timed-mode completion', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => vi.useRealTimers())

  test('starts the same daily challenge configuration and card order', () => {
    const first = renderHook(() => useGame())
    const second = renderHook(() => useGame())

    act(() => {
      first.result.current.setSoundOn(false)
      second.result.current.setSoundOn(false)
      first.result.current.startGame('easy', 'emoji', 'daily')
      second.result.current.startGame('hard', 'animals', 'daily')
    })

    expect(first.result.current.mode).toBe('daily')
    expect(first.result.current.difficulty).toBe('medium')
    expect(first.result.current.theme).toBe(first.result.current.dailyChallenge.theme)
    expect(first.result.current.cards.map(card => card.id)).toEqual(second.result.current.cards.map(card => card.id))
  })

  test('records a completed daily puzzle and its final score', () => {
    const { result } = renderHook(() => useGame())

    act(() => {
      result.current.setSoundOn(false)
      result.current.startGame('easy', 'emoji', 'daily')
    })
    act(() => vi.advanceTimersByTime(2_800))

    const pairs = Object.values(result.current.cards.reduce((groups, card) => {
      groups[card.pairId] = [...(groups[card.pairId] || []), card]
      return groups
    }, {}))

    for (const pair of pairs) {
      act(() => result.current.flipCard(pair[0].id))
      act(() => result.current.flipCard(pair[1].id))
      act(() => vi.advanceTimersByTime(800))
    }

    expect(result.current.gameOver).toBe(true)
    expect(result.current.dailyProgress.lastCompleted).toBe(result.current.dailyChallenge.key)
    expect(result.current.dailyProgress.results[result.current.dailyChallenge.key].score).toBe(result.current.score)
  })

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

describe('useGame timer lifecycle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  test('restarting during peek cancels the old countdown startup', () => {
    const { result } = renderHook(() => useGame())
    act(() => result.current.startGame('easy', 'emoji', 'timed'))
    act(() => vi.advanceTimersByTime(2_100))
    act(() => result.current.startGame('easy', 'emoji', 'timed'))
    act(() => vi.advanceTimersByTime(800))
    expect(result.current.peeking).toBe(true)
    expect(result.current.locked).toBe(true)
    act(() => vi.advanceTimersByTime(2_000))
    expect(result.current.time).toBe(60)
    act(() => vi.advanceTimersByTime(1_000))
    expect(result.current.time).toBe(59)
  })

  test('a pending match cannot change a restarted game', () => {
    const { result } = renderHook(() => useGame())
    act(() => {
      result.current.setSoundOn(false)
      result.current.startGame('easy', 'emoji', 'classic')
    })
    act(() => vi.advanceTimersByTime(2_800))
    const pair = result.current.cards.filter(c => c.pairId === result.current.cards[0].pairId)
    act(() => result.current.flipCard(pair[0].id))
    act(() => result.current.flipCard(pair[1].id))
    act(() => result.current.startGame('easy', 'emoji', 'classic'))
    act(() => vi.advanceTimersByTime(800))
    expect(result.current.matchedPairIds.size).toBe(0)
    expect(result.current.locked).toBe(true)
  })

  test('unmount cancels delayed startup and animation callbacks', () => {
    const { result, unmount } = renderHook(() => useGame())
    act(() => result.current.startGame('easy', 'emoji', 'classic'))
    act(() => vi.advanceTimersByTime(2_100))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    act(() => vi.advanceTimersByTime(5_000))
    expect(vi.getTimerCount()).toBe(0)
  })
})
