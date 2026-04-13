export function encontrarPesoDoMaterial(diametroRecebido, material, tables) {
  const { pesosAco, pesosAluminio } = tables
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
