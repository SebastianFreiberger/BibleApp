import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [activeDates, setActiveDates] = useState([])

  useEffect(() => {
    let userId = null

    const init = async (uid) => {
      if (!uid) { setStreak(0); setActiveDates([]); return }
      userId = uid
      const today = new Date().toISOString().split('T')[0]

      // Registrar hoy si no existe
      await supabase.from('streak_days').upsert({ user_id: uid, date: today }, { onConflict: 'user_id,date' })

      // Traer los últimos 120 días
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 120)
      const cutoffStr = cutoff.toISOString().split('T')[0]

      const { data } = await supabase
        .from('streak_days')
        .select('date')
        .eq('user_id', uid)
        .gte('date', cutoffStr)
        .order('date', { ascending: false })

      const dates = (data ?? []).map(r => r.date)
      setActiveDates(dates)

      // Calcular racha consecutiva desde hoy hacia atrás
      let count = 0
      const check = new Date(today)
      const dateSet = new Set(dates)
      while (dateSet.has(check.toISOString().split('T')[0])) {
        count++
        check.setDate(check.getDate() - 1)
      }
      setStreak(count)
    }

    supabase.auth.getSession().then(({ data: { session } }) => init(session?.user?.id ?? null))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      init(session?.user?.id ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { streak, activeDates }
}
