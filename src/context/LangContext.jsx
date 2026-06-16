import { createContext, useContext, useState } from 'react'
import { supabase } from '../services/supabase'
import { DEFAULT_VERSION } from '../data/bibleData'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'es')
  const [bibleVersion, setBibleVersionState] = useState(
    () => localStorage.getItem('bibleVersion') || DEFAULT_VERSION[localStorage.getItem('lang') || 'es']
  )

  const setLang = async (newLang) => {
    const defaultVersion = DEFAULT_VERSION[newLang]
    setLangState(newLang)
    setBibleVersionState(defaultVersion)
    localStorage.setItem('lang', newLang)
    localStorage.setItem('bibleVersion', defaultVersion)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.id) {
      await supabase.from('profiles')
        .update({ lang: newLang, bible_version: defaultVersion })
        .eq('id', session.user.id)
    }
  }

  const setBibleVersion = async (version) => {
    setBibleVersionState(version)
    localStorage.setItem('bibleVersion', version)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.id) {
      await supabase.from('profiles')
        .update({ bible_version: version })
        .eq('id', session.user.id)
    }
  }

  // Aplicar preferencias cargadas del perfil sin re-sincronizar a Supabase
  const applyProfilePrefs = (profileLang, profileVersion) => {
    if (profileLang) {
      setLangState(profileLang)
      localStorage.setItem('lang', profileLang)
    }
    if (profileVersion) {
      setBibleVersionState(profileVersion)
      localStorage.setItem('bibleVersion', profileVersion)
    }
  }

  return (
    <LangContext.Provider value={{ lang, setLang, bibleVersion, setBibleVersion, applyProfilePrefs }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang debe usarse dentro de LangProvider')
  return ctx
}
