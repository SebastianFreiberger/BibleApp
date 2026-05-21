import { useState, useCallback } from 'react'

const STORAGE_KEY = 'bible_app_favorites'

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites)

  const addFavorite = useCallback((verse) => {
    setFavorites(prev => {
      if (prev.some(f => f.reference === verse.reference && f.text === verse.text)) return prev
      const updated = [{ ...verse, savedAt: new Date().toISOString() }, ...prev]
      saveFavorites(updated)
      return updated
    })
  }, [])

  const removeFavorite = useCallback((reference, text) => {
    setFavorites(prev => {
      const updated = prev.filter(f => !(f.reference === reference && f.text === text))
      saveFavorites(updated)
      return updated
    })
  }, [])

  const isFavorite = useCallback((reference, text) => {
    return favorites.some(f => f.reference === reference && f.text === text)
  }, [favorites])

  return { favorites, addFavorite, removeFavorite, isFavorite }
}
