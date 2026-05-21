import { useState, useMemo, useEffect } from 'react'
import Fuse from 'fuse.js'
import { fetchMultipleVerses } from '../services'
import { MOOD_REFERENCES } from '../data'

// Funcion para mezclar un array aleatoriamente
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

// Funcion para obtener referencias aleatorias
function getRandomReferences(references, count = 4) {
  const shuffled = shuffleArray(references)
  return shuffled.slice(0, count)
}

// Crear índice de búsqueda para Fuse.js
function createSearchIndex(lang) {
  const searchItems = []
  
  for (const [key, mood] of Object.entries(MOOD_REFERENCES)) {
    const keywords = mood.keywords[lang] || mood.keywords.es
    const title = mood.title[lang] || mood.title.es
    
    searchItems.push({
      text: title.toLowerCase(),
      moodKey: key,
      isTitle: true
    })
    
    for (const keyword of keywords) {
      searchItems.push({
        text: keyword,
        moodKey: key,
        isTitle: false
      })
    }
  }
  
  return searchItems
}

// Opciones de Fuse.js para búsqueda difusa
const FUSE_OPTIONS = {
  keys: ['text'],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true
}

// Funcion para buscar versiculos por estado de animo con búsqueda difusa
function findMoodCategory(query, lang, fuseInstance) {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return null
  
  let results = fuseInstance.search(normalizedQuery)
  
  if (results.length === 0 || results[0].score > 0.3) {
    const words = normalizedQuery.split(/\s+/).filter(w => w.length >= 2)
    let bestResult = results.length > 0 ? results[0] : null
    
    for (const word of words) {
      const wordResults = fuseInstance.search(word)
      if (wordResults.length > 0) {
        if (!bestResult || wordResults[0].score < bestResult.score) {
          bestResult = wordResults[0]
        }
      }
    }
    
    if (bestResult) {
      results = [bestResult]
    }
  }
  
  if (results.length > 0) {
    const bestMatch = results[0]
    const moodKey = bestMatch.item.moodKey
    const mood = MOOD_REFERENCES[moodKey]
    
    return {
      key: moodKey,
      iconKey: moodKey,
      title: mood.title[lang] || mood.title.es,
      matchedWord: bestMatch.item.text,
      score: bestMatch.score,
      references: mood.references
    }
  }
  
  return null
}

export function useMoodSearch(lang, bibleVersion) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [loadingMood, setLoadingMood] = useState(false)
  const [expandedVerse, setExpandedVerse] = useState(null)

  // Crear índice de Fuse.js que se actualiza cuando cambia el idioma
  const fuseInstance = useMemo(() => {
    const searchData = createSearchIndex(lang)
    return new Fuse(searchData, FUSE_OPTIONS)
  }, [lang])

  useEffect(() => {
    setSearchResult(null)
    setSearchQuery('')
  }, [lang, bibleVersion])

  const handleSearch = async (e) => {
    e?.preventDefault()
    const mood = findMoodCategory(searchQuery, lang, fuseInstance)
    if (mood) {
      setLoadingMood(true)
      const randomRefs = getRandomReferences(mood.references, 4)
      const verses = await fetchMultipleVerses(randomRefs, lang, bibleVersion)
      setSearchResult({
        key: mood.key,
        iconKey: mood.key,
        title: mood.title,
        searchTerm: searchQuery,
        matchedWord: mood.matchedWord,
        verses: verses
      })
      setExpandedVerse(null)
      setLoadingMood(false)
    } else {
      setSearchResult(null)
    }
  }

  const selectMoodCategory = async (key) => {
    const mood = MOOD_REFERENCES[key]
    setLoadingMood(true)
    const title = mood.title[lang] || mood.title.es
    setSearchQuery(title)
    const randomRefs = getRandomReferences(mood.references, 4)
    const verses = await fetchMultipleVerses(randomRefs, lang, bibleVersion)
    setSearchResult({
      key: key,
      iconKey: key,
      title: title,
      searchTerm: title,
      verses: verses
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
    handleSearch,
    selectMoodCategory,
    toggleExpandedVerse
  }
}
