import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../Form'
import { TablesProvider } from '../../context/TablesContext'
import { calcularPesoDaPeca } from '../../utils/calcularPesoDaPeca'
import { pegarPassos } from '../../utils/pegarPassos'
import { getBundledDefaultTables } from '../../lib/bundledTables'

/** Lê o número em pt-BR após «Valor final:» (ex.: 1,12 ou 1.234,56). */
function readValorFinal(container) {
  const el = within(container).getByText(/valor final:/i)
  const raw = el.textContent.replace(/^[\s\S]*valor final:\s*/i, '').trim()
  if (raw === '') return Number.NaN
  return Number.parseFloat(raw.replace(/\./g, '').replace(',', '.'))
}

function renderForm() {
  return render(
    <TablesProvider>
      <Form />
    </TablesProvider>
  )
}

describe('Form', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('submits with user input and shows peso × preço for default passo and Aço', async () => {
    const user = userEvent.setup()
    const tables = getBundledDefaultTables()
    const { container } = renderForm()
    const form = within(container)

    const passo0 = pegarPassos(tables)[0]
    const preco = 5
    const expected =
      calcularPesoDaPeca('10', passo0.valor, 'Aço', '100', tables) * preco

    await waitFor(() => {
      expect(form.getByLabelText(/número de dentes/i)).toBeInTheDocument()
    })
    await user.type(form.getByLabelText(/número de dentes/i), '10')
    await user.type(form.getByLabelText(/comprimento da peça/i), '100')
    await user.type(form.getByLabelText(/preço atual/i), String(preco))

    await user.click(form.getByRole('button', { name: /calcular/i }))

    await waitFor(() => {
      expect(readValorFinal(container)).toBeCloseTo(expected, 10)
    })
  })

  it('updates resultado when material is changed to Aluminio', async () => {
    const user = userEvent.setup()
    const tables = getBundledDefaultTables()
    const { container } = renderForm()
    const form = within(container)

    const passo0 = pegarPassos(tables)[0]
    const preco = 2
    await waitFor(() => {
      expect(form.getByLabelText(/número de dentes/i)).toBeInTheDocument()
    })
    await user.type(form.getByLabelText(/número de dentes/i), '10')
    await user.type(form.getByLabelText(/comprimento da peça/i), '100')
    await user.type(form.getByLabelText(/preço atual/i), String(preco))

    // Radix Select mirrors options on a visually hidden native <select> — use it in jsdom
    // to avoid pointer-capture quirks on the trigger button.
    const materialNativeSelect = container.querySelector(
      'select[aria-hidden="true"]'
    )
    expect(materialNativeSelect).toBeTruthy()
    await user.selectOptions(materialNativeSelect, 'Aluminio')

    await user.click(form.getByRole('button', { name: /calcular/i }))

    const expected =
      calcularPesoDaPeca('10', passo0.valor, 'Aluminio', '100', tables) *
      preco
    await waitFor(() => {
      expect(readValorFinal(container)).toBeCloseTo(expected, 10)
    })
  })

  it('lets the user pick another passo from the combobox and recalculates', async () => {
    const user = userEvent.setup()
    const tables = getBundledDefaultTables()
    const { container } = renderForm()
    const form = within(container)

    const passoH = pegarPassos(tables).find((p) => p.passo === 'H')
    expect(passoH).toBeDefined()

    await waitFor(() => {
      expect(form.getByLabelText(/número de dentes/i)).toBeInTheDocument()
    })
    await user.type(form.getByLabelText(/número de dentes/i), '10')
    await user.type(form.getByLabelText(/comprimento da peça/i), '100')
    await user.type(form.getByLabelText(/preço atual/i), '1')

    const passoTrigger = form.getByRole('combobox', { name: /passo/i })
    await user.click(passoTrigger)

    await screen.findByPlaceholderText(/procure um passo/i)

    await user.click(
      within(document.body).getByRole('option', { name: /^H$/i })
    )

    await user.click(form.getByRole('button', { name: /calcular/i }))

    const expected =
      calcularPesoDaPeca('10', passoH.valor, 'Aço', '100', tables) * 1
    await waitFor(() => {
      expect(readValorFinal(container)).toBeCloseTo(expected, 10)
    })
  })

  it('não mostra valor final quando o preço é inválido', async () => {
    const user = userEvent.setup()
    const { container } = renderForm()
    const form = within(container)

    await waitFor(() => {
      expect(form.getByLabelText(/número de dentes/i)).toBeInTheDocument()
    })
    await user.type(form.getByLabelText(/número de dentes/i), '10')
    await user.type(form.getByLabelText(/comprimento da peça/i), '100')
    await user.type(form.getByLabelText(/preço atual/i), 'não-é-número')

    await user.click(form.getByRole('button', { name: /calcular/i }))

    await waitFor(() => {
      const el = within(container).getByText(/valor final:/i)
      expect(el.textContent.replace(/^[\s\S]*valor final:\s*/i, '').trim()).toBe(
        ''
      )
    })
  })
})
