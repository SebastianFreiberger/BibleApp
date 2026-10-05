import { BOOK_DATA } from '../data'

// Obtiene todos los versículos de un capítulo completo
export async function fetchChapter(bookKey, chapter, lang, version) {
  const bookData = BOOK_DATA[bookKey]
  if (!bookData) return []

  if (lang === 'es') {
    try {
      const url = `https://bolls.life/get-text/${version}/${bookData.id}/${chapter}/`
      const res = await fetch(url)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) throw new Error('No data')
      return data.map(item => ({
        verse: item.verse,
        text: item.text.replace(/<[^>]*>/g, '').trim()
      }))
    } catch {
      return []
    }
  } else {
    try {
      const bookName = bookData.en.toLowerCase().replace(/ /g, '+')
      const url = `https://bible-api.com/${bookName}+${chapter}?translation=${version}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (!data.verses) throw new Error('No verses')
      return data.verses.map(v => ({ verse: v.verse, text: v.text.trim() }))
    } catch {
      return []
    }
  }
}

const SEARCH_VERSION_MAP = { web: 'WEB', kjv: 'KJV', asv: 'ASV', bbe: 'BBE' }

function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function accentVariants(query) {
  const map = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' }
  const base = stripAccents(query.toLowerCase())
  const variants = new Set([base])
  for (let i = 0; i < base.length; i++) {
    if (map[base[i]]) {
      variants.add(base.slice(0, i) + map[base[i]] + base.slice(i + 1))
    }
  }
  return [...variants]
}

export async function searchVerses(query, lang, version) {
  const v = lang === 'es' ? version : (SEARCH_VERSION_MAP[version] || 'KJV')
  const normalizedQuery = stripAccents(query.trim().toLowerCase())

  const escaped = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i')

  try {
    const variants = accentVariants(query.trim())
    const responses = await Promise.all(
      variants.map(v2 =>
        fetch(`https://bolls.life/search/${v}/${encodeURIComponent(v2)}/`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => [])
      )
    )

    // Unir y deduplicar por pk
    const seen = new Set()
    const merged = responses.flat().filter(item => {
      if (!item?.pk || seen.has(item.pk)) return false
      seen.add(item.pk)
      return true
    })

    return merged
      .filter(item => {
        const plainText = item.text.replace(/<[^>]*>/g, '')
        return wordRegex.test(stripAccents(plainText))
      })
      .map(item => ({
        bookId: item.book,
        chapter: item.chapter,
        verse: item.verse,
        text: item.text.replace(/<[^>]*>/g, '').trim()
      }))
  } catch {
    return []
  }
}

// Pasa por netlify/functions/bible-verse.js, que cachea el resultado y reintenta
// ante fallos transitorios de bolls.life / bible-api.com. Devuelve null si no se
// pudo obtener el versículo — nunca un objeto con texto de error disfrazado de versículo.
export async function fetchVerse(reference, lang, version) {
  try {
    const params = new URLSearchParams({ reference, lang, version })
    const res = await fetch(`/api/bible-verse?${params}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.error ? null : data
  } catch {
    return null
  }
}

export async function fetchMultipleVerses(references, lang, version) {
  const results = await Promise.all(references.map(ref => fetchVerse(ref, lang, version)))
  return results.filter(Boolean)
}
