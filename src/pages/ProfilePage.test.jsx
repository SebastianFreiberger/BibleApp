import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileInfoSection } from './ProfilePage'

const user_ = { name: 'Juan Pérez', email: 'juan@example.com', phone: '123456', createdAt: '2026-01-01' }

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
})
