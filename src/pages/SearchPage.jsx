import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, Heart, X, BookOpen, Sun, Moon, Sparkles } from 'lucide-react'
import { useLang } from '../context'
import { useTheme, useFavorites } from '../hooks'
import { searchVerses } from '../services/bibleApi'
import { BOOK_LIST } from '../data'
import { Footer, ScrollToTop, VersionSelector } from '../components'

const SUGGESTIONS = {
  es: ['amor', 'paz', 'fe', 'esperanza', 'fortaleza', 'gracia', 'perdón', 'gozo', 'confianza', 'oración', 'salvación', 'vida'],
  en: ['love', 'peace', 'faith', 'hope', 'strength', 'grace', 'forgiveness', 'joy', 'trust', 'prayer', 'salvation', 'life'],
}

const BOOK_BY_ID = Object.fromEntries(BOOK_LIST.map(b => [b.id, b]))

function highlight(text, query) {
  if (!query.trim()) return text
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.trim().toLowerCase()
      ? <mark key={i} className="sr-highlight">{part}</mark>
      : part
  )
}

export function SearchPage() {
  const { lang, bibleVersion } = useLang()
  const { theme, toggleTheme } = useTheme()
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef()
  const es = lang === 'es'

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setSearched(false)
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      const data = await searchVerses(query.trim(), lang, bibleVersion)
      setResults(data)
      setSearched(true)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [query, lang, bibleVersion])

  const getRef = (r) => {
    const book = BOOK_BY_ID[r.bookId]
    return book
      ? `${lang === 'es' ? book.es : book.en} ${r.chapter}:${r.verse}`
      : `${r.bookId} ${r.chapter}:${r.verse}`
  }

  const isFav = (r) => favorites.some(f => f.reference === getRef(r))

  const toggleFav = (r) => {
    const ref = getRef(r)
    if (isFav(r)) removeFavorite(ref, r.text)
    else addFavorite({ reference: ref, text: r.text, version: bibleVersion })
  }

  return (
    <div className="search-page">
      <nav className="bible-topbar">
        <div className="bible-topbar-left">
          <Link to="/" className="bible-back-link">
            <ArrowLeft size={18} /> <span>{es ? 'Inicio' : 'Home'}</span>
          </Link>
        </div>
        <div className="bible-topbar-right">
          <VersionSelector t={{ bibleVersionLabel: es ? 'Versión' : 'Version' }} compact />
          <button className="theme-btn" onClick={toggleTheme} aria-label="toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>

      <div className="sr-content">
        <h2 className="sr-title">
          <Search size={22} />
          {es ? 'Buscar en la Biblia' : 'Search the Bible'}
        </h2>

        <div className="sr-bar-wrap">
          <Search size={18} className="sr-bar-icon" />
          <input
            ref={inputRef}
            className="sr-bar-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={es ? 'Escribí una palabra o frase…' : 'Type a word or phrase…'}
          />
          {query && (
            <button className="sr-bar-clear" onClick={() => setQuery('')} aria-label="Limpiar">
              <X size={16} />
            </button>
          )}
        </div>

        {loading && (
          <div className="sr-loading"><div className="spinner" /></div>
        )}

        {!loading && searched && (
          <p className="sr-count">
            {results.length === 0
              ? (es ? 'Sin resultados' : 'No results found')
              : (es
                  ? `${results.length} resultado${results.length !== 1 ? 's' : ''}`
                  : `${results.length} result${results.length !== 1 ? 's' : ''}`
                )
            }
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="sr-list">
            {results.map((r, i) => {
              const ref = getRef(r)
              const fav = isFav(r)
              return (
                <div key={i} className="sr-card">
                  <div className="sr-card-body">
                    <span className="sr-card-ref">{ref}</span>
                    <p className="sr-card-text">{highlight(r.text, query)}</p>
                  </div>
                  <button
                    className={'sr-card-fav' + (fav ? ' active' : '')}
                    onClick={() => toggleFav(r)}
                    title={fav
                      ? (es ? 'Quitar de favoritos' : 'Remove from favorites')
                      : (es ? 'Guardar en favoritos' : 'Save to favorites')
                    }
                  >
                    <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {!loading && !searched && (
          <div className="sr-empty">
            <BookOpen size={48} strokeWidth={1.2} className="sr-empty-icon" />
            <p className="sr-empty-title">
              {es ? 'Buscá en toda la Biblia' : 'Search the entire Bible'}
            </p>
            <p className="sr-empty-sub">
              {es
                ? 'Ingresá una palabra, nombre o frase y encontrá versículos en segundos.'
                : 'Enter a word, name or phrase and find verses in seconds.'}
            </p>

            <div className="sr-suggestions">
              <span className="sr-suggestions-label">
                <Sparkles size={13} />
                {es ? 'Sugerencias' : 'Suggestions'}
              </span>
              <div className="sr-suggestions-chips">
                {SUGGESTIONS[lang].map(word => (
                  <button
                    key={word}
                    className="sr-chip"
                    onClick={() => setQuery(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
