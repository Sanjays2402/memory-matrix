import { beforeEach, describe, expect, test, vi } from 'vitest'
import { calculateMatchReward, formatTime, generateCards, getBestScores, getTimedBonus, saveBestScore, shuffle } from './gameLogic'

describe('shuffle', () => {
  test('does not mutate its input', () => {
    const input = [1, 2, 3, 4]

    shuffle(input, () => 0)

    expect(input).toEqual([1, 2, 3, 4])
  })

  test('accepts a random source for deterministic Fisher-Yates output', () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1])
  })
})

describe('generateCards', () => {
  test('creates two cards for every pair with unique card IDs', () => {
    const cards = generateCards('easy', 'numbers', () => 0)
    const pairCounts = cards.reduce((counts, card) => {
      counts[card.pairId] = (counts[card.pairId] || 0) + 1
      return counts
    }, {})

    expect(cards).toHaveLength(16)
    expect(new Set(cards.map(card => card.id))).toHaveProperty('size', 16)
    expect(Object.values(pairCounts)).toEqual(Array(8).fill(2))
  })

  test('creates image-backed programming cards with accessible labels', () => {
    const cards = generateCards('easy', 'programming', () => 0)

    expect(cards[0].symbol).toEqual(expect.objectContaining({
      name: expect.any(String),
      image: expect.stringMatching(/^\.\/programming-logos\/.+\.svg$/),
      color: expect.stringMatching(/^#/),
    }))
  })

  test('rejects an unknown difficulty', () => {
    expect(() => generateCards('impossible', 'emoji')).toThrow('Unknown difficulty: impossible')
  })

  test('rejects an unknown theme', () => {
    expect(() => generateCards('easy', 'unknown')).toThrow('Unknown theme: unknown')
  })
})

describe('best scores', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  test('ignores stored JSON values that are not score maps', () => {
    localStorage.setItem('memory-matrix-scores', '[]')

    expect(getBestScores()).toEqual({})
  })

  test('returns false instead of throwing when storage writes are blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'QuotaExceededError')
    })

    expect(saveBestScore('easy', 'emoji', { moves: 8, time: 20, stars: 3 })).toBe(false)
  })

  test('replaces a malformed score entry with a valid score', () => {
    localStorage.setItem('memory-matrix-scores', JSON.stringify({ 'easy-emoji': 'corrupt' }))

    expect(saveBestScore('easy', 'emoji', { moves: 8, time: 20, stars: 3 })).toBe(true)
    expect(getBestScores()['easy-emoji']).toMatchObject({ moves: 8, time: 20, stars: 3 })
  })

  test('keeps a lower-move score even when a slower score arrives later', () => {
    expect(saveBestScore('easy', 'emoji', { moves: 8, time: 30, stars: 3 })).toBe(true)
    expect(saveBestScore('easy', 'emoji', { moves: 9, time: 20, stars: 3 })).toBe(false)

    expect(getBestScores()['easy-emoji']).toMatchObject({ moves: 8, time: 30 })
  })
})

describe('game rewards', () => {
  test.each([
    [1, false, 100],
    [2, false, 250],
    [3, false, 450],
    [7, false, 1250],
    [3, true, 225],
  ])('scores combo %s with hint=%s as %s points', (combo, hintUsed, expected) => {
    expect(calculateMatchReward(combo, hintUsed)).toBe(expected)
  })

  test.each([
    ['easy', 2],
    ['medium', 3],
    ['hard', 4],
    ['unknown', 0],
  ])('awards %s timed matches %s bonus seconds', (difficulty, expected) => {
    expect(getTimedBonus(difficulty)).toBe(expected)
  })
})

describe('formatTime', () => {
  test.each([
    [0, '0:00'],
    [65, '1:05'],
    [65.9, '1:05'],
    [-1, '0:00'],
    [Number.NaN, '0:00'],
    [Number.POSITIVE_INFINITY, '0:00'],
  ])('formats %s seconds as %s', (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected)
  })
})
