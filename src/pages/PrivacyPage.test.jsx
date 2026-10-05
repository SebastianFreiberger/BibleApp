import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PrivacyPage } from './PrivacyPage'

const { useLangMock } = vi.hoisted(() => ({ useLangMock: vi.fn() }))
vi.mock('../context', () => ({ useLang: useLangMock }))

function renderPage() {
  return render(
    <MemoryRouter>
      <PrivacyPage />
    </MemoryRouter>
  )
}

describe('PrivacyPage', () => {
  it('renders the Spanish content, including the AI-processing and minors sections', () => {
    useLangMock.mockReturnValue({ lang: 'es' })
    renderPage()

    expect(screen.getByRole('heading', { name: 'Privacidad' })).toBeInTheDocument()
    expect(screen.getAllByText(/Groq/).length).toBeGreaterThan(0)
    expect(screen.getByText('Si sos menor de edad')).toBeInTheDocument()
    expect(screen.getByText(/s\.freiberger@positive\.fit/)).toBeInTheDocument()
  })

  it('renders the English content', () => {
    useLangMock.mockReturnValue({ lang: 'en' })
    renderPage()

    expect(screen.getByRole('heading', { name: 'Privacy' })).toBeInTheDocument()
    expect(screen.getByText('If you are a minor')).toBeInTheDocument()
  })
})
