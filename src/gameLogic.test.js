import { describe, expect, test } from 'vitest'
import { generateCards, shuffle } from './gameLogic'

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

  test('rejects an unknown difficulty', () => {
    expect(() => generateCards('impossible', 'emoji')).toThrow('Unknown difficulty: impossible')
  })

  test('rejects an unknown theme', () => {
    expect(() => generateCards('easy', 'unknown')).toThrow('Unknown theme: unknown')
  })
})
