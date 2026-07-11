import { describe, expect, test } from 'vitest'
import { shuffle } from './gameLogic'

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
