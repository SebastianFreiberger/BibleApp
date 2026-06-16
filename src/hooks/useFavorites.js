import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) { setFavorites([]); return }
    supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setFavorites(data ?? []))
  }, [userId])

  const addFavorite = useCallback(async (verse) => {
    if (!userId) return
    const already = favorites.some(f => f.reference === verse.reference && f.text === verse.text)
    if (already) return
    const row = { user_id: userId, reference: verse.reference, text: verse.text, version: verse.version ?? null }
    const { data, error } = await supabase.from('favorites').insert(row).select().single()
    if (!error && data) setFavorites(prev => [data, ...prev])
  }, [userId, favorites])

  const removeFavorite = useCallback(async (reference, text) => {
    if (!userId) return
    await supabase.from('favorites').delete().eq('user_id', userId).eq('reference', reference).eq('text', text)
    setFavorites(prev => prev.filter(f => !(f.reference === reference && f.text === text)))
  }, [userId])

  const isFavorite = useCallback((reference, text) => {
    return favorites.some(f => f.reference === reference && f.text === text)
  }, [favorites])

  return { favorites, addFavorite, removeFavorite, isFavorite }
}
