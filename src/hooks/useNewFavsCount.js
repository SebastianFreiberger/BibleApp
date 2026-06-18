import { useState, useEffect, useMemo } from 'react'

export function useNewFavsCount(favorites, userId) {
  const [seenAt, setSeenAt] = useState(null)

  useEffect(() => {
    if (!userId) return
    const key = `ymt_favs_seen_${userId}`
    const stored = localStorage.getItem(key)
    if (stored) {
      setSeenAt(stored)
    } else {
      const now = new Date().toISOString()
      localStorage.setItem(key, now)
      setSeenAt(now)
    }
  }, [userId])

  const newFavsCount = useMemo(() => {
    if (!seenAt) return 0
    return favorites.filter(f => new Date(f.created_at) > new Date(seenAt)).length
  }, [favorites, seenAt])

  const markFavsSeen = () => {
    if (!userId) return
    const now = new Date().toISOString()
    localStorage.setItem(`ymt_favs_seen_${userId}`, now)
    setSeenAt(now)
  }

  return { newFavsCount, markFavsSeen }
}
