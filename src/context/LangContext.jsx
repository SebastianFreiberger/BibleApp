import { createContext, useContext, useState } from 'react'
import { DEFAULT_VERSION } from '../data/bibleData'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'es')
  const [bibleVersion, setBibleVersionState] = useState(
    () => localStorage.getItem('bibleVersion') || DEFAULT_VERSION[localStorage.getItem('lang') || 'es']
  )

  const setLang = (newLang) => {
    const defaultVersion = DEFAULT_VERSION[newLang]
    setLangState(newLang)
    setBibleVersionState(defaultVersion)
    localStorage.setItem('lang', newLang)
    localStorage.setItem('bibleVersion', defaultVersion)
  }

  const setBibleVersion = (version) => {
    setBibleVersionState(version)
    localStorage.setItem('bibleVersion', version)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, bibleVersion, setBibleVersion }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) throw new Error('useLang debe usarse dentro de LangProvider')
  return context
}
