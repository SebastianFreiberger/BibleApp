import { BOOK_DATA } from '../data'

function parseReference(reference) {
  const parts = reference.split(':')
  const book = parts[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const chapter = parseInt(parts[1])
  const versePart = parts[2]

  let verse, endVerse
  if (versePart.includes('-')) {
    const [start, end] = versePart.split('-')
    verse = parseInt(start)
    endVerse = parseInt(end)
  } else {
    verse = parseInt(versePart)
    endVerse = verse
  }

  return { book, chapter, verse, endVerse }
}

function formatDisplayReference(reference, lang) {
  const parts = reference.split(':')
  const bookKey = parts[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const bookData = BOOK_DATA[bookKey]

  if (lang === 'en' && bookData) {
    return bookData.en + ' ' + parts[1] + ':' + parts[2]
  }
  return parts[0] + ' ' + parts[1] + ':' + parts[2]
}

// bolls.life — soporta RV1960, RV1909, NVI, LBLA, DHH, RVR1995, etc.
async function fetchVerseSpanish(reference, version = 'RV1960') {
  try {
    const parsed = parseReference(reference)
    const bookData = BOOK_DATA[parsed.book]

    if (!bookData) throw new Error('Libro no encontrado: ' + parsed.book)

    const url = `https://bolls.life/get-text/${version}/${bookData.id}/${parsed.chapter}/`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error API: ' + response.status)

    const data = await response.json()

    if (data && Array.isArray(data)) {
      const versesToGet = []
      for (let v = parsed.verse; v <= parsed.endVerse; v++) {
        const found = data.find(item => item.verse === v)
        if (found) versesToGet.push(found.text.replace(/<[^>]*>/g, ''))
      }
      if (versesToGet.length > 0) {
        return {
          reference: formatDisplayReference(reference, 'es'),
          text: versesToGet.join(' ').trim(),
          version
        }
      }
    }

    throw new Error('No data')
  } catch (error) {
    console.error('Error fetching Spanish verse:', error)
    return {
      reference: formatDisplayReference(reference, 'es'),
      text: 'No se pudo cargar el versículo. Verifica tu conexión a internet.',
      version
    }
  }
}

// bible-api.com — soporta web, kjv, bbe
async function fetchVerseEnglish(reference, version = 'web') {
  try {
    const parsed = parseReference(reference)
    const bookData = BOOK_DATA[parsed.book]

    if (!bookData) throw new Error('Book not found: ' + parsed.book)

    const verseRange = parsed.verse === parsed.endVerse
      ? parsed.verse
      : parsed.verse + '-' + parsed.endVerse

    const url = `https://bible-api.com/${bookData.en.toLowerCase().replace(/ /g, '+')}+${parsed.chapter}:${verseRange}?translation=${version}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error API')

    const data = await response.json()
    return {
      reference: formatDisplayReference(reference, 'en'),
      text: data.text ? data.text.trim() : 'Verse not available',
      version
    }
  } catch (error) {
    console.error('Error fetching English verse:', error)
    return {
      reference: formatDisplayReference(reference, 'en'),
      text: 'Could not load verse. Check your internet connection.',
      version
    }
  }
}

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

export async function fetchVerse(reference, lang, version) {
  if (lang === 'es') return fetchVerseSpanish(reference, version)
  return fetchVerseEnglish(reference, version)
}

export async function fetchMultipleVerses(references, lang, version) {
  const promises = references.map(ref => fetchVerse(ref, lang, version))
  return Promise.all(promises)
}
