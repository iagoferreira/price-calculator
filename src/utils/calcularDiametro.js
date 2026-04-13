export function calcularDiametro(numeroDeDentes, passo) {
  if (import.meta.env.DEV) {
    console.log(numeroDeDentes, passo)
  }
  const PI = Math.PI

  return (numeroDeDentes * passo) / PI
}
