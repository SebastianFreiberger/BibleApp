import { useState, useEffect } from 'react'
import { fetchVerse } from '../services'
import { ALL_REFERENCES } from '../data'

// Funcion para generar un numero basado en la fecha del dia
function getDailySeed() {
  const today = new Date()
  const dateString = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function useDailyVerse(lang) {
  const [dailyVerse, setDailyVerse] = useState(null)
  const [randomVerse, setRandomVerse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingRandom, setLoadingRandom] = useState(false)
  const [showRandom, setShowRandom] = useState(false)

  // Cargar versículo del día cuando cambia el idioma
  useEffect(() => {
    async function loadDailyVerse() {
      setLoading(true)
      const seed = getDailySeed()
      const index = seed % ALL_REFERENCES.length
      const reference = ALL_REFERENCES[index]
      const verse = await fetchVerse(reference, lang)
      setDailyVerse(verse)
      setLoading(false)
    }
    loadDailyVerse()
    // Limpiar estados al cambiar idioma
    setRandomVerse(null)
    setShowRandom(false)
  }, [lang])

  const generateRandomVerse = async () => {
    setLoadingRandom(true)
    let reference
    do {
      const randomIndex = Math.floor(Math.random() * ALL_REFERENCES.length)
      reference = ALL_REFERENCES[randomIndex]
    } while (dailyVerse && reference === dailyVerse.reference)
    
    const verse = await fetchVerse(reference, lang)
    setRandomVerse(verse)
    setShowRandom(true)
    setLoadingRandom(false)
  }

  const backToDaily = () => {
    setShowRandom(false)
    setRandomVerse(null)
  }

  const currentVerse = showRandom ? randomVerse : dailyVerse

  return {
    dailyVerse,
    randomVerse,
    currentVerse,
    loading,
    loadingRandom,
    showRandom,
    generateRandomVerse,
    backToDaily
  }
}
