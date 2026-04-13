import { describe, it, expect, beforeEach, vi } from 'vitest'
import { encontrarPesoDoMaterial } from '../encontrarPesoDoMaterial'
import { getBundledDefaultTables } from '@/lib/bundledTables'

describe('encontrarPesoDoMaterial', () => {
  const tables = getBundledDefaultTables()

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('uses tabela aço when material normalizes to aço', () => {
    // diam16.17 → first row with diametro > 16.17 is 19.05 → valor 2.24
    expect(encontrarPesoDoMaterial(16.17, 'Aço', tables)).toBe(2.24)
    expect(encontrarPesoDoMaterial(16.17, 'aço', tables)).toBe(2.24)
  })

  it('uses tabela aluminio for non-aço materials', () => {
    expect(encontrarPesoDoMaterial(10, 'Aluminio', tables)).toBe(13.42)
    expect(encontrarPesoDoMaterial(10, 'aluminio', tables)).toBe(13.42)
  })

  it('returns first matching valor strictly greater than diameter', () => {
    expect(encontrarPesoDoMaterial(6.35, 'Aço', tables)).toBe(0.99)
    expect(encontrarPesoDoMaterial(6.34, 'Aço', tables)).toBe(0.25)
  })

  it('returns undefined when no table row has diametro > recebido', () => {
    expect(encontrarPesoDoMaterial(1e9, 'Aço', tables)).toBeUndefined()
    expect(encontrarPesoDoMaterial(1e9, 'Aluminio', tables)).toBeUndefined()
  })
})
