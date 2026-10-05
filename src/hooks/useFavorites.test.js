import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'

const { authMock, fromMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  fromMock: vi.fn(),
}))

vi.mock('../services/supabase', () => ({
  supabase: { auth: authMock, from: fromMock },
}))

// Query builder "thenable": se puede encadenar (select/eq/order/insert/delete)
// y además esperarse (await) en cualquier punto de la cadena, como el cliente real de Supabase.
function makeBuilder(resolvedValue) {
  const builder = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(resolvedValue)),
    then: (resolve, reject) => Promise.resolve(resolvedValue).then(resolve, reject),
  }
  return builder
}

const EXISTING = { id: 1, reference: 'Juan:3:16', text: 'Porque de tal manera amó Dios al mundo', version: 'RV1960' }

async function setup(initialFavorites = [EXISTING]) {
  authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
  fromMock.mockReturnValueOnce(makeBuilder({ data: initialFavorites }))
  const { result } = renderHook(() => useFavorites())
  await waitFor(() => expect(result.current.favorites).toEqual(initialFavorites))
  return result
}

beforeEach(() => {
  authMock.getSession.mockReset()
  fromMock.mockReset()
})

describe('useFavorites', () => {
  it('loads the current favorites on mount', async () => {
    const result = await setup()
    expect(result.current.isFavorite('Juan:3:16', EXISTING.text)).toBe(true)
  })

  it('does not insert a duplicate when the verse is already a favorite', async () => {
    const result = await setup()
    fromMock.mockClear()

    await act(async () => {
      await result.current.addFavorite({ reference: 'Juan:3:16', text: EXISTING.text })
    })

    expect(fromMock).not.toHaveBeenCalled()
    expect(result.current.favorites).toHaveLength(1)
  })

  it('inserts and prepends a new favorite', async () => {
    const result = await setup()
    const newRow = { id: 2, reference: 'Romanos:8:28', text: 'Y sabemos que a los que aman a Dios...', version: 'RV1960' }
    fromMock.mockReturnValueOnce(makeBuilder({ data: newRow, error: null }))

    await act(async () => {
      await result.current.addFavorite({ reference: newRow.reference, text: newRow.text, version: newRow.version })
    })

    expect(result.current.favorites).toHaveLength(2)
    expect(result.current.favorites[0]).toEqual(newRow)
    expect(result.current.isFavorite(newRow.reference, newRow.text)).toBe(true)
  })

  it('does not add the new favorite locally if the insert fails', async () => {
    const result = await setup()
    fromMock.mockReturnValueOnce(makeBuilder({ data: null, error: { message: 'boom' } }))

    await act(async () => {
      await result.current.addFavorite({ reference: 'Salmos:23:1', text: 'El Señor es mi pastor' })
    })

    expect(result.current.favorites).toHaveLength(1)
  })

  it('removes a favorite locally after a successful delete', async () => {
    const result = await setup()
    fromMock.mockReturnValueOnce(makeBuilder({}))

    await act(async () => {
      await result.current.removeFavorite(EXISTING.reference, EXISTING.text)
    })

    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.isFavorite(EXISTING.reference, EXISTING.text)).toBe(false)
  })

  it('resets to an empty list when there is no logged-in user', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: null } })
    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.favorites).toEqual([]))
    expect(fromMock).not.toHaveBeenCalled()
  })
})
