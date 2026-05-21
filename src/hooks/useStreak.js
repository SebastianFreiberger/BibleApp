import { useState, useEffect } from 'react'

const STREAK_KEY = 'bible_app_streak'

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [activeDates, setActiveDates] = useState([])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    let data = { lastDate: null, count: 0, activeDates: [] }

    try {
      const raw = localStorage.getItem(STREAK_KEY)
      if (raw) data = { activeDates: [], ...JSON.parse(raw) }
    } catch { /* ignore */ }

    let newCount

    if (!data.lastDate) {
      newCount = 1
    } else if (data.lastDate === today) {
      setStreak(data.count)
      setActiveDates(data.activeDates)
      return
    } else {
      const diffMs = new Date(today) - new Date(data.lastDate)
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
      newCount = diffDays === 1 ? data.count + 1 : 1
    }

    // Agregar hoy y mantener solo los últimos 120 días
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 120)
    const cutoffStr = cutoff.toISOString().split('T')[0]
    const newDates = [...new Set([...data.activeDates, today])].filter(d => d >= cutoffStr)

    const updated = { lastDate: today, count: newCount, activeDates: newDates }
    localStorage.setItem(STREAK_KEY, JSON.stringify(updated))
    setStreak(newCount)
    setActiveDates(newDates)
  }, [])

  return { streak, activeDates }
}
