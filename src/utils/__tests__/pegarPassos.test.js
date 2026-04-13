import { describe, it, expect } from 'vitest'
import { pegarPassos } from '../pegarPassos'

describe('pegarPassos', () => {
  it('returns a non-empty list with passo and valor keys', () => {
    const passos = pegarPassos()
    expect(passos.length).toBeGreaterThan(0)
    for (const p of passos) {
      expect(p).toHaveProperty('passo')
      expect(p).toHaveProperty('valor')
      expect(typeof p.passo).toBe('string')
      expect(typeof p.valor).toBe('number')
    }
  })

  it('includes known pitch entries from tabela-passos', () => {
    const passos = pegarPassos()
    const xl = passos.find((p) => p.passo === 'XL')
    expect(xl?.valor).toBe(5.08)
    const h = passos.find((p) => p.passo === 'H')
    expect(h?.valor).toBe(12.7)
  })
})
