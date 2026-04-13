import { describe, it, expect } from 'vitest'
import { transformarKgMparaKgMM } from '../transformarKgMparaKgMM'

describe('transformarKgMparaKgMM', () => {
  it.each([
    [1000, 1],
    [2.24, 0.00224],
    [0, 0],
  ])('divides kg/m by 1000 (input %s → %s)', (input, expected) => {
    expect(transformarKgMparaKgMM(input)).toBeCloseTo(expected, 10)
  })
})
