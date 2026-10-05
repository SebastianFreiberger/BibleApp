import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPassword } from './LoginPage'
import { UI_TEXT } from '../data/i18n'

const t = UI_TEXT.es

describe('ForgotPassword', () => {
  // Regresión: antes, CUALQUIER error de sendPasswordReset (rate limit, redirect
  // URL inválida, lo que sea) se mostraba como "no encontramos esa cuenta" —
  // un mensaje falso, ya que Supabase nunca revela si un email existe.
  it('shows a generic error message regardless of the underlying failure reason', async () => {
    const user = userEvent.setup()
    const sendPasswordReset = vi.fn().mockResolvedValue({ success: false, error: 'rate limit exceeded' })

    render(<ForgotPassword t={t} sendPasswordReset={sendPasswordReset} onBack={vi.fn()} />)

    await user.type(screen.getByLabelText(t.forgotEmailLabel), 'alguien@example.com')
    await user.click(screen.getByRole('button', { name: t.forgotSubmitEmail }))

    expect(await screen.findByText(t.forgotGenericError)).toBeInTheDocument()
    expect(screen.queryByText(/no encontramos/i)).not.toBeInTheDocument()
  })

  it('shows the confirmation screen on success', async () => {
    const user = userEvent.setup()
    const sendPasswordReset = vi.fn().mockResolvedValue({ success: true })

    render(<ForgotPassword t={t} sendPasswordReset={sendPasswordReset} onBack={vi.fn()} />)

    await user.type(screen.getByLabelText(t.forgotEmailLabel), 'alguien@example.com')
    await user.click(screen.getByRole('button', { name: t.forgotSubmitEmail }))

    expect(await screen.findByText(t.forgotSentTitle)).toBeInTheDocument()
    expect(screen.getByText('alguien@example.com')).toBeInTheDocument()
  })

  it('calls onBack when the back link is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<ForgotPassword t={t} sendPasswordReset={vi.fn()} onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: t.forgotBackToLogin }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
