import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from './RegisterPage'
import { UI_TEXT } from '../data/i18n'

const t = UI_TEXT.es

const { registerMock } = vi.hoisted(() => ({ registerMock: vi.fn() }))
vi.mock('../context', () => ({
  useAuth: () => ({ register: registerMock }),
  useLang: () => ({ lang: 'es' }),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
}

async function fillAndSubmit(user, { password = 'password123', confirm = 'password123', consent = true, phone = '' } = {}) {
  await user.type(screen.getByLabelText(t.nameLabel), 'Juan Pérez')
  await user.type(screen.getByLabelText(t.emailLabel), 'juan@example.com')
  if (phone) await user.type(screen.getByLabelText(t.phoneLabel), phone)
  await user.type(screen.getByLabelText(t.passwordLabel), password)
  await user.type(screen.getByLabelText(t.confirmPasswordLabel), confirm)
  if (consent) await user.click(screen.getByRole('checkbox'))
  await user.click(screen.getByRole('button', { name: t.registerBtn }))
}

describe('RegisterPage', () => {
  it('rejects a password shorter than 8 characters without calling the API', async () => {
    const user = userEvent.setup()
    renderPage()
    await fillAndSubmit(user, { password: '123', confirm: '123' })

    expect(screen.getByText(t.passwordTooShort)).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('rejects a phone number with an invalid format without calling the API', async () => {
    const user = userEvent.setup()
    renderPage()
    await fillAndSubmit(user, { phone: '12abc' })

    expect(screen.getByText(t.phoneInvalid)).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('rejects mismatched passwords without calling the API', async () => {
    const user = userEvent.setup()
    renderPage()
    await fillAndSubmit(user, { password: 'password123', confirm: 'different123' })

    expect(screen.getByText(t.passwordMismatch)).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  // Regresión: antes, CUALQUIER fallo de register() (ya sea el email duplicado,
  // una contraseña rechazada por Supabase, o un error de red) se mostraba
  // siempre como "Este email ya está registrado", aunque no fuera la causa real.
  it('shows a generic error for any registration failure, not a hardcoded "email exists" message', async () => {
    const user = userEvent.setup()
    registerMock.mockResolvedValue({ success: false, error: 'Password should be at least 8 characters' })
    renderPage()
    await fillAndSubmit(user)

    expect(await screen.findByText(t.registerGenericError)).toBeInTheDocument()
    expect(screen.queryByText(/ya está registrado/i)).not.toBeInTheDocument()
  })

  it('navigates away on a successful registration', async () => {
    const user = userEvent.setup()
    registerMock.mockResolvedValue({ success: true })
    renderPage()
    await fillAndSubmit(user)

    expect(registerMock).toHaveBeenCalledWith('Juan Pérez', 'juan@example.com', '', 'password123')
  })

  // La app ahora exige aceptar la Política de Privacidad antes de crear la cuenta.
  it('requires accepting the privacy policy before calling the API', async () => {
    const user = userEvent.setup()
    renderPage()
    await fillAndSubmit(user, { consent: false })

    expect(screen.getByText(t.consentRequired)).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('links the consent checkbox to the privacy policy page', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /política de privacidad/i })
    expect(link).toHaveAttribute('href', '/privacidad')
  })
})
