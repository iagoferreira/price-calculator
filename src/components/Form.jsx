import { useState, useMemo } from 'react'
import { calcularPesoDaPeca } from '@/utils/calcularPesoDaPeca'
import { pegarPassos } from '@/utils/pegarPassos'
import { InputWithLabel, PrecoInputWithLabel } from '@/components/InputWithLabel'
import { Button } from '@/components/ui/button'
import { SelectWithLabel } from '@/components/SelectWithLabel'
import { Combobox } from '@/components/Combobox'
import { Label } from '@/components/ui/label'

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
        className="relative"
        onSubmit={(e) => {
          e.preventDefault()
          callCalcularPesoDaPeca()
        }}
      >
        <div className="flex flex-row gap-3">
          <div className="flex flex-col gap-2">
            <InputWithLabel
              label="Número de dentes"
              onChange={(event) => setNumeroDeDentes(event.currentTarget.value)}
            />

            <InputWithLabel
              label="Comprimento da peça"
              onChange={(event) =>
                setComprimentoDaPeca(event.currentTarget.value)
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <SelectWithLabel
              label="Material"
              onValueChange={setMaterial}
              options={['Aço', 'Aluminio']}
              value={material}
            />

            <Combobox
              value={passoName}
              setValue={setPassoName}
              options={memoizedPassos}
            />
          </div>
        </div>

        <PrecoInputWithLabel
          label="Preço atual"
          onChange={(event) => setPreco(event.currentTarget.value)}
        />

        <Button type="submit" variant="outline" className="mt-4">
          Calcular
        </Button>

        <Label className="absolute bottom-1.5 left-1/3 text-xl">
          Valor final: {textoValorFinal}
        </Label>
      </form>
    </div>
  )
}
