import pesosAcoJson from '../tables/tabela-pesos-aco.json'
import pesosAluminioJson from '../tables/tabela-peso-aluminio.json'

export function encontrarPesoDoMaterial(diametroRecebido, material) {
  const { pesosAco } = pesosAcoJson
  const { pesosAluminio } = pesosAluminioJson
  const lowerCaseMaterial = material.toLowerCase()
  const arrayDePesosDoMaterial =
    lowerCaseMaterial === 'aço' ? pesosAco : pesosAluminio
  let pesoDoMaterial

  if (import.meta.env.DEV) {
    console.log(arrayDePesosDoMaterial)
  }

  for (let i = 0; i < arrayDePesosDoMaterial.length; i++) {
    const { diametro, valor } = arrayDePesosDoMaterial[i]

    if (diametro > diametroRecebido) {
      pesoDoMaterial = valor
      break
    }
  }

  return pesoDoMaterial
}
