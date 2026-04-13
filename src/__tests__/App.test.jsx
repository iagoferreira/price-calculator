import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders instructions and the calculator form', () => {
    render(<App />)
    expect(
      screen.getByText(/Após preencher os campos, clique em Calcular/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/número de dentes/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /usar tema claro|usar tema escuro/i })
    ).toBeInTheDocument()
  })
})
