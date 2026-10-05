import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { AuthProvider } from './AuthContext'
import { useAuth } from './hooks'

const { authMock, fromMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    signOut: vi.fn().mockResolvedValue({}),
  },
  fromMock: vi.fn(),
}))

vi.mock('../services/supabase', () => ({
  supabase: { auth: authMock, from: fromMock },
}))

// Query builder "thenable": encadenable (select/eq/update) y awaiteable en
// cualquier punto de la cadena, como el cliente real de Supabase.
function makeBuilder(resolvedValue) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    update: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(resolvedValue)),
    then: (resolve, reject) => Promise.resolve(resolvedValue).then(resolve, reject),
  }
  return builder
}

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

beforeEach(() => {
  authMock.getSession.mockReset()
  authMock.signOut.mockReset().mockResolvedValue({})
  fromMock.mockReset()
})

describe('AuthContext — reactivation on login', () => {
  it('builds a normal user when the profile is not deleted', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1', email: 'a@b.com' } } } })
    fromMock.mockReturnValueOnce(makeBuilder({ data: { name: 'Juan', deleted_at: null } }))

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.isAuthenticated).toBe(true)
    expect(fromMock).toHaveBeenCalledTimes(1) // solo el select, sin reactivación
  })

  // El caso que pidió el usuario: si la cuenta estaba dada de baja y el
  // usuario vuelve a loguearse, se reactiva sola (sin pantallas extra).
  it('clears deleted_at and logs the user in normally when the account was soft-deleted', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1', email: 'a@b.com' } } } })
    const selectBuilder = makeBuilder({ data: { name: 'Juan', deleted_at: '2026-01-01T00:00:00.000Z' } })
    const updateBuilder = makeBuilder({ error: null })
    fromMock
      .mockReturnValueOnce(selectBuilder)
      .mockReturnValueOnce(updateBuilder)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(updateBuilder.update).toHaveBeenCalledWith({ deleted_at: null })
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user.name).toBe('Juan')
  })
})

describe('AuthContext — deleteAccount', () => {
  async function loggedIn() {
    authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1', email: 'a@b.com' } } } })
    fromMock.mockReturnValueOnce(makeBuilder({ data: { name: 'Juan', deleted_at: null } }))
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))
    return result
  }

  it('soft-deletes (sets deleted_at) and signs the user out', async () => {
    const result = await loggedIn()
    const updateBuilder = makeBuilder({ error: null })
    fromMock.mockReturnValueOnce(updateBuilder)

    let response
    await act(async () => { response = await result.current.deleteAccount() })

    expect(response).toEqual({ success: true })
    expect(updateBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String) })
    )
    expect(authMock.signOut).toHaveBeenCalledOnce()
  })

  it('does not sign out if the soft-delete update fails', async () => {
    const result = await loggedIn()
    fromMock.mockReturnValueOnce(makeBuilder({ error: { message: 'db down' } }))

    let response
    await act(async () => { response = await result.current.deleteAccount() })

    expect(response.success).toBe(false)
    expect(authMock.signOut).not.toHaveBeenCalled()
  })
})
