import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders instructions and the calculator form', async () => {
    render(<App />)
    expect(
      screen.getByText(/Após preencher os campos, clique em Calcular/i)
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText(/número de dentes/i)).toBeInTheDocument()
    })
    expect(
      screen.getByRole('button', { name: /usar tema claro|usar tema escuro/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /configurações/i })
    ).toBeInTheDocument()
  })
})
