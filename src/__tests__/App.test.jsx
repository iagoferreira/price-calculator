import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders instructions and the calculator form', () => {
    render(<App />)
    expect(screen.getByText(/Após preencher os campos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/numero de dentes/i)).toBeInTheDocument()
  })
})
