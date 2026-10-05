import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

const { getStoreMock } = vi.hoisted(() => ({ getStoreMock: vi.fn() }))
vi.mock('@netlify/blobs', () => ({ getStore: getStoreMock }))

const { default: handler } = await import('../bible-verse.js')

function req(params) {
  return new Request(`http://localhost/api/bible-verse?${new URLSearchParams(params)}`)
}

function makeStore() {
  const data = new Map()
  return {
    get: vi.fn(async (key) => data.get(key) ?? null),
    setJSON: vi.fn(async (key, value) => { data.set(key, value) }),
    _data: data,
  }
}

beforeEach(() => {
  getStoreMock.mockReset()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('bible-verse function', () => {
  it('rejects non-GET requests', async () => {
    const res = await handler(new Request('http://localhost/api/bible-verse', { method: 'POST' }))
    expect(res.status).toBe(405)
  })

  it('requires a reference param', async () => {
    getStoreMock.mockReturnValue(makeStore())
    const res = await handler(req({ lang: 'es', version: 'RV1960' }))
    expect(res.status).toBe(400)
  })

  it('fetches, returns, and caches a Spanish verse on first lookup', async () => {
    const store = makeStore()
    getStoreMock.mockReturnValue(store)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{ verse: 6, text: 'texto del versiculo' }]),
    }))

    const res = await handler(req({ reference: 'Romanos:12:6', lang: 'es', version: 'RV1960' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ reference: 'Romanos 12:6', text: 'texto del versiculo', version: 'RV1960' })
    expect(store.setJSON).toHaveBeenCalledOnce()
  })

  it('serves a second lookup for the same reference from the cache, without calling fetch again', async () => {
    const store = makeStore()
    getStoreMock.mockReturnValue(store)
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{ verse: 6, text: 'texto del versiculo' }]),
    })
    vi.stubGlobal('fetch', fetchMock)

    await handler(req({ reference: 'Romanos:12:6', lang: 'es', version: 'RV1960' }))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const res2 = await handler(req({ reference: 'Romanos:12:6', lang: 'es', version: 'RV1960' }))
    const body2 = await res2.json()

    expect(fetchMock).toHaveBeenCalledTimes(1) // no segunda llamada a la red
    expect(body2.text).toBe('texto del versiculo')
  })

  it('retries once on a transient upstream failure before succeeding', async () => {
    getStoreMock.mockReturnValue(makeStore())
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new TypeError('network blip'))
      .mockResolvedValueOnce({ ok: true, json: async () => ([{ verse: 6, text: 'ok tras reintento' }]) })
    vi.stubGlobal('fetch', fetchMock)

    const res = await handler(req({ reference: 'Romanos:12:6', lang: 'es', version: 'RV1960' }))
    const body = await res.json()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(res.status).toBe(200)
    expect(body.text).toBe('ok tras reintento')
  })

  it('returns a clean error (never fake verse content) when the upstream never recovers', async () => {
    getStoreMock.mockReturnValue(makeStore())
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const res = await handler(req({ reference: 'Romanos:12:6', lang: 'es', version: 'RV1960' }))
    const body = await res.json()

    expect(res.status).toBe(502)
    expect(body.error).toBeTruthy()
    expect(body.text).toBeUndefined()
  })

  it('returns a clean error for an unknown book instead of throwing', async () => {
    getStoreMock.mockReturnValue(makeStore())
    const res = await handler(req({ reference: 'LibroFalso:1:1', lang: 'es', version: 'RV1960' }))
    expect(res.status).toBe(502)
  })

  it('does not crash when Netlify Blobs is unavailable (falls back to uncached)', async () => {
    getStoreMock.mockImplementation(() => { throw new Error('MissingBlobsEnvironmentError') })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{ verse: 6, text: 'texto sin cache' }]),
    }))

    const res = await handler(req({ reference: 'Romanos:12:6', lang: 'es', version: 'RV1960' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.text).toBe('texto sin cache')
  })

  it('fetches an English verse from bible-api.com', async () => {
    getStoreMock.mockReturnValue(makeStore())
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'For God so loved the world...' }),
    }))

    const res = await handler(req({ reference: 'Juan:3:16', lang: 'en', version: 'web' }))
    const body = await res.json()

    expect(body).toEqual({ reference: 'John 3:16', text: 'For God so loved the world...', version: 'web' })
  })
})
