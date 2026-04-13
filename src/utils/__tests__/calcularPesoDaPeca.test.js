import { describe, it, expect, beforeEach, vi } from 'vitest'
import { calcularPesoDaPeca } from '../calcularPesoDaPeca'
import { getBundledDefaultTables } from '@/lib/bundledTables'

describe('calcularPesoDaPeca', () => {
  const tables = getBundledDefaultTables()

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('matches golden path for aço XL pitch (5.08) with numeric inputs', () => {
    expect(calcularPesoDaPeca(10, 5.08, 'Aço', 100, tables)).toBeCloseTo(
      0.224,
      10
    )
  })

  it('accepts string inputs from the form like the UI provides', () => {
    expect(
      calcularPesoDaPeca('10', 5.08, 'Aço', '100', tables)
    ).toBeCloseTo(0.224, 10)
  })

  it('computes aluminio path for 20 teeth × 3mm pitch and 50mm length', () => {
    const diam = (20 * 3) / Math.PI
    expect(diam).toBeCloseTo(19.098593171, 5)
    // first aluminio row with diametro > ~19.1 is 25.4 → valor 1.371 kg/m
    expect(
      calcularPesoDaPeca(20, 3, 'Aluminio', 50, tables)
    ).toBeCloseTo(50 * (1.371 / 1000), 10)
  })

  it('returns NaN when material lookup is undefined (oversized diameter)', () => {
    const result = calcularPesoDaPeca(1e9, 5, 'Aço', 1, tables)
    expect(Number.isNaN(result)).toBe(true)
  })
})
