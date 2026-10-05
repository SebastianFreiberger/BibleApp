import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { AuthContext } from './contexts'

// Mezcla el usuario de Supabase con los datos del perfil en un objeto uniforme
function buildUser(supabaseUser, profile) {
  if (!supabaseUser) return null
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: profile?.name || supabaseUser.user_metadata?.name || '',
    phone: profile?.phone || supabaseUser.user_metadata?.phone || null,
    createdAt: profile?.created_at || supabaseUser.created_at,
    lang: profile?.lang || null,
    bibleVersion: profile?.bible_version || null,
    theme: profile?.theme || null,
    avatarUrl: profile?.avatar_url || null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (supabaseUser) => {
    if (!supabaseUser) { setUser(null); return }
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    // Reactivación: si la cuenta estaba dada de baja (soft delete) y el
    // usuario vuelve a iniciar sesión, se reactiva automáticamente.
    if (profile?.deleted_at) {
      await supabase.from('profiles').update({ deleted_at: null }).eq('id', supabaseUser.id)
      profile.deleted_at = null
    }

    setUser(buildUser(supabaseUser, profile))
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null).finally(() => setLoading(false))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const register = async (name, email, phone, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone: phone || null } }
    })
    if (error) return { success: false, error: error.message }

    // Si hay sesión activa (sin confirmación de email), guardamos el perfil
    // explícitamente para asegurar que el nombre quede registrado
    if (data.session) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        phone: phone || null,
        lang: localStorage.getItem('lang') || 'es',
        bible_version: localStorage.getItem('bibleVersion') || 'RV1960',
        theme: localStorage.getItem('theme') || 'dark',
      })
    }

    return { success: true }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const updateAvatar = async (file) => {
    if (!user) return { success: false }
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type || 'image/jpeg' })
    if (upErr) return { success: false, error: upErr.message }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`
    const { error: dbErr } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)
    if (dbErr) return { success: false, error: dbErr.message }
    setUser(prev => ({ ...prev, avatarUrl }))
    return { success: true, avatarUrl }
  }

  const updateProfile = async ({ name, phone, password }) => {
    if (!user) return { success: false }

    if (password) {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) return { success: false, error: error.message }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ name, phone: phone ?? null })
      .eq('id', user.id)
    if (error) return { success: false, error: error.message }

    setUser(prev => ({ ...prev, name, phone: phone ?? null }))
    return { success: true }
  }

  // Baja "soft": marca la cuenta como eliminada y cierra la sesión. Si el
  // usuario vuelve a iniciar sesión más adelante, se reactiva sola (ver
  // fetchProfile) — los datos (favoritos, racha) nunca se borran.
  const deleteAccount = async () => {
    if (!user) return { success: false }
    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) return { success: false, error: error.message }
    await supabase.auth.signOut()
    return { success: true }
  }

  // Envía email de recuperación con link (plan gratuito Supabase)
  const sendPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  // Cambia la contraseña (requiere sesión activa tras clickear el link)
  const resetPassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updateAvatar,
    deleteAccount,
    sendPasswordReset,
    resetPassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
