import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { DeleteAccountSection } from './ProfilePage'

function renderSection(deleteAccount) {
  return render(
    <MemoryRouter>
      <DeleteAccountSection lang="es" deleteAccount={deleteAccount} />
    </MemoryRouter>
  )
}

describe('DeleteAccountSection', () => {
  it('requires a confirmation step before calling deleteAccount', async () => {
    const user = userEvent.setup()
    const deleteAccount = vi.fn()
    renderSection(deleteAccount)

    await user.click(screen.getByRole('button', { name: /eliminar mi cuenta/i }))
    expect(deleteAccount).not.toHaveBeenCalled()
    expect(screen.getByText(/estás seguro/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /sí, eliminar mi cuenta/i }))
    expect(deleteAccount).toHaveBeenCalledOnce()
  })

  it('cancel backs out without calling deleteAccount', async () => {
    const user = userEvent.setup()
    const deleteAccount = vi.fn()
    renderSection(deleteAccount)

    await user.click(screen.getByRole('button', { name: /eliminar mi cuenta/i }))
    await user.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(deleteAccount).not.toHaveBeenCalled()
    expect(screen.queryByText(/estás seguro/i)).not.toBeInTheDocument()
  })

  it('shows an error and stays put when deleteAccount fails', async () => {
    const user = userEvent.setup()
    const deleteAccount = vi.fn().mockResolvedValue({ success: false, error: 'db down' })
    renderSection(deleteAccount)

    await user.click(screen.getByRole('button', { name: /eliminar mi cuenta/i }))
    await user.click(screen.getByRole('button', { name: /sí, eliminar mi cuenta/i }))

    expect(await screen.findByText(/no pudimos eliminar la cuenta/i)).toBeInTheDocument()
  })
})
