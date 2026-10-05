import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDailyVerse } from './useDailyVerse'

const { fetchVerseMock } = vi.hoisted(() => ({ fetchVerseMock: vi.fn() }))
vi.mock('../services', () => ({ fetchVerse: fetchVerseMock }))

beforeEach(() => {
  fetchVerseMock.mockReset()
})

describe('useDailyVerse', () => {
  it('loads the daily verse successfully', async () => {
    fetchVerseMock.mockResolvedValue({ reference: 'Romanos 12:6', text: 'texto real', version: 'RV1960' })
    const { result } = renderHook(() => useDailyVerse('es', 'RV1960'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(false)
    expect(result.current.currentVerse).toEqual({ reference: 'Romanos 12:6', text: 'texto real', version: 'RV1960' })
  })

  // Regresión directa del bug: si la API falla, no debe quedar un "versículo"
  // navegable/favoriteable — currentVerse tiene que ser null y error debe quedar en true.
  it('sets an explicit error state instead of a fake verse when the fetch fails', async () => {
    fetchVerseMock.mockResolvedValue(null)
    const { result } = renderHook(() => useDailyVerse('es', 'RV1960'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe(true)
    expect(result.current.currentVerse).toBeNull()
  })

  it('retry() re-fetches and can recover from an error', async () => {
    fetchVerseMock.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useDailyVerse('es', 'RV1960'))
    await waitFor(() => expect(result.current.error).toBe(true))

    fetchVerseMock.mockResolvedValueOnce({ reference: 'Salmos 23:1', text: 'El Señor es mi pastor', version: 'RV1960' })
    await act(async () => { result.current.retry() })

    await waitFor(() => expect(result.current.error).toBe(false))
    expect(result.current.currentVerse?.text).toBe('El Señor es mi pastor')
  })

  it('sets error when generateRandomVerse fails, without touching the daily verse', async () => {
    fetchVerseMock.mockResolvedValueOnce({ reference: 'Romanos 12:6', text: 'texto diario', version: 'RV1960' })
    const { result } = renderHook(() => useDailyVerse('es', 'RV1960'))
    await waitFor(() => expect(result.current.dailyVerse).not.toBeNull())

    fetchVerseMock.mockResolvedValueOnce(null)
    await act(async () => { await result.current.generateRandomVerse() })

    expect(result.current.error).toBe(true)
    expect(result.current.showRandom).toBe(true)
    expect(result.current.currentVerse).toBeNull()
    expect(result.current.dailyVerse?.text).toBe('texto diario') // el versículo del día cacheado no se pierde
  })

  it('backToDaily clears the error once the daily verse is showing again', async () => {
    fetchVerseMock.mockResolvedValueOnce({ reference: 'Romanos 12:6', text: 'texto diario', version: 'RV1960' })
    const { result } = renderHook(() => useDailyVerse('es', 'RV1960'))
    await waitFor(() => expect(result.current.dailyVerse).not.toBeNull())

    fetchVerseMock.mockResolvedValueOnce(null)
    await act(async () => { await result.current.generateRandomVerse() })
    expect(result.current.error).toBe(true)

    act(() => { result.current.backToDaily() })
    expect(result.current.error).toBe(false)
    expect(result.current.currentVerse?.text).toBe('texto diario')
  })
})
