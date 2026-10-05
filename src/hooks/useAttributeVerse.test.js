import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAttributeVerse } from './useAttributeVerse'

const { fetchVerseMock } = vi.hoisted(() => ({ fetchVerseMock: vi.fn() }))
vi.mock('../services', () => ({ fetchVerse: fetchVerseMock }))

const ATTRIBUTE = { id: 'amoroso', references: ['Juan:3:16', '1 Juan:4:8'] }

beforeEach(() => {
  fetchVerseMock.mockReset()
})

describe('useAttributeVerse', () => {
  it('caches a loaded verse and exposes it as the current verse', async () => {
    fetchVerseMock.mockResolvedValue({ reference: 'Juan 3:16', text: 'texto real', version: 'RV1960' })
    const { result } = renderHook(() => useAttributeVerse())

    await act(async () => { await result.current.loadVerse(ATTRIBUTE, 'es', 'RV1960') })

    expect(result.current.error).toBe(false)
    expect(result.current.getCurrentVerse(ATTRIBUTE.id)).toEqual({
      reference: 'Juan 3:16', text: 'texto real', version: 'RV1960'
    })
  })

  // Regresión: si fetchVerse no devuelve nada, no hay que cachear un
  // "versículo" falso ni avanzar la navegación — solo marcar error.
  it('sets error and does not cache anything when the fetch fails', async () => {
    fetchVerseMock.mockResolvedValue(null)
    const { result } = renderHook(() => useAttributeVerse())

    await act(async () => { await result.current.loadVerse(ATTRIBUTE, 'es', 'RV1960') })

    expect(result.current.error).toBe(true)
    expect(result.current.getCurrentVerse(ATTRIBUTE.id)).toBeNull()
    expect(result.current.getNavInfo(ATTRIBUTE.id).total).toBe(0)
  })

  it('recovers from a previous error on the next successful load', async () => {
    fetchVerseMock.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useAttributeVerse())
    await act(async () => { await result.current.loadVerse(ATTRIBUTE, 'es', 'RV1960') })
    expect(result.current.error).toBe(true)

    fetchVerseMock.mockResolvedValueOnce({ reference: 'Juan 3:16', text: 'texto real', version: 'RV1960' })
    await act(async () => { await result.current.loadVerse(ATTRIBUTE, 'es', 'RV1960') })

    expect(result.current.error).toBe(false)
    expect(result.current.getCurrentVerse(ATTRIBUTE.id)?.text).toBe('texto real')
  })

  it('accumulates multiple loaded verses for prev/next navigation', async () => {
    fetchVerseMock
      .mockResolvedValueOnce({ reference: 'Juan 3:16', text: 'uno', version: 'RV1960' })
      .mockResolvedValueOnce({ reference: '1 Juan 4:8', text: 'dos', version: 'RV1960' })

    const { result } = renderHook(() => useAttributeVerse())
    await act(async () => { await result.current.loadVerse(ATTRIBUTE, 'es', 'RV1960') })
    await act(async () => { await result.current.loadVerse(ATTRIBUTE, 'es', 'RV1960') })

    expect(result.current.getNavInfo(ATTRIBUTE.id)).toMatchObject({ current: 2, total: 2, hasPrevious: true, hasNext: false })

    act(() => { result.current.goToPrevious(ATTRIBUTE.id) })
    expect(result.current.getCurrentVerse(ATTRIBUTE.id)?.text).toBe('uno')
  })
})
