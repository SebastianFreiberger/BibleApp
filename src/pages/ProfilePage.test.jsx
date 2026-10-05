import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileInfoSection, AvatarUpload } from './ProfilePage'
import { UI_TEXT } from '../data'

const user_ = { name: 'Juan Pérez', email: 'juan@example.com', phone: '123456', createdAt: '2026-01-01' }

function makeFile({ type = 'image/png', sizeBytes = 1024 } = {}) {
  const file = new File(['x'], 'photo.png', { type })
  Object.defineProperty(file, 'size', { value: sizeBytes })
  return file
}

describe('AvatarUpload', () => {
  const t = UI_TEXT.es

  beforeEach(() => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:fake'), revokeObjectURL: vi.fn() })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rejects a non-image file with an error and does not open the crop modal', () => {
    render(<AvatarUpload avatarUrl={null} initials="JP" updateAvatar={vi.fn()} lang="es" t={t} onAvatarClick={vi.fn()} />)

    const input = screen.getByLabelText(t.changePhoto)
    fireEvent.change(input, { target: { files: [makeFile({ type: 'text/plain' })] } })

    expect(screen.getByText(t.avatarInvalidType)).toBeInTheDocument()
    expect(screen.queryByText(t.cropTitle)).not.toBeInTheDocument()
  })

  it('rejects an image larger than 3MB', () => {
    render(<AvatarUpload avatarUrl={null} initials="JP" updateAvatar={vi.fn()} lang="es" t={t} onAvatarClick={vi.fn()} />)

    const input = screen.getByLabelText(t.changePhoto)
    fireEvent.change(input, { target: { files: [makeFile({ sizeBytes: 4 * 1024 * 1024 })] } })

    expect(screen.getByText(t.avatarTooLarge)).toBeInTheDocument()
  })

  it('opens the crop modal for a valid image file', () => {
    render(<AvatarUpload avatarUrl={null} initials="JP" updateAvatar={vi.fn()} lang="es" t={t} onAvatarClick={vi.fn()} />)

    const input = screen.getByLabelText(t.changePhoto)
    fireEvent.change(input, { target: { files: [makeFile()] } })

    expect(screen.getByText(t.cropTitle)).toBeInTheDocument()
  })
})

describe('ProfileInfoSection', () => {
  // Regresión: handleSave no esperaba la promesa de onSave() y siempre mostraba
  // "¡Cambios guardados!", cerrando el formulario de edición aunque el guardado
  // hubiera fallado en el servidor (ej. contraseña rechazada por Supabase).
  it('shows an error and keeps editing open when the save actually fails', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue({ success: false, error: 'Password too weak' })

    render(<ProfileInfoSection user={user_} onSave={onSave} lang="es" />)
    await user.click(screen.getByRole('button', { name: 'Editar perfil' }))
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText(/no pudimos guardar los cambios/i)).toBeInTheDocument()
    expect(screen.queryByText(/¡cambios guardados!/i)).not.toBeInTheDocument()
    // El formulario de edición debe seguir abierto para que el usuario pueda reintentar
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })

  it('shows the success message and closes editing when the save actually succeeds', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn().mockResolvedValue({ success: true })

    render(<ProfileInfoSection user={user_} onSave={onSave} lang="es" />)
    await user.click(screen.getByRole('button', { name: 'Editar perfil' }))
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText(/¡cambios guardados!/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar perfil' })).toBeInTheDocument()
  })

  it('validates password confirmation client-side before calling onSave', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<ProfileInfoSection user={user_} onSave={onSave} lang="es" />)
    await user.click(screen.getByRole('button', { name: 'Editar perfil' }))
    await user.type(screen.getByPlaceholderText('Dejar vacío para no cambiar'), 'nuevaPass123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'otraDistinta')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('rejects a new password shorter than 8 characters client-side', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<ProfileInfoSection user={user_} onSave={onSave} lang="es" />)
    await user.click(screen.getByRole('button', { name: 'Editar perfil' }))
    await user.type(screen.getByPlaceholderText('Dejar vacío para no cambiar'), 'short1')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'short1')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText(/al menos 8 caracteres/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })
})
