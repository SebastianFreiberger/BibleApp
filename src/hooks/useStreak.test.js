import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useStreak } from './useStreak'

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

function dateStr(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

function mockStreakTable(dates) {
  const table = {
    upsert: vi.fn().mockResolvedValue({}),
    select: vi.fn(function select() { return this }),
    eq: vi.fn(function eq() { return this }),
    gte: vi.fn(function gte() { return this }),
    order: vi.fn().mockResolvedValue({ data: dates.map(date => ({ date })) }),
  }
  fromMock.mockReturnValue(table)
  return table
}

beforeEach(() => {
  authMock.getSession.mockReset()
  fromMock.mockReset()
})

describe('useStreak', () => {
  it('reports 0 streak and no dates when there is no session', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: null } })
    const { result } = renderHook(() => useStreak())
    await waitFor(() => expect(result.current.streak).toBe(0))
    expect(result.current.activeDates).toEqual([])
  })

  it('counts a consecutive streak ending today', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    mockStreakTable([dateStr(0), dateStr(-1), dateStr(-2)])
    const { result } = renderHook(() => useStreak())
    await waitFor(() => expect(result.current.streak).toBe(3))
  })

  it('stops counting at the first gap in the dates', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    // Falta el día -2: la racha debe cortarse en 2, no seguir hasta -1... -3
    mockStreakTable([dateStr(0), dateStr(-1), dateStr(-3), dateStr(-4)])
    const { result } = renderHook(() => useStreak())
    await waitFor(() => expect(result.current.streak).toBe(2))
  })

  it('reports streak 0 when today is not among the active dates', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    mockStreakTable([dateStr(-1), dateStr(-2)])
    const { result } = renderHook(() => useStreak())
    await waitFor(() => expect(result.current.activeDates).toHaveLength(2))
    expect(result.current.streak).toBe(0)
  })

  it('exposes activeDates exactly as returned, regardless of streak continuity', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    const dates = [dateStr(0), dateStr(-5), dateStr(-30)]
    mockStreakTable(dates)
    const { result } = renderHook(() => useStreak())
    await waitFor(() => expect(result.current.activeDates).toHaveLength(3))
    expect(result.current.activeDates).toEqual(expect.arrayContaining(dates))
  })
})
