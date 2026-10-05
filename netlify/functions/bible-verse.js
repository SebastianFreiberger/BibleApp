import { getStore } from '@netlify/blobs'
import { BOOK_DATA } from '../../src/data/bibleData.js'
import { parseReference, formatDisplayReference } from '../../src/services/bibleReference.js'

// Reintenta una vez ante un hipo transitorio de la API de terceros antes de rendirse.
async function fetchWithRetry(url, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
    } catch {
      // red caída / CORS / timeout — se reintenta abajo
    }
    if (attempt < retries) await new Promise(r => setTimeout(r, 400))
  }
  return null
}

async function fetchSpanish(reference, version) {
  const parsed = parseReference(reference)
  const bookData = BOOK_DATA[parsed.book]
  if (!bookData) return null

  const url = `https://bolls.life/get-text/${version}/${bookData.id}/${parsed.chapter}/`
  const res = await fetchWithRetry(url)
  if (!res) return null

  const data = await res.json()
  if (!Array.isArray(data)) return null

  const versesToGet = []
  for (let v = parsed.verse; v <= parsed.endVerse; v++) {
    const found = data.find(item => item.verse === v)
    if (found) versesToGet.push(found.text.replace(/<[^>]*>/g, ''))
  }
  if (versesToGet.length === 0) return null

  return {
    reference: formatDisplayReference(reference, 'es'),
    text: versesToGet.join(' ').trim(),
    version
  }
}

async function fetchEnglish(reference, version) {
  const parsed = parseReference(reference)
  const bookData = BOOK_DATA[parsed.book]
  if (!bookData) return null

  const verseRange = parsed.verse === parsed.endVerse ? parsed.verse : `${parsed.verse}-${parsed.endVerse}`
  const url = `https://bible-api.com/${bookData.en.toLowerCase().replace(/ /g, '+')}+${parsed.chapter}:${verseRange}?translation=${version}`
  const res = await fetchWithRetry(url)
  if (!res) return null

  const data = await res.json()
  if (!data.text) return null

  return {
    reference: formatDisplayReference(reference, 'en'),
    text: data.text.trim(),
    version
  }
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const url = new URL(req.url)
  const reference = url.searchParams.get('reference')
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'es'
  const version = url.searchParams.get('version') || (lang === 'es' ? 'RV1960' : 'web')

  if (!reference) {
    return new Response(JSON.stringify({ error: 'Missing reference' }), { status: 400 })
  }

  const cacheKey = `${lang}:${version}:${reference}`

  // getStore() lanza sincrónicamente si no hay contexto de Netlify Blobs disponible
  // (ej. entorno local sin sitio vinculado). Si eso pasa, seguimos sin caché en vez
  // de romper el endpoint.
  let store = null
  try { store = getStore('bible-verses') } catch { /* sin caché disponible */ }

  if (store) {
    const cached = await store.get(cacheKey, { type: 'json' }).catch(() => null)
    if (cached) return Response.json(cached)
  }

  const verse = lang === 'es' ? await fetchSpanish(reference, version) : await fetchEnglish(reference, version)

  if (!verse) {
    return new Response(JSON.stringify({ error: 'Verse unavailable' }), { status: 502 })
  }

  // Cache indefinida: el texto de un versículo para una referencia/versión dada no cambia.
  if (store) await store.setJSON(cacheKey, verse).catch(() => {})

  return Response.json(verse)
}

export const config = {
  path: '/api/bible-verse'
}
