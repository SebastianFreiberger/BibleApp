import { useState, useCallback, useRef } from 'react'
import { fetchVerse } from '../services'

export function useAttributeVerse() {
  const [verseCache, setVerseCache] = useState({})
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const cacheRef = useRef({})

  function getRandomUnusedIndex(references, usedIndices) {
    const available = references
      .map((_, i) => i)
      .filter(i => !usedIndices.has(i))

    if (available.length === 0) return Math.floor(Math.random() * references.length)
    return available[Math.floor(Math.random() * available.length)]
  }

  const updateCache = useCallback((attrId, data) => {
    cacheRef.current = { ...cacheRef.current, [attrId]: data }
    setVerseCache(prev => ({ ...prev, [attrId]: data }))
  }, [])

  const loadVerse = useCallback(async (attribute, lang) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)

    try {
      const attrId = attribute.id
      const references = attribute.references
      const current = cacheRef.current[attrId] || {
        verses: [],
        currentIndex: -1,
        usedRefIndices: new Set()
      }

      const refIndex = getRandomUnusedIndex(references, current.usedRefIndices)
      const reference = references[refIndex]
      const result = await fetchVerse(reference, lang)

      const newUsed = new Set(current.usedRefIndices)
      if (newUsed.size >= references.length) newUsed.clear()
      newUsed.add(refIndex)

      const newVerses = [...current.verses, result]
      updateCache(attrId, {
        verses: newVerses,
        currentIndex: newVerses.length - 1,
        usedRefIndices: newUsed
      })
    } catch (error) {
      console.error('Error loading attribute verse:', error)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [updateCache])

  const goToPrevious = useCallback((attributeId) => {
    const current = cacheRef.current[attributeId]
    if (!current || current.currentIndex <= 0) return
    updateCache(attributeId, { ...current, currentIndex: current.currentIndex - 1 })
  }, [updateCache])

  const goToNext = useCallback((attributeId) => {
    const current = cacheRef.current[attributeId]
    if (!current || current.currentIndex >= current.verses.length - 1) return
    updateCache(attributeId, { ...current, currentIndex: current.currentIndex + 1 })
  }, [updateCache])

  const getCurrentVerse = useCallback((attributeId) => {
    const data = verseCache[attributeId]
    if (!data || data.currentIndex < 0 || data.verses.length === 0) return null
    return data.verses[data.currentIndex]
  }, [verseCache])

  const getNavInfo = useCallback((attributeId) => {
    const data = verseCache[attributeId]
    if (!data) return { hasPrevious: false, hasNext: false, current: 0, total: 0 }
    return {
      hasPrevious: data.currentIndex > 0,
      hasNext: data.currentIndex < data.verses.length - 1,
      current: data.currentIndex + 1,
      total: data.verses.length
    }
  }, [verseCache])

  return { loading, loadVerse, goToPrevious, goToNext, getCurrentVerse, getNavInfo }
}
