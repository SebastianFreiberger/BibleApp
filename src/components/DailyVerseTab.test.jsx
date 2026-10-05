import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DailyVerseTab } from './DailyVerseTab'
import { UI_TEXT } from '../data/i18n'

const t = UI_TEXT.es

const baseProps = {
  loading: false,
  currentVerse: null,
  showRandom: false,
  loadingRandom: false,
  error: false,
  onRetry: vi.fn(),
  generateRandomVerse: vi.fn(),
  backToDaily: vi.fn(),
  dailyAttribute: null,
  isFavorite: () => false,
  onToggleFavorite: vi.fn(),
  t,
}

describe('DailyVerseTab', () => {
  it('shows the loading state and nothing else', () => {
    render(<DailyVerseTab {...baseProps} loading />)
    expect(screen.getByText(t.loading)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: t.addFavorite })).not.toBeInTheDocument()
  })

  // Regresión del bug real: con error y sin versículo válido, no debe haber
  // botón de favorito ni de compartir disponibles sobre el mensaje de error.
  it('shows an error state with a retry button and no favorite/share actions', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<DailyVerseTab {...baseProps} error currentVerse={null} onRetry={onRetry} />)

    expect(screen.getByText(t.verseError)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: t.addFavorite })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: t.share })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: new RegExp(t.retry) }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('renders nothing when there is no verse and no error (initial render)', () => {
    const { container } = render(<DailyVerseTab {...baseProps} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the verse with working favorite and share buttons on success', async () => {
    const user = userEvent.setup()
    const onToggleFavorite = vi.fn()
    const verse = { reference: 'Romanos 12:6', text: 'texto real del versículo', version: 'RV1960' }

    render(
      <DailyVerseTab
        {...baseProps}
        currentVerse={verse}
        isFavorite={() => false}
        onToggleFavorite={onToggleFavorite}
      />
    )

    expect(screen.getByText(`"${verse.text}"`)).toBeInTheDocument()
    const favBtn = screen.getByRole('button', { name: t.addFavorite })
    await user.click(favBtn)
    expect(onToggleFavorite).toHaveBeenCalledWith(verse)
  })

  it('reflects an already-favorited verse', () => {
    const verse = { reference: 'Romanos 12:6', text: 'texto real', version: 'RV1960' }
    render(<DailyVerseTab {...baseProps} currentVerse={verse} isFavorite={() => true} />)
    expect(screen.getByRole('button', { name: t.removeFavorite })).toBeInTheDocument()
  })
})
