import { beforeEach, describe, expect, test, vi } from 'vitest'
import { THEMES, calculateMatchReward, completeDailyChallenge, createSeededRng, formatTime, generateCards, getBestScore, getBestScores, getDailyChallenge, getDailyProgress, getTimedBonus, saveBestScore, shuffle } from './gameLogic'

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
    expect(getBestScore('easy', 'emoji')).toMatchObject({ moves: 8, time: 20, stars: 3 })
  })

  test('keeps a lower-move score even when a slower score arrives later', () => {
    expect(saveBestScore('easy', 'emoji', { moves: 8, time: 30, stars: 3 })).toBe(true)
    expect(saveBestScore('easy', 'emoji', { moves: 9, time: 20, stars: 3 })).toBe(false)

    expect(getBestScore('easy', 'emoji')).toMatchObject({ moves: 8, time: 30 })
  })

  test('keeps Classic and Time Attack records separate', () => {
    saveBestScore('easy', 'emoji', { moves: 8, time: 30, score: 900 }, 'classic')
    saveBestScore('easy', 'emoji', { moves: 12, time: 18, score: 1500 }, 'timed')

    expect(getBestScore('easy', 'emoji', 'classic')).toMatchObject({ moves: 8, time: 30 })
    expect(getBestScore('easy', 'emoji', 'timed')).toMatchObject({ score: 1500, time: 18 })
  })

  test('prefers a higher Time Attack score, then more remaining time', () => {
    expect(saveBestScore('easy', 'emoji', { moves: 12, time: 18, score: 1500 }, 'timed')).toBe(true)
    expect(saveBestScore('easy', 'emoji', { moves: 11, time: 25, score: 1400 }, 'timed')).toBe(false)
    expect(saveBestScore('easy', 'emoji', { moves: 13, time: 22, score: 1500 }, 'timed')).toBe(true)

    expect(getBestScore('easy', 'emoji', 'timed')).toMatchObject({ score: 1500, time: 22 })
  })
})

describe('daily challenge', () => {
  beforeEach(() => localStorage.clear())

  test('creates the same deterministic card order for the same seed', () => {
    const first = generateCards('medium', 'programming', createSeededRng('2026-07-12'))
    const second = generateCards('medium', 'programming', createSeededRng('2026-07-12'))
    const another = generateCards('medium', 'programming', createSeededRng('2026-07-13'))

    expect(first.map(card => card.id)).toEqual(second.map(card => card.id))
    expect(first.map(card => card.id)).not.toEqual(another.map(card => card.id))
  })

  test('rotates a medium daily challenge deck by UTC date', () => {
    const challenge = getDailyChallenge(new Date('2026-07-12T17:00:00Z'))

    expect(challenge).toMatchObject({ key: '2026-07-12', difficulty: 'medium' })
    expect(THEMES).toHaveProperty(challenge.theme)
    expect(challenge.seed).toContain('2026-07-12')
  })

  test('increments consecutive daily completions without double-counting a replay', () => {
    expect(completeDailyChallenge('2026-07-11', { score: 900, moves: 20, time: 55 })).toMatchObject({ streak: 1 })
    expect(completeDailyChallenge('2026-07-12', { score: 1200, moves: 18, time: 49 })).toMatchObject({ streak: 2 })
    expect(completeDailyChallenge('2026-07-12', { score: 1100, moves: 19, time: 50 })).toMatchObject({ streak: 2 })
    expect(getDailyProgress()).toMatchObject({ lastCompleted: '2026-07-12', streak: 2 })
  })

  test('does not move the active streak backward when replaying an older puzzle', () => {
    completeDailyChallenge('2026-07-11', { score: 900, moves: 20, time: 55 })
    completeDailyChallenge('2026-07-12', { score: 1200, moves: 18, time: 49 })
    completeDailyChallenge('2026-07-10', { score: 1500, moves: 17, time: 45 })

    const progress = getDailyProgress()
    expect(progress).toMatchObject({ lastCompleted: '2026-07-12', streak: 2 })
    expect(progress.results['2026-07-10']).toMatchObject({ score: 1500 })
  })

  test('resets the streak after a missed day and preserves the better same-day score', () => {
    completeDailyChallenge('2026-07-09', { score: 800, moves: 24, time: 70 })
    completeDailyChallenge('2026-07-12', { score: 1000, moves: 22, time: 60 })
    completeDailyChallenge('2026-07-12', { score: 1400, moves: 20, time: 54 })

    const progress = getDailyProgress()
    expect(progress.streak).toBe(1)
    expect(progress.results['2026-07-12']).toMatchObject({ score: 1400, moves: 20 })
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
