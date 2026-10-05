import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchVerse, fetchMultipleVerses, fetchChapter, searchVerses } from './bibleApi'

function mockFetchOnce(body, { ok = true, status = 200 } = {}) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchVerse', () => {
  it('returns the verse on a successful response', async () => {
    mockFetchOnce({ reference: 'Romanos 12:6', text: 'texto real', version: 'RV1960' })
    const verse = await fetchVerse('Romanos:12:6', 'es', 'RV1960')
    expect(verse).toEqual({ reference: 'Romanos 12:6', text: 'texto real', version: 'RV1960' })
  })

  // Regresión del bug real: un versículo que no cargó nunca debe devolver un
  // objeto con texto falso que se pueda guardar como favorito o compartir.
  it('returns null (not a fake verse) when the endpoint reports an error', async () => {
    mockFetchOnce({ error: 'Verse unavailable' }, { status: 502 })
    const verse = await fetchVerse('Romanos:12:6', 'es', 'RV1960')
    expect(verse).toBeNull()
  })

  it('returns null when the HTTP response itself is not ok', async () => {
    mockFetchOnce({}, { ok: false, status: 500 })
    const verse = await fetchVerse('Romanos:12:6', 'es', 'RV1960')
    expect(verse).toBeNull()
  })

  it('returns null when fetch throws (network down)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const verse = await fetchVerse('Romanos:12:6', 'es', 'RV1960')
    expect(verse).toBeNull()
  })
})

describe('fetchMultipleVerses', () => {
  it('drops failed lookups and keeps the successful ones', async () => {
    let call = 0
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => {
      call++
      if (call === 2) return Promise.resolve({ ok: true, json: async () => ({ error: 'nope' }) })
      return Promise.resolve({ ok: true, json: async () => ({ reference: `ref${call}`, text: 't', version: 'v' }) })
    }))

    const verses = await fetchMultipleVerses(['a:1:1', 'b:1:1', 'c:1:1'], 'es', 'RV1960')
    expect(verses).toHaveLength(2)
    expect(verses.every(v => v && typeof v.text === 'string')).toBe(true)
  })
})

describe('fetchChapter', () => {
  it('parses verses and strips HTML tags for Spanish', async () => {
    mockFetchOnce([
      { verse: 1, text: 'En el principio <i>creó</i> Dios...' },
      { verse: 2, text: 'Y la tierra estaba desordenada' },
    ])
    const verses = await fetchChapter('salmos', 1, 'es', 'RV1960')
    expect(verses).toEqual([
      { verse: 1, text: 'En el principio creó Dios...' },
      { verse: 2, text: 'Y la tierra estaba desordenada' },
    ])
  })

  it('returns an empty array for an unknown book', async () => {
    const verses = await fetchChapter('libro-inexistente', 1, 'es', 'RV1960')
    expect(verses).toEqual([])
  })

  it('returns an empty array when the upstream API fails', async () => {
    mockFetchOnce({}, { ok: false, status: 500 })
    const verses = await fetchChapter('salmos', 1, 'es', 'RV1960')
    expect(verses).toEqual([])
  })

  it('returns an empty array on malformed English response', async () => {
    mockFetchOnce({ notVerses: true })
    const verses = await fetchChapter('salmos', 1, 'en', 'web')
    expect(verses).toEqual([])
  })
})

describe('searchVerses', () => {
  it('filters results to whole-word matches and strips HTML', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([
        { pk: 1, book: 19, chapter: 23, verse: 1, text: 'El <b>amor</b> de Dios' },
        { pk: 2, book: 19, chapter: 1, verse: 1, text: 'amoroso y bueno' }, // "amor" within another word — no debe matchear por \b
      ]),
    }))

    const results = await searchVerses('amor', 'es', 'RV1960')
    expect(results).toHaveLength(1)
    expect(results[0]).toEqual({ bookId: 19, chapter: 23, verse: 1, text: 'El amor de Dios' })
  })

  it('returns an empty array when the search API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const results = await searchVerses('amor', 'es', 'RV1960')
    expect(results).toEqual([])
  })
})
