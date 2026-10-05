import { useState, useEffect, useCallback } from 'react'
import { fetchVerse } from '../services'
import { ALL_REFERENCES } from '../data'

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

export function useDailyVerse(lang, bibleVersion) {
  const [dailyVerse, setDailyVerse] = useState(null)
  const [randomVerse, setRandomVerse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingRandom, setLoadingRandom] = useState(false)
  const [showRandom, setShowRandom] = useState(false)
  const [error, setError] = useState(false)

  const loadDailyVerse = useCallback(async () => {
    setLoading(true)
    setError(false)
    const seed = getDailySeed()
    const index = seed % ALL_REFERENCES.length
    const reference = ALL_REFERENCES[index]
    const verse = await fetchVerse(reference, lang, bibleVersion)
    setDailyVerse(verse)
    if (!verse) setError(true)
    setLoading(false)
  }, [lang, bibleVersion])

  useEffect(() => {
    function run() {
      setRandomVerse(null)
      setShowRandom(false)
      loadDailyVerse()
    }
    run()
  }, [loadDailyVerse])

  const generateRandomVerse = async () => {
    setLoadingRandom(true)
    setError(false)
    const seed = getDailySeed()
    const dailyIndex = seed % ALL_REFERENCES.length
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * ALL_REFERENCES.length)
    } while (randomIndex === dailyIndex)
    const reference = ALL_REFERENCES[randomIndex]

    const verse = await fetchVerse(reference, lang, bibleVersion)
    setRandomVerse(verse)
    if (!verse) setError(true)
    setShowRandom(true)
    setLoadingRandom(false)
  }

  const backToDaily = () => {
    setShowRandom(false)
    setRandomVerse(null)
    setError(!dailyVerse)
  }

  const retry = () => {
    if (showRandom) generateRandomVerse()
    else loadDailyVerse()
  }

  const currentVerse = showRandom ? randomVerse : dailyVerse

  return {
    dailyVerse,
    randomVerse,
    currentVerse,
    loading,
    loadingRandom,
    showRandom,
    error,
    retry,
    generateRandomVerse,
    backToDaily
  }
}
