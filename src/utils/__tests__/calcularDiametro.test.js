import { describe, it, expect, beforeEach, vi } from 'vitest'
import { calcularDiametro } from '../calcularDiametro'

describe('calcularDiametro', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it.each([
    [10, 5.08, (10 * 5.08) / Math.PI],
    [20, 3, (20 * 3) / Math.PI],
    [1, 12.7, 12.7 / Math.PI],
  ])('computes (n * passo) / π for n=%s passo=%s', (n, passo, expected) => {
    expect(calcularDiametro(n, passo)).toBeCloseTo(expected, 10)
  })

  it('coerces numeric string teeth like the form does', () => {
    expect(calcularDiametro('10', 5.08)).toBeCloseTo((10 * 5.08) / Math.PI, 10)
  })

  it('documents empty string teeth coercing to 0 in JS', () => {
    expect(calcularDiametro('', 5.08)).toBe(0)
  })
})
