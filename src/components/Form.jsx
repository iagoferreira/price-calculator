import { useState, useMemo } from 'react'
import { calcularPesoDaPeca } from '@/utils/calcularPesoDaPeca'
import { pegarPassos } from '@/utils/pegarPassos'
import { InputWithLabel, PrecoInputWithLabel } from '@/components/InputWithLabel'
import { Button } from '@/components/ui/button'
import { SelectWithLabel } from '@/components/SelectWithLabel'
import { Combobox } from '@/components/Combobox'

/** pt-BR com até 20 casas decimais (máx. do Intl); evita truncar como em maximumFractionDigits: 2. */
function formatarValorFinalPreciso(valor) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  }).format(valor)
}

/** Interpreta número com vírgula ou ponto decimal (ex.: 1.234,56 ou 5.5). */
function parseNumeroDigitado(valor) {
  const t = String(valor).trim()
  if (t === '') return Number.NaN
  const lastComma = t.lastIndexOf(',')
  const lastDot = t.lastIndexOf('.')
  if (lastComma > lastDot) {
    return Number.parseFloat(t.replace(/\./g, '').replace(',', '.'))
  }
  return Number.parseFloat(t.replace(',', '.'))
}

function getPassosArray(passos) {
  return passos.map((p) => p.passo)
}

export function Form() {
  const passos = useMemo(() => pegarPassos(), [])
  const [numeroDeDentes, setNumeroDeDentes] = useState('')
  const [passoName, setPassoName] = useState(passos[0].passo)
  const [material, setMaterial] = useState('Aço')
  const [comprimentoDaPeca, setComprimentoDaPeca] = useState('')
  const [pesoDaPeca, setPesoDaPeca] = useState('')
  const [preco, setPreco] = useState('')

  const passoValue = useMemo(() => {
    const findPasso = passos.find((p) => p.passo === passoName)
    return findPasso ? findPasso.valor : ''
  }, [passos, passoName])

  const memoizedPassos = useMemo(() => getPassosArray(passos), [passos])

  function callCalcularPesoDaPeca() {
    const massaCalculada = calcularPesoDaPeca(
      numeroDeDentes,
      passoValue,
      material,
      comprimentoDaPeca
    )
    const precoNumero = parseNumeroDigitado(preco)

    if (
      !Number.isFinite(massaCalculada) ||
      !Number.isFinite(precoNumero)
    ) {
      setPesoDaPeca('')
      return
    }

    setPesoDaPeca(massaCalculada * precoNumero)
  }

  const textoValorFinal =
    pesoDaPeca === ''
      ? ''
      : formatarValorFinalPreciso(pesoDaPeca)

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          callCalcularPesoDaPeca()
        }}
      >
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4">
          <InputWithLabel
            label="Número de dentes"
            onChange={(event) => setNumeroDeDentes(event.currentTarget.value)}
          />

          <SelectWithLabel
            label="Material"
            onValueChange={setMaterial}
            options={['Aço', 'Aluminio']}
            value={material}
          />

          <InputWithLabel
            label="Comprimento da peça"
            onChange={(event) =>
              setComprimentoDaPeca(event.currentTarget.value)
            }
          />

          <Combobox
            value={passoName}
            setValue={setPassoName}
            options={memoizedPassos}
          />

          <PrecoInputWithLabel
            label="Preço atual"
            onChange={(event) => setPreco(event.currentTarget.value)}
          />

          <div className="flex min-h-[2.5rem] items-end justify-end">
            <Button type="submit" variant="outline" size="sm" className="shrink-0">
              Calcular
            </Button>
          </div>
        </div>

        <div className="mt-3 border-t border-border/60 pt-2.5">
          <p className="text-sm font-semibold tabular-nums tracking-tight text-foreground">
            Valor final:{' '}
            <span className="font-mono text-base font-medium">
              {textoValorFinal}
            </span>
          </p>
        </div>
      </form>
    </div>
  )
}
