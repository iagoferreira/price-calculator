import { calcularDiametro } from './calcularDiametro'
import { encontrarPesoDoMaterial } from './encontrarPesoDoMaterial'
import { transformarKgMparaKgMM } from './transformarKgMparaKgMM'

export function calcularPesoDaPeca(
  numeroDeDentes,
  passo,
  material,
  comprimentoDaPeca
) {
  const diametro = calcularDiametro(numeroDeDentes, passo)
  const pesoEmKgM = encontrarPesoDoMaterial(diametro, material)
  const pesoEmKgMM = transformarKgMparaKgMM(pesoEmKgM)

  if (import.meta.env.DEV) {
    console.log(diametro, pesoEmKgM, pesoEmKgMM)
  }

  return comprimentoDaPeca * pesoEmKgMM
}
