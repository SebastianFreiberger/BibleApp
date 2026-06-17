import { useState, useMemo, useEffect } from 'react'
import Fuse from 'fuse.js'
import { fetchMultipleVerses } from '../services'
import { classifyMood } from '../services/groq'
import { MOOD_REFERENCES } from '../data'

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

function getRandomReferences(references, count = 4) {
  return shuffleArray(references).slice(0, count)
}

function getRefsFromCategories(categories, count = 4) {
  const pool = []
  const perCategory = Math.ceil(count / categories.length)
  for (const key of categories) {
    const mood = MOOD_REFERENCES[key]
    if (!mood) continue
    const refs = getRandomReferences(mood.references, perCategory)
    pool.push(...refs)
  }
  // Deduplicate and trim to count
  return [...new Set(pool)].slice(0, count)
}

function buildTitleFromCategories(categories, lang) {
  return categories
    .map(k => MOOD_REFERENCES[k]?.title?.[lang] || MOOD_REFERENCES[k]?.title?.es || k)
    .join(' · ')
}

function createSearchIndex(lang) {
  const items = []
  for (const [key, mood] of Object.entries(MOOD_REFERENCES)) {
    const keywords = mood.keywords[lang] || mood.keywords.es
    const title = mood.title[lang] || mood.title.es
    items.push({ text: title.toLowerCase(), moodKey: key, isTitle: true })
    for (const kw of keywords) {
      items.push({ text: kw, moodKey: key, isTitle: false })
    }
  }
  return items
}

const FUSE_OPTIONS = {
  keys: ['text'],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true
}

// Palabras vacías que no aportan significado emocional
const STOP_WORDS = new Set([
  'estoy','siento','siento','poco','pero','porque','aunque','vez','hoy','que',
  'una','uno','los','las','del','con','sin','por','para','como','muy','mas',
  'bien','mal','algo','nada','todo','hay','hace','este','esta','ese','esa',
  'the','and','but','because','feel','feeling','little','some','not','yet',
  'am','is','are','was','were','have','has','been','today','when','also'
])

function fuseSearch(query, lang, fuseInstance) {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return null

  let results = fuseInstance.search(normalized)

  if (results.length === 0 || results[0].score > 0.3) {
    // Solo buscar palabras con 5+ chars, sin puntuación, y que no sean stop words
    const words = normalized
      .replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑA-Za-z\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 5 && !STOP_WORDS.has(w))

    let best = null
    for (const word of words) {
      const r = fuseInstance.search(word)
      if (r.length > 0 && r[0].score < 0.35 && (!best || r[0].score < best.score)) {
        best = r[0]
      }
    }
    if (best) results = [best]
  }

  if (!results.length) return null
  const { item, score } = results[0]
  return { key: item.moodKey, score, matchedWord: item.text }
}

export function useMoodSearch(lang, bibleVersion) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [loadingMood, setLoadingMood] = useState(false)
  const [expandedVerse, setExpandedVerse] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const fuseInstance = useMemo(() => {
    return new Fuse(createSearchIndex(lang), FUSE_OPTIONS)
  }, [lang])

  useEffect(() => {
    setSearchResult(null)
    setSearchQuery('')
    setHasSearched(false)
  }, [lang, bibleVersion])

  const handleSearch = async (e) => {
    e?.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    setHasSearched(true)
    setLoadingMood(true)

    const wordCount = query.split(/\s+/).length
    const fuseMatch = fuseSearch(query, lang, fuseInstance)
    const useGemini = wordCount > 4 || !fuseMatch || fuseMatch.score > 0.25

    let categories = []
    let usedGemini = false

    if (useGemini) {
      const geminiCategories = await classifyMood(query, lang)
      if (geminiCategories?.length) {
        categories = geminiCategories
        usedGemini = true
      }
    }

    // Fallback a Fuse si Gemini falló o no aplica
    if (!categories.length && fuseMatch) {
      categories = [fuseMatch.key]
    }

    if (!categories.length) {
      setSearchResult(null)
      setLoadingMood(false)
      return
    }

    const refs = getRefsFromCategories(categories, 4)
    const verses = await fetchMultipleVerses(refs, lang, bibleVersion)

    setSearchResult({
      key: categories[0],
      iconKey: categories[0],
      title: buildTitleFromCategories(categories, lang),
      searchTerm: query,
      matchedWord: usedGemini ? null : fuseMatch?.matchedWord,
      verses,
      categories,
    })
    setExpandedVerse(null)
    setLoadingMood(false)
  }

  const selectMoodCategory = async (key) => {
    const mood = MOOD_REFERENCES[key]
    if (!mood) return
    setLoadingMood(true)
    const title = mood.title[lang] || mood.title.es
    setSearchQuery(title)
    const refs = getRandomReferences(mood.references, 4)
    const verses = await fetchMultipleVerses(refs, lang, bibleVersion)
    setSearchResult({
      key,
      iconKey: key,
      title,
      searchTerm: title,
      verses,
      categories: [key],
    })
    setExpandedVerse(null)
    setLoadingMood(false)
  }

  const toggleExpandedVerse = (index) => {
    setExpandedVerse(expandedVerse === index ? null : index)
  }

  return {
    searchQuery,
    setSearchQuery,
    searchResult,
    loadingMood,
    expandedVerse,
    hasSearched,
    handleSearch,
    selectMoodCategory,
    toggleExpandedVerse
  }
}
