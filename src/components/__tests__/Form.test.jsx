import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../Form'
import { calcularPesoDaPeca } from '../../utils/calcularPesoDaPeca'
import { pegarPassos } from '../../utils/pegarPassos'

function readValorFinal(container) {
  const el = within(container).getByText(/valor final:/i)
  const raw = el.textContent.replace(/^[\s\S]*valor final:\s*/i, '').trim()
  return Number.parseFloat(raw)
}

describe('Form', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('submits with user input and shows peso × preço for default passo and Aço', async () => {
    const user = userEvent.setup()
    const { container } = render(<Form />)
    const form = within(container)

    const passo0 = pegarPassos()[0]
    const preco = 5
    const expected =
      calcularPesoDaPeca('10', passo0.valor, 'Aço', '100') * preco

    await user.type(form.getByLabelText(/numero de dentes/i), '10')
    await user.type(form.getByLabelText(/comprimento da peça/i), '100')
    await user.type(form.getByLabelText(/preço atual/i), String(preco))

    await user.click(form.getByRole('button', { name: /calcular/i }))

    await waitFor(() => {
      expect(readValorFinal(container)).toBeCloseTo(expected, 5)
    })
  })

  it('updates resultado when material is changed to Aluminio', async () => {
    const user = userEvent.setup()
    const { container } = render(<Form />)
    const form = within(container)

    const passo0 = pegarPassos()[0]
    const preco = 2
    await user.type(form.getByLabelText(/numero de dentes/i), '10')
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
      calcularPesoDaPeca('10', passo0.valor, 'Aluminio', '100') * preco
    await waitFor(() => {
      expect(readValorFinal(container)).toBeCloseTo(expected, 5)
    })
  })

  it('lets the user pick another passo from the combobox and recalculates', async () => {
    const user = userEvent.setup()
    const { container } = render(<Form />)
    const form = within(container)

    const passoH = pegarPassos().find((p) => p.passo === 'H')
    expect(passoH).toBeDefined()

    await user.type(form.getByLabelText(/numero de dentes/i), '10')
    await user.type(form.getByLabelText(/comprimento da peça/i), '100')
    await user.type(form.getByLabelText(/preço atual/i), '1')

    const passoTrigger = form.getByRole('combobox', { name: /passo/i })
    await user.click(passoTrigger)

    await screen.findByPlaceholderText(/procure passo/i)

    await user.click(
      within(document.body).getByRole('option', { name: /^H$/i })
    )

    await user.click(form.getByRole('button', { name: /calcular/i }))

    const expected = calcularPesoDaPeca('10', passoH.valor, 'Aço', '100') * 1
    await waitFor(() => {
      expect(readValorFinal(container)).toBeCloseTo(expected, 5)
    })
  })
})
